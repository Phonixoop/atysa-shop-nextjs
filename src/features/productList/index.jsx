import React from "react";
import List from "@/ui/list";
export default function ProductList({ products = [] }) {
  return (
    <div>
      <List
        {...{
          list: products,
          renderItem: (item) => <div> {JSON.stringify(item)}</div>,
        }}
      />
    </div>
  );
}
