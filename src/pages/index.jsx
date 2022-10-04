import MainWithCategoryLayout from "@/layouts/mainWithCategoryLayout";

// next auth

import ProductList from "@/features/productList";
import { getProducts } from "@/api/products";
import { jsonify } from "@/utils";
// import { unstable_getServerSession } from "next-auth";
// import { authOptions } from "./api/auth/[...nextauth]";
import { getSession, useSession } from "next-auth/react";

export default function HomePage({ products }) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-blue-50 min-h-full my-5">
      <div className="w-10/12 flex flex-col gap-5">
        <h2
          dir="rtl"
          className="w-full flex justify-start px-5 text-xl font-bold  text-right"
        >
          محصولات VIP
        </h2>
        <ProductList products={products} />
      </div>
    </div>
  );
}

HomePage.PageLayout = MainWithCategoryLayout;

export async function getServerSideProps(context) {
  // const session = await unstable_getServerSession(req, res, authOptions);
  // console.log(session);
  const session = await getSession();
  const products = jsonify(await getProducts());
  return { props: { products } };
}
