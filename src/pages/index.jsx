import MainWithCategoryLayout from "@/layouts/mainWithCategoryLayout";

// next auth

import ProductList from "@/features/productList";
import { getProducts } from "@/api/products";
import { jsonify } from "@/utils";
// import { unstable_getServerSession } from "next-auth";
// import { authOptions } from "./api/auth/[...nextauth]";
import { getSession, useSession } from "next-auth/react";
import LandingPageV1 from "features/landing/v1";

export default function HomePage({ products }) {
  return <LandingPageV1 products={products} />;
}
HomePage.PageLayout = MainWithCategoryLayout;

export async function getServerSideProps(context) {
  // const session = await unstable_getServerSession(req, res, authOptions);
  // console.log(session);
  const session = await getSession();
  const products = jsonify(await getProducts());
  return { props: { products } };
}
