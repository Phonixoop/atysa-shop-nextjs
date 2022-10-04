import ProductList from "features/productList";
import MainLayout from "layouts/mainLayout";
import MainWithCategoryLayout from "layouts/mainWithCategoryLayout";
import { useRouter } from "next/router";
import { getCategory } from "pages/api/categories";
import { getProducts } from "pages/api/products";
import React from "react";
import { jsonify } from "utils";

export default function CategorySlugPage({ products }) {
  return (
    <div className="flex  justify-center items-center  mx-auto  rounded-3xl w-10/12">
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <h1 className="w-full top-1/2 text-center text-2xl">
          محصولی در این دسته وجود ندارد
        </h1>
      )}
    </div>
  );
}
CategorySlugPage.PageLayout = MainWithCategoryLayout;

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const category = jsonify(await getCategory({ slug }));

  if (category === undefined) return { props: { products: [] } };
  const products = jsonify(await getProducts({ category: category._id }));

  return { props: { products } };
}
