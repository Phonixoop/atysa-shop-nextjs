import { useState } from "react";
import Image from "next/image";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { MinusIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/24/outline";
import Button from "@/ui/buttons";
export default function ProductCard({ product }) {
  const [count, setCount] = useState(0);
  const { name, price, calory } = product;
  return (
    <>
      {/* <style jsx>
        {`
          .product {
            container-type: inline-size;
            background-color: red;
          }

          @container (min-width: 700px) {
            .product {
              background-color: red;
            }
          }
        `}
      </style> */}
      <div
        dir="rtl"
        className={`
      
        group 
        product
        relative w-full md:w-64 flex md:flex-col justify-center  items-center gap-1 bg-white
         dark:bg-black 
         rounded-tr-lg 
         rounded-tl-lg
         rounded-bl-md
         rounded-br-md
         drop-shadow-md 
         overflow-hidden
          md:hover:shadow-lg cursor-pointer
          transition-shadow duration-300
          select-none`}
      >
        <div className="relative flex justify-center items-stretch h-[200px] leading-[0px]">
          <div className="flex absolute t-0 w-full h-full leading-[0px] ">
            <Image
              className="h-full w-full 
               object-none object-center md:group-hover:blur-3xl
                blur-md transition-all duration-300 ease-linear"
              src={"/images/products/product-tr.png"}
              width={900}
              height={900}
              alt={name}
            />
          </div>
          <Image
            className="h-full w-full object-cover object-center "
            src={"/images/products/product-tr.png"}
            width={400}
            height={300}
            alt={name}
          />
          <span className="absolute top-2 right-2">
            <BookmarkIcon className="w-6 h-6 stroke-black fill-black " />
          </span>
        </div>
        <div className="w-full text-right px-2">
          {/* titles */}
          <div className="py-3">
            <h3 className="w-full text-right">{name}</h3>
            <h4 className="text-sm font-bold text-green-700">رژیمی</h4>
          </div>
          {/* titles end */}

          <div className="flex flex-col md:flex-row justify-between mb-5 gap-3">
            {/* tags */}
            <div className="flex flex-row w-full md:w-1/2 gap-2 text-right text-white">
              <span className="text-center bg-green-700 rounded-full px-1 py-[1px] text-[0.7rem]">
                سالاد ها
              </span>
              <span className="bg-green-700 rounded-full px-1 py-[1px] text-[0.7rem]">
                رژیمی
              </span>
            </div>
            {/* tags end */}

            <div className="flex flex-row-reverse md:flex-row gap-2 md:justify-start justify-end items-center text-sm ">
              <h4> کالری {calory}</h4>
              <FireIcon className="w-4 h-4" />
            </div>
          </div>

          {/* price and button */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-t-[1px] border-t-gray-300 py-4">
            {count > 0 ? (
              <div className="flex items-center justify-between rounded-full px-[3px] py-[2px] min-w[6rem] md:w-[100px] w-[120px] h-9 bg-blue-100 ">
                <button
                  onClick={() => setCount((prev) => prev + 1)}
                  className="relative bg-atysa-secondry rounded-full  p-2 "
                >
                  <PlusIcon className=" stroke-white w-3 h-3 stroke-[2.8px]" />
                </button>
                <span className="text-[#07313c] font-bold">{count}</span>

                {count <= 1 ? (
                  <button
                    onClick={() => setCount((prev) => prev - 1)}
                    className="relative bg-transparent rounded-full  p-2 "
                  >
                    <TrashIcon className=" stroke-atysa-secondry w-3 h-3 stroke-[1.8px]" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCount((prev) => prev - 1)}
                    className="relative bg-atysa-secondry rounded-full  p-2 "
                  >
                    <MinusIcon className=" stroke-white w-3 h-3 stroke-[2.8px]" />
                  </button>
                )}
              </div>
            ) : (
              <Button onClick={() => setCount((prev) => prev + 1)}>
                افزودن
              </Button>
            )}

            <h4 className="text-sm">{commify(price)} تومان</h4>
          </div>
          {/*end price and button */}
        </div>
      </div>
    </>
  );
}

function commify(x) {
  if (!x) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// export default function ProductCard({ product }) {
//   return (
//     <div className="relative w-64 snap-center hover:shadow-2xl flex flex-col bg-white rounded-xl overflow-hidden  ">
//       <div className=" rounded-xl bg-center bg-contain bg-no-repeat overflow-hidden">
//         {product.description && (
//           <div
//             className="absolute text-white text-center  w-[20ch] top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2"
//             dangerouslySetInnerHTML={createMarkup(product.description)}
//           />
//         )}
//         <Image
//           className="h-full w-full object-cover object-center"
//           src={"/images/products/product.jpg"}
//           width={400}
//           height={200}
//           alt={product.name}
//         />
//       </div>
//       <div className="flex flex-col justify-center items-center w-full">
//         <div className="flex md:flex-row flex-col  px-2 py-3 gap-4 justify-between w-full">
//           {product.calory || undefined ? (
//             <span className="rounded-lg w-fit px-2 py-1 bg-gray-300">
//               {product.calory}
//             </span>
//           ) : (
//             <span></span>
//           )}

//           <span className="rounded-lg w-fit px-2 py-1 bg-gray-300">
//             {product.name}
//           </span>
//           <span className="flex gap-2 rounded-lg w-fit px-2 py-1">
//             <h6> تومان</h6>
//             <h6> {product.price}</h6>
//           </span>
//         </div>
//         <button className="w-11/12  bg-black text-white rounded-lg py-2">
//           اضافه کردن به سبد
//         </button>
//       </div>
//     </div>
//   );
// }

function createMarkup(content) {
  return { __html: content };
}
