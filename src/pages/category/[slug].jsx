import ProductList from "features/productList";
import MainLayout from "layouts/mainLayout";
import { useRouter } from "next/router";
import { getCategory } from "pages/api/categories";
import { getProducts } from "pages/api/products";
import React from "react";
import { jsonify } from "utils";

export default function CategorySlugPage({ products }) {
  return <div className="flex mx-auto  rounded-3xl w-10/12">hi</div>;
}

CategorySlugPage.PageLayout = MainWithCategoryLayout;

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const category = jsonify(await getCategory({ slug }));

  let products = await jsonify(getProducts({ category: category }));
  products.category = category;
  console.log(products);
  return {
    props: {
      products,
    },
  };
}
