import React, { useMemo, useRef } from "react";
import { useState } from "react";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";
//ui
import ProductImage from "@/ui/product-image";
import PriceWithLabel from "ui/price-with-label";
import Button from "ui/buttons";

import withConfirmation from "ui/with-confirmation";
//icons
import Location from "ui/icons/location";
import Clock from "ui/icons/clocks";
import Calendar from "ui/icons/calendar";
import Exclamation from "ui/icons/exclamation";
import Cycle from "ui/icons/cycle";

// libraries
import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

//api
import { getUserOrders, updateOrderStatus } from "api";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";

import { ORDER_STATUS } from "data";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const ButtonWithConfirm = withConfirmation(Button);

export default function OrdersPage() {
  const {
    status,
    data,
    error,
    isFetching,
    isLoading,
    refetch,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    ["orders"],
    ({ pageParam }) => {
      return getUserOrders({
        pageParam,
      });
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.nextId;
      },
    }
  );

  const orders = useMemo(
    () => data?.pages?.map((page) => page.data.orders).flat(1),
    [data]
  );

  const { ref: loadingRef, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
      console.log("in view");
    }
  }, [inView]);

  return (
    <ProfileLayout>
      <h2 className="text-right p-5 text-lg font-bold w-full text-atysa-800">
        سفارش های من
      </h2>

      {isLoading ? (
        <span className="py-5">...</span>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center w-full pb-10  gap-2">
            {orders.map((order, i) => {
              return (
                <div
                  key={order.id}
                  className="flex justify-between p-5 items-center flex-col gap-2 w-full  border-b-2 last:border-none border-gray-200"
                >
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

                  <div className="w-full flex flex-row flex-wrap gap-2">
                    {order.basket_items.map(({ id, quantity, product }) => {
                      return (
                        <>
                          <div
                            key={id}
                            className="flex justify-between  gap-1 rounded-xl "
                          >
                            <div className="flex gap-5 justify-center items-center ">
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
                  </div>
                  <div className="w-full flex flex-wrap justify-start items-center gap-2 ">
                    <div className="flex w-fit">
                      <PriceWithLabel
                        price={order.total_price * order.tax}
                        max={order.total_price.toString().length + 1}
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
                    <StatusButtons order={order} refetch={refetch} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div
        ref={loadingRef}
        className="w-full flex justify-center items-center rounded-b-md  bg-atysa-50 text-black text-lg"
      >
        {isLoading && "..."}
      </div>
    </ProfileLayout>
  );
}

export function StatusButtons({ order, refetch = () => {} }) {
  const queryClient = useQueryClient();
  const updateOrderStatusMutate = useMutation(
    ({ id, orderStatus }) => {
      console.log({ id, orderStatus });
      updateOrderStatus({ id, orderStatus });
    },
    {
      // onMutate: async (updateOrderStatus) => {
      //   await queryClient.cancelQueries({
      //     queryKey: ["orders"],
      //   });
      //   const previousOrder = queryClient.getQueryData(["orders"]);

      //   queryClient.setQueryData(["orders"], updateOrderStatus);

      //   return { previousOrder, updateOrderStatus };
      // },
      // onError: (err, updateOrderStatus, context) => {
      //   queryClient.setQueryData(["orders"], context.previousOrder);
      // },
      onSettled: (updateOrderStatus) => {
        console.log({ updateOrderStatus }, "onSettled");
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
        refetch();
      },
    }
  );
  return (
    <>
      <div className="flex w-fit">
        <Button extraClass="px-2 rounded-full bg-atysa-25 text-atysa-400">
          {ORDER_STATUS[order.status]}
        </Button>
      </div>
      <div className="flex w-fit">
        {order.status === "PURCHASED_AND_PENDING" &&
          updateOrderStatusMutate.status !== "success" && (
            <ButtonWithConfirm
              onClick={() => {
                updateOrderStatusMutate.mutate({
                  id: order.id,
                  orderStatus: "USER_REJECTED",
                });
              }}
              extraClass="px-2 rounded-full  bg-red-100 text-red-600"
              disabled={updateOrderStatusMutate.status === "loading"}
              isLoading={updateOrderStatusMutate.status === "loading"}
            >
              لغو سفارش
              {updateOrderStatusMutate.status}
            </ButtonWithConfirm>
          )}
      </div>
    </>
  );
}

OrdersPage.PageLayout = MainLayout;
