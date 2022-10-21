import MainWithCategoryLayout from "@/layouts/mainWithCategoryLayout";
import ProductList from "@/features/productList";
import { getCategory } from "@/api/categories";
import { getProducts } from "@/api/products";
import React from "react";
import { jsonify } from "@/utils";

export default function CategorySlugPage({ products }) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-blue-50 min-h-full my-5">
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
  const category = await getCategory({ slug });
  if (category === undefined) return { props: { products: [] } };
  const products = jsonify(
    await getProducts({ category: jsonify(category)._id })
  );
  return { props: { products } };
}
