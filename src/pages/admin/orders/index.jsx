import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";

//layout
import AdminLayout from "layouts/admin";

//ui
import Price from "ui/cards/product/price";
import withModal from "@/ui/modals/with-modal";
import Table, { TableSkeleton } from "@/features/admin/table";

// features
import OrderDetails from "features/admin/order/details";

// library
import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

//api
import { getOrders } from "api";
import { useRouter } from "next/router";
import { ORDER_STATUS } from "data";
import { useInView } from "framer-motion";

const TableWithModal = withModal(Table);

export default function OrdersPage() {
  // const {
  //   data: orders,
  //   isLoading,
  //   refetch,
  // } = useQuery(["orders"], () => getOrders(), {
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  // });
  const ref = useRef(undefined);
  const isInView = useInView(ref);
  const [orderStatuses, setOrderStatuses] = useState({
    ...{ ...ORDER_STATUS, ALL: "همه" },
  });
  const {
    status,
    data,
    error,
    isFetching,
    isLoading,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    [orderStatuses],
    ({ pageParam }) => {
      return getOrders({ pageParam });
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextId;
      },
    }
  );

  const [modal, setModal] = useState({
    isOpen: false,
  });

  const router = useRouter();

  const orders = data?.pages.map((page) => page.orders).flat(1);

  console.log(orders);

  function handleCloseModal() {
    setModal({
      isOpen: false,
    });
    // router.replace("/admin/orders", undefined, { shallow: true });
    // refetch();
  }
  useEffect(() => {
    if (isInView) {
      // fetchNextPage();
    }
  }, [isInView]);

  const columns =
    useMemo(
      () => [
        {
          Header: "شماره",
          accessor: "user.phonenumber",
          Cell: ({ row }) => {
            const order = row.original;
            return (
              <div
                onClick={() => {
                  setModal({
                    isOpen: true,
                    order,
                  });
                }}
                className="w-full bg-atysa-900 text-white  rounded-full py-2 px-2 shadow-md shadow-atysa-900 hover:shadow-sm transition-shadow cursor-pointer"
              >
                {order.user.phonenumber}
              </div>
            );
          },
        },
        {
          Header: "مبلغ سفارش",
          accessor: "total_price",
          Cell: ({ row }) => {
            const { total_price, tax } = row.original;
            return (
              <>
                <Price price={(total_price * tax).toFixed()} />
              </>
            );
          },
        },
        {
          Header: "وضعیت",
          accessor: "status",
          Cell: ({ row }) => {
            const { status } = row.original;
            return <>{ORDER_STATUS[status]}</>;
          },
        },
        {
          Header: "سفارش مجزا",
          accessor: "total_quantity",
          Cell: ({ row }) => {
            const { basket_items } = row.original;
            return <>{basket_items.length}</>;
          },
        },
        {
          Header: "تاریخ ثبت سفارش",
          accessor: "created_at",
        },
      ],
      []
    ) || [];

  return (
    <>
      {status === "loading" ? (
        "loading"
      ) : (
        <>
          {data.pages.length > 0 && (
            <TableWithModal
              {...{
                columns: data.pages.length > 0 ? columns : [],
                data: orders || [],

                size: "md",
                center: true,
                title: "جزئیات سفارش",
                isOpen: modal.isOpen,
              }}
              onClose={handleCloseModal}
            >
              <OrderDetails order={modal?.order} />
            </TableWithModal>
          )}
          <div>
            <button
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load Newer"
                : "Nothing more to load"}
            </button>
          </div>
          <div>
            {isFetching && !isFetchingNextPage
              ? "Background Updating..."
              : null}
          </div>
        </>
      )}
    </>
  );
}

OrdersPage.PageLayout = AdminLayout;

// export async function getServerSideProps(context) {
//   const data = await getOrders();
//   // const queryClient = new QueryClient();

//   // await queryClient.prefetchQuery(["orders"], () => getOrders());

//   const orders = jsonify({
//     pages: [{ data }],
//     pageParams: [{}],
//   });

//   return {
//     props: {
//       // dehydratedState: dehydrate(queryClient),
//       orders,
//     },
//   };
// }
function jsonify(value) {
  return JSON.parse(JSON.stringify(value));
}
