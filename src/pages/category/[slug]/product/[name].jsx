import React from "react";
import { useRouter } from "next/router";
import { getProduct } from "@/api/products";
import { jsonify } from "@/utils";
import MainWithCategoryLayout from "@/layouts/MainWithCategoryLayout";
export default function ProductPage({ product }) {
  return <div>hi {JSON.stringify(product)}</div>;
}

ProductPage.PageLayout = MainWithCategoryLayout;

export async function getServerSideProps(context) {
  const { name } = context.params;
  console.log(name);
  const product = jsonify(await getProduct({ name }));
  return { props: { product } };
}
