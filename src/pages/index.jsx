import MainWithCategoryLayout from "@/layouts/mainWithCategoryLayout";

// next auth

import ProductList from "@/features/productList";
import { getProducts } from "@/api/products";
import { jsonify } from "@/utils";
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
  console.log("index home");
  const products = jsonify(await getProducts());
  return { props: { products } };
}
