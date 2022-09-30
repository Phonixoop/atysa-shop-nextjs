import MainLayout from "@/layouts/mainLayout";

// next auth

import { signIn, signOut, useSession } from "next-auth/react";
import ProductList from "@/features/productList";
import { getProducts } from "@/api/products";
import { jsonify } from "@/utils";
export default function HomePage({ products }) {
  const session = useSession();

  return (
    <div className="flex justify-center w-full h-full bg-blue-50 min-h-full">
      <div className="w-9/12">
        <ProductList products={products} />
      </div>
    </div>
  );
}

HomePage.PageLayout = MainLayout;

export async function getServerSideProps(context) {
  const products = await getProducts({});
  return { props: { products: jsonify(products) } };
}
