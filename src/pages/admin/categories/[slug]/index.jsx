import React from "react";
import AdminLayout from "layouts/admin";
import CategoryDetails from "@/features/admin/category/details";
import { getCategoryBySlug } from "api";
import { dehydrate, QueryClient } from "@tanstack/react-query";

export default function CategorySlug({ slug }) {
  return (
    <div className="flex gap-6 flex-col justify-center items-center  bg-gray-100  w-11/12 md:w-5/12 h-5/6 absolute z-[200] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  rounded-xl overflow-hidden ">
      <CategoryDetails {...{ slug }} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;
  console.dir({ slug });
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
