import React from "react";
import List from "@/ui/list";
import ProductCard from "ui/cards/product";
export default function ProductList({ products }) {
  return (
    <div className="flex flex-col md:flex-row items-center  justify-center gap-4 w-full mx-auto ">
      <List
        list={products}
        renderItem={(item) => <ProductCard key={item._id} product={item} />}
      />
    </div>
  );
}
