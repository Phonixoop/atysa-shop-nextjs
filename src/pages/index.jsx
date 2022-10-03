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
    <div className="flex flex-col justify-center items-center w-full h-full bg-blue-50 min-h-full">
      <div className="w-full">
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
