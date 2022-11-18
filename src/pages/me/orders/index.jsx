import React from "react";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getOrders } from "api";

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery(["orders"], () => getOrders(), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <ProfileLayout>
      {isLoading ? (
        "loading"
      ) : (
        <div className="flex w-full p-2 gap-2">
          {orders?.map((order) => {
            return (
              <div key={order.id} className="flex flex-col gap-2 w-full">
                {order.basket_items.map((item) => {
                  return (
                    <>
                      <div className="flex justify-between gap-1 w-full">
                        <div key={item.id}>{item.product.name}</div>
                        <div key={item.id}>{item.product.price}</div>
                        <div key={item.id}>{item.quantity}</div>
                      </div>
                    </>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </ProfileLayout>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["orders"], () => getOrders());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      slug,
    },
  };
}

OrdersPage.PageLayout = MainLayout;
