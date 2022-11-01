import React from "react";
import AdminLayout from "layouts/adminLayout";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import ProductAll from "@/features/admin/product/all";

import { getProducts } from "api";

export default function ProductsPage() {
  return (
    <>
      <div className="flex flex-col w-full h-5/6">
        <div className="flex w-full"></div>
        <div className="flex flex-col w-full h-full justify-center gap-5 items-center">
          <div className="w-full overflow-hidden rounded-[20px]">
            <ProductAll />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["products"], getProducts);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
ProductsPage.PageLayout = AdminLayout;
