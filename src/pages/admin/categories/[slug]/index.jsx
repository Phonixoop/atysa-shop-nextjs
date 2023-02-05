import React from "react";
import AdminLayout from "layouts/admin";
import CategoryDetails from "features/admin/category/details";
import { getCategoryBySlug } from "api";
import { dehydrate, QueryClient } from "@tanstack/react-query";

export default function CategorySlug({ slug }) {
  return (
    <div className="absolute top-1/2 left-1/2 z-[200] flex  h-5/6  w-11/12 -translate-y-1/2 -translate-x-1/2 flex-col items-center justify-center gap-6 overflow-hidden rounded-xl  bg-gray-100 md:w-5/12 ">
      <CategoryDetails {...{ slug }} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["categories", slug], () =>
    getCategoryBySlug(slug)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      slug,
    },
  };
}
CategorySlug.PageLayout = AdminLayout;
