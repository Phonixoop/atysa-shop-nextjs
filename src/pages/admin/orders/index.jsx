import React, { useMemo, useState } from "react";

//layout
import AdminLayout from "layouts/admin";

//ui
import ProductImage from "@/ui/product-image";
import PriceWithLabel from "ui/price-with-label";
import Button from "ui/buttons";
import Price from "ui/cards/product/price";
import withModal from "@/ui/modals/with-modal";
import Table, { TableSkeleton } from "@/features/admin/table";

//icon
import Location from "ui/icons/location";
import Clock from "ui/icons/clocks";
import Calendar from "ui/icons/calendar";
import Exclamation from "ui/icons/exclamation";
import Cycle from "ui/icons/cycle";

// library
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

//api
import { getOrders } from "api";
import { useRouter } from "next/router";
import { ORDER_STATUS } from "data";

const TableWithModal = withModal(Table);

export default function OrdersPage() {
  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery(["orders"], () => getOrders(), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const [modal, setModal] = useState({
    isOpen: false,
  });

  const router = useRouter();

  function handleCloseModal() {
    setModal({
      isOpen: false,
    });
    // router.replace("/admin/orders", undefined, { shallow: true });
    refetch();
  }

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
          Header: "سفارش مجزا",
          accessor: "total_quantity",
          Cell: ({ row }) => {
            const { basket_items } = row.original;
            return <>{basket_items.length}</>;
          },
        },
      ],
      []
    ) || [];

  return (
    <>
      {isLoading ? (
        "loading..."
      ) : (
        <TableWithModal
          {...{
            columns,
            data: orders,
            size: "md",
            center: true,
            title: "جزئیات سفارش",
            isOpen: modal.isOpen,
          }}
          onClose={handleCloseModal}
        >
          {modal.order && (
            <div
              dir="rtl"
              className="flex flex-col justify-center items-center w-full pb-10  gap-2"
            >
              <div className="flex justify-between p-5 items-center flex-col gap-2 w-full border-b-2 border-gray-200">
                {/* each order */}
                <div className="flex gap-4 w-full justify-start items-center ">
                  <div className="flex gap-1 w-fit ">
                    <Location />
                    <span className="text-sm text-atysa-900">خانه</span>
                  </div>
                  <div className="flex gap-1 w-fit">
                    <Calendar />
                    <span className="text-sm text-atysa-900">
                      دوشنبه ۲۳ آبان
                    </span>
                  </div>
                  <div className="flex gap-1 w-fit">
                    <Clock className="w-4 h-4 fill-gray-300" />
                    <span className="text-sm text-atysa-900">19:50</span>
                  </div>
                </div>

                {modal.order.basket_items.map(({ id, quantity, product }) => {
                  return (
                    <>
                      <div
                        key={id}
                        className="flex justify-between products-center w-full gap-1  "
                      >
                        <div className="flex gap-5 justify-center items-center products-center">
                          <div className="w-14 h-14">
                            <ProductImage src={product.defualtImage} />
                          </div>
                          <div>{product.name}</div>
                          <div>{quantity}x</div>
                        </div>
                      </div>
                    </>
                  );
                })}
                <div className="w-full flex justify-start items-center gap-2 ">
                  <div className="flex w-fit">
                    <PriceWithLabel
                      price={modal.order.total_price * modal.order.tax}
                      max={modal.order.total_price.toString().length + 1}
                    />
                  </div>
                  <div className="flex w-fit">
                    <Button extraClass="bg-atysa-500">
                      <div className="flex justify-between gap-2 items-center group">
                        <Cycle className="w-[1.15rem] h-[1.15rem] fill-white  group-hover:animate-spin " />
                        سفارش مجدد
                      </div>
                    </Button>
                  </div>
                  <div className="flex w-fit">
                    <Button extraClass=" bg-transparent ring-1 ring-inset ring-atysa-600 text-atysa-600">
                      <div className="flex justify-between gap-2 items-center">
                        <Exclamation className="w-[1.15rem] h-[1.15rem] fill-atysa-600" />
                        مشاهده فاکتور
                      </div>
                    </Button>
                  </div>
                  <div className="flex w-fit">
                    <select name="" id="">
                      {Object.entries(ORDER_STATUS).map(([key, value]) => {
                        return (
                          <option
                            value={key}
                            selected={modal.order.status === key}
                          >
                            {value}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TableWithModal>
      )}
      {/* <pre dir="rtl">{JSON.stringify(orders[0].user, null, 2)}</pre>; */}
    </>
  );
}

OrdersPage.PageLayout = AdminLayout;

export async function getServerSideProps(context) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["orders"], () => getOrders());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
