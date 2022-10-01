import MainWithCategoryLayout from "@/layouts/mainWithCategoryLayout";

// next auth

import ProductList from "@/features/productList";
import { getProducts } from "@/api/products";
import { jsonify } from "@/utils";
import Image from "next/image";
import { Scrollbar } from "smooth-scrollbar-react";
import { useRouter } from "next/router";
import { getCategories } from "pages/api/categories";
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

export async function getServerSideProps() {
  const categories = jsonify(await getCategories());

  const products = await getProducts({ category: categories[0]._id });
  return { props: { products: jsonify(products) } };
}
