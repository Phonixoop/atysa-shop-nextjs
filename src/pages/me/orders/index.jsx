import React, { useMemo, useRef } from "react";
import { useState } from "react";
import Image from "next/image";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";
//ui
import ProductImage from "@/ui/product-image";
import PriceWithLabel from "ui/price-with-label";
import Button from "ui/buttons";
import LinkButton from "ui/buttons/link-button";

import withConfirmation from "ui/with-confirmation";
//icons
import LocationIcon from "ui/icons/location";
import ClockIcon from "ui/icons/clocks";
import CalendarIcon from "ui/icons/calendar";
import ExclamationIcon from "ui/icons/exclamation";
import CycleIcon from "ui/icons/cycle";

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
        console.log({ lastPage });
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
}

export function StatusButtons({ order, refetch = () => {} }) {
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
        refetch();
      },
    }
  );
  return (
    <>
      <div className="flex w-fit">
        {order.status === "USER_REJECTED" ? (
          <div className={`p-2 rounded-lg  bg-red-100 text-red-600`}>
            {ORDER_STATUS[order.status]}
          </div>
        ) : (
          <Button
            className={`p-2 rounded-lg border-dashed border-[1px] border-atysa-900 bg-white text-atysa-900`}
          >
            {ORDER_STATUS[order.status]}
          </Button>
        )}
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
              extraClass={`px-2 rounded-full  bg-red-100 text-red-600`}
              disabled={updateOrderStatusMutate.status === "loading"}
              isLoading={updateOrderStatusMutate.status === "loading"}
            >
              لغو سفارش
            </ButtonWithConfirm>
          )}
      </div>
    </>
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

OrdersPage.PageLayout = MainLayout;
