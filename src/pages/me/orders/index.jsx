import React, { useMemo, useRef } from "react";
import { useEffect } from "react";
import Image from "next/image";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";
//ui
import ProductImage from "ui/product-image";
import PriceWithLabel from "ui/price-with-label";
import Button from "ui/buttons";
import LinkButton from "ui/buttons/link-button";
import DateTime from "ui/date-time";
import withConfirmation from "ui/with-confirmation";

//icons
import LocationIcon from "ui/icons/location";
import ClockIcon from "ui/icons/clocks";
import CalendarIcon from "ui/icons/calendar";
import ExclamationIcon from "ui/icons/exclamation";
import CycleIcon from "ui/icons/cycle";

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

import { ORDER_STATUS } from "data";

import { useInView } from "react-intersection-observer";
import withModalState from "ui/modals/with-modal-state";
import Price from "ui/cards/product/price";
import FactorButton from "features/factor/factor-button";
import FactorContent from "features/factor";

const ButtonWithConfirm = withConfirmation(Button);

const ButtonWithModalState = withModalState(Button);
const FactorButtonWithModalState = withModalState(FactorButton);

export default function OrdersPage() {
  const {
    status,
    data,
    error,
    isError,
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
        return lastPage?.data?.nextId;
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const orders = useMemo(
    () => data?.pages?.map((page) => page?.data?.orders).flat(1),
    [data]
  );

  const { ref: loadingRef, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (isLoading)
    return (
      <ProfileLayout>
        <OrderListSkeleton />
      </ProfileLayout>
    );

  if (data?.pages[0].data.orders.length <= 0)
    return (
      <>
        <ProfileLayout>
          <div className="flex flex-col justify-center items-center gap-5 py-10">
            <Image
              src={"/images/no-orders.png"}
              objectFit="fill"
              width={200}
              height={200}
            />
            <span> سفارشی وجود ندارد</span>

            <LinkButton
              href={"/"}
              className="border-[1px] border-dashed text-atysa-800 hover:bg-atysa-900 hover:text-white w-fit"
            >
              همین الان سفارش بده
            </LinkButton>
          </div>
        </ProfileLayout>
      </>
    );

  return (
    <ProfileLayout withShadow={false}>
      <div className="flex w-full md:flex-row flex-col justify-between bg-gray-100 rounded-b-xl">
        <div className="w-full flex-grow">
          <div className="flex flex-col justify-center items-center flex-grow w-full pb-10 py-2 md:px-0 px-2  gap-2">
            {orders?.length > 0 &&
              orders.map((order, i) => {
                return (
                  <div
                    key={order.id}
                    className={`flex ${
                      order.status === "PURCHASED_AND_PENDING" ? "" : ""
                    } justify-between rounded-xl p-5 bg-white items-center flex-col gap-4 w-full  `}
                  >
                    {/* each order */}
                    <div className="flex justify-center items-center gap-2 w-full">
                      <div
                        className="flex flex-grow md:flex-row flex-col gap-4  justify-between md:items-center items-center md:bg-gradient-to-l from-white
                    to-atysa-primary rounded-lg p-2 "
                      >
                        <div className=" flex flex-grow justify-center items-center gap-3">
                          <div className="flex gap-1">
                            <LocationIcon className="w-4 h-4 fill-gray-500" />
                            <span className="flex justify-center items-center font-bold">
                              {order.address.title}
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-1 w-full">
                            <DateTime className="" value={order.created_at} />
                          </div>
                        </div>

                        <div className="">
                          <PriceWithLabel
                            className="text-atysa-main font-bold"
                            price={order.total_price * order.tax}
                            max={order.total_price.toString().length + 1}
                          />
                        </div>
                      </div>

                      {!order?.hasRated && (
                        <div className="w-fit">
                          <ButtonWithModalState
                            className="bg-atysa-primary text-atysa-main"
                            center
                            content="ثبت نظر"
                            size="sm"
                            title={`ثبت نظر`}
                          ></ButtonWithModalState>
                        </div>
                      )}
                    </div>

                    <OrdersProductsList list={order.basket_items} />

                    <div className="w-full md:flex-row flex-col gap-2 flex items-center justify-between">
                      <StatusButtons order={order} onRefetch={refetch} />
                      <div className="flex w-fit">
                        <FactorButtonWithModalState
                          center
                          size="sm"
                          title={`فاکتور سفارش`}
                        >
                          <FactorContent order={order} />
                        </FactorButtonWithModalState>
                      </div>
                      <div className="flex gap-2 justify-start items-center w-fit bg-atysa-primary text-atysa-main font-bold p-2 rounded-lg">
                        <Image
                          src="/images/image-icons/shipping-transfer-truck-time.png"
                          width={25}
                          height={25}
                        />
                        <span>تاریخ تحویل</span> :
                        <span>{order.deliver_datetime_string}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div
            ref={loadingRef}
            className="w-full flex justify-center items-center rounded-b-md  bg-atysa-5 text-black text-lg"
          >
            {isLoading && "..."}
          </div>
        </div>
        <div className="hidden md:flex justify-center items-center">
          <Image
            className="hidden md:flex px-10"
            src={"/images/illustrations/orders.png"}
            objectFit="contain"
            width={200}
            height={300}
          />
        </div>
      </div>
    </ProfileLayout>
  );
}

export function StatusButtons({ order, onRefetch = () => {} }) {
  if (!order.has_payed)
    return <span className="text-red-500">پرداخت نشده</span>;
  const queryClient = useQueryClient();
  const updateOrderStatusMutate = useMutation(
    ({ id, orderStatus }) => {
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
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
        onRefetch();
      },
    }
  );
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="flex w-fit">
        {order.status === "USER_REJECTED" ? (
          <div className={`p-2 rounded-lg  bg-red-100 text-red-600`}>
            {ORDER_STATUS[order.status]}
          </div>
        ) : (
          <div
            className={`flex justify-center items-center gap-2 rounded-lg  text-atysa-main`}
          >
            {order.status === "PURCHASED_AND_PENDING" && (
              <Image
                className=""
                src={"/images/image-icons/waiting-room-vip-clock.png"}
                objectFit="contain"
                width={25}
                height={25}
              />
            )}

            {ORDER_STATUS[order.status]}
          </div>
        )}
      </div>
      <div className="flex w-fit">
        {order.status === "PURCHASED_AND_PENDING" &&
          updateOrderStatusMutate.status !== "success" && (
            <ButtonWithConfirm
              withModal={false}
              title="لغو سفارش"
              onClick={() => {
                updateOrderStatusMutate.mutate({
                  id: order.id,
                  orderStatus: "USER_REJECTED",
                });
              }}
              extraClass={`px-2 rounded-md  bg-red-100 text-red-600`}
              disabled={updateOrderStatusMutate.status === "loading"}
              isLoading={updateOrderStatusMutate.status === "loading"}
            >
              لغو سفارش
            </ButtonWithConfirm>
          )}
      </div>
    </div>
  );
}

function OrderListSkeleton() {
  return (
    <div
      role="status"
      className="w-full p-4 space-y-4  rounded  divide-y divide-gray-200 shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function OrdersProductsList({ list = [], withProductPrice = false }) {
  return (
    <>
      <div className="w-full flex flex-row flex-wrap gap-2">
        {list.map(({ id, quantity, product }) => {
          return (
            <>
              <div
                key={id}
                className="flex md:w-auto w-full  justify-between  gap-1 rounded-xl "
              >
                <div className="flex gap-5 md:w-auto w-full justify-center items-center bg-gray-100 rounded-xl px-2 ">
                  <div className="flex justify-center items-center w-14 h-14">
                    {product.defaultImage ? (
                      <ProductImage src={product.defaultImage} />
                    ) : (
                      <Image
                        src={"/images/image-icons/custom-dish.png"}
                        objectFit="contain"
                        width={25}
                        height={25}
                      />
                    )}
                  </div>
                  <div>{product.name}</div>
                  <div className="flex gap-2 justify-center items-center">
                    <span className="text-[0.7rem]">x</span>
                    <span>{quantity}</span>
                    {withProductPrice && (
                      <Price price={quantity * product.price} />
                    )}
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

OrdersPage.PageLayout = MainLayout;
