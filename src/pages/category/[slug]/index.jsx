import React from "react";
import MainWithCategoryLayout from "layouts/mainWithCategoryLayout";
import ProductList from "features/product-list";
import { getProductsByCategorySlug } from "api";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function ShowProductsBySlugPage({ slug }) {
  const router = useRouter();
  const _slug = slug === router.query.slug ? slug : router.query.slug;
  const { data: products, isLoading } = useQuery(
    ["products", _slug],
    () => getProductsByCategorySlug(_slug),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return <ProductList products={products} />;
}

ShowProductsBySlugPage.PageLayout = MainWithCategoryLayout;

export async function getServerSideProps(context) {
  const { slug } = context.params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["products", slug], () =>
    getProductsByCategorySlug(slug)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      slug,
    },
  };
}
