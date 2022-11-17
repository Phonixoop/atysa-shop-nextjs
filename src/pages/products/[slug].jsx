import React from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import MainLayout from "layouts/mainLayout";
import { getProductBySlug } from "api";

import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

//ui
import BlurImage from "ui/blur-image";
import MaterialsList from "ui/cards/product/materials-list";
import Price from "ui/cards/product/price";
import CategoryList from "ui/cards/product/categories-list";
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
        <CategoryList categories={product?.categories} />
        <AddProductButton id={product.id} product={product} />
      </div>
    </div>
  );
}

function Slider({ imageUrls = [] }) {
  const [activeImageUrl, setActiveImageUrl] = useState(imageUrls[0]);
  return (
    <div className="flex justify-center items-center gap-2 w-full h-full ">
      <div className="w-80 h-auto rounded-lg">
        <BlurImage
          objectFit="fill"
          className="rounded-lg"
          src={activeImageUrl}
        />
      </div>
      <div className="flex flex-col gap-4 w-auto h-full">
        {imageUrls.map((url, i) => {
          return (
            <div
              key={i}
              onClick={() => setActiveImageUrl(url)}
              className={`w-16 h-16 cursor-pointer ring-black rounded-lg p-[1px] transition-transform ${
                url === activeImageUrl ? "ring-2 scale-95" : ""
              }`}
            >
              <BlurImage className="rounded-lg" src={url} />
            </div>
          );
        })}
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
