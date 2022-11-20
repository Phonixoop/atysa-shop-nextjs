import React from "react";
import { useRouter } from "next/router";
import MainLayout from "layouts/mainLayout";
import { getProductBySlug } from "api";
import Slider from "ui/slider";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

//ui
import MaterialsList from "ui/cards/product/materials-list";
import Price from "ui/cards/product/price";
import ProductCategoryList from "ui/cards/product/categories-list";
import AddProductButton from "ui/cards/product/add-product-button";

export default function ProductPage({ slug }) {
  const router = useRouter();
  const _slug = slug === router.query.slug ? slug : router.query.slug;
  const { data: product, isLoading } = useQuery(
    ["product", _slug],
    () => getProductBySlug(_slug),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  return (
    <div dir="rtl" className="flex gap-2 w-9/12 h-1/2 mx-auto">
      <div className="w-auto">
        <Slider imageUrls={[product.defaultImage, ...product.images]} />
      </div>
      <div className="flex flex-col w-full h-full gap-5 bg-white p-5 rounded-lg">
        <MaterialsList
          className="relative flex flex-row gap-2"
          list={product.materials}
        />
        <Price price={product.price} />
        <ProductCategoryList categories={product?.categories} />
        <AddProductButton id={product.id} product={product} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["product", slug], () =>
    getProductBySlug(slug)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      slug,
    },
  };
}

ProductPage.PageLayout = MainLayout;
