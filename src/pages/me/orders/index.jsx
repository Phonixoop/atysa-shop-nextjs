import React from "react";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getOrders } from "api";

export default function OrdersPage() {
  return "hi";
}

export async function getServerSideProps(context) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["orders"], () => getOrders());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

OrdersPage.PageLayout = MainLayout;
