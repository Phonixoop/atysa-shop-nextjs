import Image from "next/image";
export default function ProductCard({ product }) {
  return (
    <div className="relative w-64 snap-center hover:shadow-2xl flex flex-col bg-white rounded-xl overflow-hidden  ">
      <div className=" rounded-xl bg-center bg-contain bg-no-repeat overflow-hidden">
        {product.description && (
          <div
            className="absolute text-white text-center  w-[20ch] top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2"
            dangerouslySetInnerHTML={createMarkup(product.description)}
          />
        )}
        <Image
          className="h-full w-full object-cover object-center"
          src={"/images/products/product.jpg"}
          width={400}
          height={200}
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
          <span className="flex gap-2 rounded-lg w-fit px-2 py-1">
            <h6> تومان</h6>
            <h6> {product.price}</h6>
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
