import React from "react";
import List from "@/ui/list";
import Image from "next/image";
export default function ProductList({ products }) {
  return (
    <List
      className="flex flex-row justify-center gap-4 w-full my-10 "
      {...{
        list: products,
        renderItem: (item) => <ProductCard key={item._id} product={item} />,
      }}
    />
  );
}

function ProductCard({ product }) {
  if (product === undefined) {
    return (
      <div className="relative w-64 snap-center hover:shadow-2xl flex flex-col bg-white rounded-xl px-1 py-2 overflow-hidden  ">
        <div className="h-[200px] rounded-xl bg-center bg-contain bg-no-repeat overflow-hidden">
          {product.description && (
            <div
              className="absolute text-white text-center  w-[20ch] top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2"
              dangerouslySetInnerHTML={createMarkup(product.description)}
            />
          )}
          <Image
            className="h-full w-full object-cover object-center  "
            src={"http://localhost:8000/" + product.image}
            width={400}
            height={400}
            alt={product.name}
          />
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex md:flex-row flex-col  px-2 py-3 gap-4 justify-between w-full">
            {product.calory || undefined ? (
              <span className="rounded-lg w-fit px-2 py-1 bg-gray-300">
                {product.calory}
              </span>
            ) : (
              <span></span>
            )}

            <span className="rounded-lg w-fit px-2 py-1 bg-gray-300">
              {product.name}
            </span>
          </div>
          <button className="w-11/12  bg-black text-white rounded-lg py-2">
            اضافه کردن به سبد
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-64 snap-center hover:shadow-2xl flex flex-col bg-white rounded-xl px-1 py-2 overflow-hidden  ">
      <div className="h-[200px] rounded-xl bg-center bg-contain bg-no-repeat overflow-hidden">
        {product.description && (
          <div
            className="absolute text-white text-center  w-[20ch] top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2"
            dangerouslySetInnerHTML={createMarkup(product.description)}
          />
        )}
        <Image
          className="h-full w-full object-cover object-center  "
          src={"http://localhost:8000/" + product.image}
          width={400}
          height={400}
          alt={product.name}
        />
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex md:flex-row flex-col  px-2 py-3 gap-4 justify-between w-full">
          {product.calory || undefined ? (
            <span className="rounded-lg w-fit px-2 py-1 bg-gray-300">
              {product.calory}
            </span>
          ) : (
            <span></span>
          )}

          <span className="rounded-lg w-fit px-2 py-1 bg-gray-300">
            {product.name}
          </span>
        </div>
        <button className="w-11/12  bg-black text-white rounded-lg py-2">
          اضافه کردن به سبد
        </button>
      </div>
    </div>
  );
}

function createMarkup(content) {
  return { __html: content };
}
