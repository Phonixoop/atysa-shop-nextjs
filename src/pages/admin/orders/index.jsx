import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";

//layout
import AdminLayout from "layouts/admin";

//ui
import Button from "ui/buttons";
import Price from "ui/cards/product/price";
import withModal from "ui/modals/with-modal";
import Table, { TableSkeleton } from "features/admin/table";
import DateTime from "ui/date-time";
import MultiBox from "ui/forms/multi-box";

//loading
import ThreeDotsWave from "ui/loadings/three-dots-wave";

// features
import OrderDetails from "features/admin/order/details";

// library
import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import moment from "jalali-moment";
//api
import { getOrders } from "api";
import { useRouter } from "next/router";
import { ORDER_STATUS } from "data";
import { useInView } from "framer-motion";
import { OrderStatus } from "@prisma/client";

const TableWithModal = withModal(Table);
const orderStatusesWithAll = { ALL: "همه", ...ORDER_STATUS };
const orderStatusList = Object.entries(ORDER_STATUS)
  // iterate over them and generate the array
  .map(([key, value], i) => {
    // generate the array element
    return {
      id: i,
      status: {
        key,
        value,
      },
    };
  });

export default function OrdersPage() {
  const ref = useRef(undefined);
  const isInView = useInView(ref);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState([
    orderStatusList[0],
    orderStatusList[2],
  ]);

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
    [...selectedOrderStatus?.map((selected) => selected.status.key)],
    ({ pageParam }) => {
      return getOrders({
        pageParam,
        orderStatuses: [
          ...selectedOrderStatus.map((selected) => selected.status.key),
        ],
      });
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.nextId;
      },
    }
  );

  const [modal, setModal] = useState({
    isOpen: false,
  });

  const router = useRouter();

  const orders = useMemo(
    () => data?.pages.map((page) => page.data.orders).flat(1),
    [data]
  );

  function handleCloseModal() {
    setModal({
      isOpen: false,
    });
  }
  // useEffect(() => {
  //   if (isInView) {
  //     // fetchNextPage();
  //   }
  // }, [isInView]);

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
          Cell: ({ row }) => {
            const { created_at } = row.original;
            return <DateTime value={created_at} />;
          },
        },
      ],
      []
    ) || [];

  return (
    <div className="flex flex-col gap-5 w-full justify-center items-center">
      <MultiBox
        className="flex flex-wrap justify-right items-center gap-3  select-none"
        multiple
        min={0}
        initialKeys={selectedOrderStatus.map((a) => a.id)}
        list={orderStatusList}
        onChange={(selectedStatuses) => {
          setSelectedOrderStatus(selectedStatuses);
        }}
        renderItem={(item, selected) => {
          return (
            <span
              className={`text-sm cursor-pointer px-2 py-1 rounded-lg ${
                selected
                  ? "bg-atysa-900 text-white"
                  : "bg-gray-300 text-atysa-900"
              }`}
            >
              {item.status.value}
            </span>
          );
        }}
      />

      {status === "loading" ? (
        <ThreeDotsWave />
      ) : data == undefined ? (
        "سفارشی وجود ندارد"
      ) : (
        <div className="flex flex-col gap-5 w-full justify-center items-center">
          {data.pages.length > 0 && (
            <TableWithModal
              {...{
                columns: data.pages.length > 0 ? columns : [],
                data: data?.pages[0].error ? [] : orders,

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
          <div className="flex w-fit">
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className="bg-atysa-900 "
            >
              {isFetchingNextPage
                ? "در حال لود"
                : hasNextPage
                ? "بیشتر"
                : "تمام"}
            </Button>
          </div>
          <div>
            {isFetching && !isFetchingNextPage
              ? "Background Updating..."
              : null}
          </div>
        </div>
      )}
    </div>
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
