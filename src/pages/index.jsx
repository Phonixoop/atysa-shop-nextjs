import MainWithCategoryLayout from "layouts/mainWithCategoryLayout";
import { getProducts, getCategories } from "api";
import LandingPageV1 from "features/landing/v1";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import Toast, { Test } from "ui/toast";
import { useState } from "react";

//icons
import ExclamationIcon from "ui/icons/exclamation";
import AdminBar from "../features/admin-bar";

export default function HomePage() {
  return (
    <>
      <LandingPageV1 />

      {/* <Toast isOpen={true} className="bg-amber-300/30">
        <div className="w-full flex flex-col gap-2 p-2 ">
          <div className="flex justify-between items-center gap-2 font-bold w-full text-right">
            <span className="flex justify-start items-center gap-2  text-amber-800">
              <ExclamationIcon className="w-4 h-4 fill-amber-800" />
              افزودن محصول
            </span>
            <span className="text-amber-900">سالاد سزار</span>
          </div>
          <p className="text-amber-900">
            زمان ارسال این محصول با بقیه محصول ها تداخل دارد
          </p>
        </div>
      </Toast> */}
    </>
  );
}
HomePage.PageLayout = MainWithCategoryLayout;

export async function getServerSideProps(context) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["products"], getProducts);
  await queryClient.prefetchQuery(["categories"], getCategories);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
// export async function getServerSideProps(context) {
//   // const session = await unstable_getServerSession(req, res, authOptions);
//   // console.log(session);

//   const categories = await getCategory();
//   if (categories === undefined || categories === [])
//     return { props: { products: [] } };

//   const session = await getSession();
//   const products = jsonify(await getProducts());
//   return { props: { products } };
// }
