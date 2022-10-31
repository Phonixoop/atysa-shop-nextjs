import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "layouts/adminLayout";

import { getProducts } from "api";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

import ProductAll from "@/features/admin/product/all";
export default function ProductsPage() {
  const { data: products } = useQuery(["products"], getProducts, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const columns = useMemo(
    () => [
      {
        Header: "نام",
        accessor: "name",
      },
      {
        Header: "پیوند",
        accessor: "slug",
      },
      {
        Header: "قیمت",
        accessor: "price",
      },
      {
        Header: "دسته بندی",
        accessor: "categories",
        Cell: ({ row }) => {
          const data = row.original;
          return data.categories.map((item) => (
            <>
              <span className="bg-atysa-secondry text-white rounded-full py-1 px-2">
                {item.name}
              </span>
            </>
          ));
        },
      },
    ],
    []
  );

  return (
    <>
      <ProductAll columns={columns} data={products} />
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
