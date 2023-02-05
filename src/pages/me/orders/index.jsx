import React, { useMemo, useRef, useState } from "react";
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
import UserRateCommenView from "features/user-rate-comment-view";
import Modal from "ui/modals";

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
          <div className="flex flex-col items-center justify-center gap-5 py-10">
            <Image
              src={"/images/no-orders.png"}
              objectFit="fill"
              width={200}
              height={200}
            />
            <span> سفارشی وجود ندارد</span>

            <LinkButton
              href={"/"}
              className="w-fit border-[1px] border-dashed text-atysa-800 hover:bg-atysa-900 hover:text-white"
            >
              همین الان سفارش بده
            </LinkButton>
          </div>
        </ProfileLayout>
      </>
    );

  return (
    <ProfileLayout withShadow={false}>
      <div className="flex w-full flex-col justify-between rounded-b-xl bg-gray-100 md:flex-row">
        <div className="w-full flex-grow">
          <div className="flex w-full flex-grow flex-col items-center justify-center gap-2 py-2 px-2 pb-10  md:px-0">
            {orders?.length > 0 &&
              orders.map((order, i) => {
                return (
                  <div
                    key={order.id}
                    className={`flex ${
                      order.status === "PURCHASED_AND_PENDING" ? "" : ""
                    } w-full flex-col items-center justify-between gap-4 rounded-xl bg-white p-5  `}
                  >
                    {/* each order */}
                    <div className="flex w-full flex-wrap items-center justify-center gap-2">
                      <div
                        className="flex flex-grow flex-col items-center justify-between  gap-4 rounded-lg from-white to-atysa-primary p-2
                    md:flex-row md:items-center md:bg-gradient-to-l "
                      >
                        <div className=" flex flex-grow items-center justify-center gap-3">
                          <div className="flex gap-1">
                            <LocationIcon className="h-4 w-4 fill-gray-500" />
                            <span className="flex items-center justify-center font-bold">
                              {order.address.title}
                            </span>
                          </div>
                          <div className="flex w-full items-center justify-between gap-1">
                            <DateTime className="" value={order.created_at} />
                          </div>
                        </div>

                        <div className="">
                          <PriceWithLabel
                            className="font-bold text-atysa-main"
                            price={order.total_price * order.tax}
                            max={order.total_price.toString().length + 1}
                          />
                        </div>
                      </div>

                      {(!order?.has_rated || false) && order.has_payed && (
                        <div className="w-fit">
                          <SubmitCommentButtonModal order={order} />
                        </div>
                      )}
                    </div>

                    <OrdersProductsList list={order.basket_items} />

                    <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
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
                      <div className="flex w-fit items-center justify-start gap-2 rounded-lg bg-atysa-primary p-2 font-bold text-atysa-main">
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
            className="bg-atysa-5 flex w-full items-center justify-center  rounded-b-md text-lg text-black"
          >
            {isLoading && "..."}
          </div>
        </div>
        <div className="hidden items-center justify-center md:flex">
          <Image
            className="hidden px-10 md:flex"
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
  if (!order.has_payed)
    return <span className="text-red-500">پرداخت نشده</span>;

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex w-fit">
        {order.status === "USER_REJECTED" ? (
          <div className={`rounded-lg bg-red-100  p-2 text-red-600`}>
            {ORDER_STATUS[order.status]}
          </div>
        ) : (
          <div
            className={`flex items-center justify-center gap-2 rounded-lg  text-atysa-main`}
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
      className="dark:divide-gray-700 dark:border-gray-700 w-full  animate-pulse  space-y-4 divide-y divide-gray-200 rounded p-4 shadow md:p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="dark:bg-gray-600 mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
          <div className="dark:bg-gray-700 h-2 w-32 rounded-full bg-gray-200"></div>
        </div>
        <div className="dark:bg-gray-700 h-2.5 w-12 rounded-full bg-gray-300"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="dark:bg-gray-600 mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
          <div className="dark:bg-gray-700 h-2 w-32 rounded-full bg-gray-200"></div>
        </div>
        <div className="dark:bg-gray-700 h-2.5 w-12 rounded-full bg-gray-300"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="dark:bg-gray-600 mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
          <div className="dark:bg-gray-700 h-2 w-32 rounded-full bg-gray-200"></div>
        </div>
        <div className="dark:bg-gray-700 h-2.5 w-12 rounded-full bg-gray-300"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="dark:bg-gray-600 mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
          <div className="dark:bg-gray-700 h-2 w-32 rounded-full bg-gray-200"></div>
        </div>
        <div className="dark:bg-gray-700 h-2.5 w-12 rounded-full bg-gray-300"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="dark:bg-gray-600 mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
          <div className="dark:bg-gray-700 h-2 w-32 rounded-full bg-gray-200"></div>
        </div>
        <div className="dark:bg-gray-700 h-2.5 w-12 rounded-full bg-gray-300"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function OrdersProductsList({ list = [], withProductPrice = false }) {
  return (
    <>
      <div className="flex w-full flex-row flex-wrap gap-2">
        {list.map(({ id, quantity, product }) => {
          return (
            <>
              <div
                key={id}
                className="flex w-full justify-between  gap-1  rounded-xl md:w-auto "
              >
                <div className="flex w-full items-center justify-center gap-5 rounded-xl bg-gray-100 px-2 md:w-auto ">
                  <div className="flex h-14 w-14 items-center justify-center">
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
                  <div className="flex items-center justify-center gap-2">
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

function SubmitCommentButtonModal({ order }) {
  const [modal, setModal] = useState({ isOpen: false });
  function closeModal() {
    setModal({ isOpen: false });
  }
  return (
    <>
      <Button
        onClick={() => setModal({ isOpen: true })}
        className="bg-atysa-primary text-atysa-main"
      >
        ثبت نظر
      </Button>
      <Modal
        center
        content="ثبت نظر"
        size="sm"
        title={`ثبت نظر`}
        isOpen={modal.isOpen}
        onClose={closeModal}
      >
        <UserRateCommenView order={order} onSettled={closeModal} />
      </Modal>
    </>
  );
}

OrdersPage.PageLayout = MainLayout;
