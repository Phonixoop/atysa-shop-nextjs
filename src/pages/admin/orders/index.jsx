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
const orderStatusList = Object.entries({
  ...ORDER_STATUS,
  HAS_PAYED: "پرداخت شده",
})
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
    orderStatusList.at(-1),
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
                className="w-full cursor-pointer rounded-full  bg-atysa-900 py-2 px-2 text-white shadow-md shadow-atysa-900 transition-shadow hover:shadow-sm"
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
          Header: "وضعیت پرداخت",
          accessor: "has_payed",
          Cell: ({ row }) => {
            const { has_payed } = row.original;
            return (
              <>
                {has_payed ? (
                  <span className="font-bold text-emerald-500">پرداخت شده</span>
                ) : (
                  <span className="text-red-500">پرداخت نشده</span>
                )}
              </>
            );
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
    <div className="flex w-full flex-col items-center justify-center gap-5">
      <MultiBox
        className="justify-right flex select-none flex-wrap items-center  gap-3"
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
              className={`cursor-pointer rounded-lg px-2 py-1 text-sm ${
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
        <div className="flex w-full flex-col items-center justify-center gap-5">
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
              className="bg-atysa-900 text-white "
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
