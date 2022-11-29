import useWindowSize from "@/hooks/useWindowSize";

import { FireIcon } from "@heroicons/react/24/outline";
import ProductImageBox from "./product-image-box";
import MaterialsList from "./materials-list";
import Price from "./price";
import AddProductButton from "./add-product-button";
import CategoryList from "./categories-list";
import { SmallProductCard } from "./mobile";
const BREAK_POINT = 1200;

export default function ProductCard({ product, onClick = () => {}, ...rest }) {
  const windowSize = useWindowSize();
  const { id, name, price, calory } = product;

  if (windowSize.width <= BREAK_POINT)
    return <SmallProductCard {...{ product, onClick, ...rest }} />;

  // if we are on desktop render out below design
  if (windowSize.width > BREAK_POINT)
    return (
      <>
        <div
          onClick={onClick}
          dir="rtl"
          className={`

        group 
        product
        relative md:min-w-[260px] md:max-w-[265px] flex md:flex-col justify-center  items-center gap-1 bg-white
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
          <ProductImageBox
            className="relative flex  justify-center items-stretch h-[200px] leading-[0px]"
            src={product.defaultImage}
            alt={name}
            blur={true}
          />

          <div className="w-full text-right px-3">
            {/* titles */}

            <div className="flex flex-col gap-2 py-3">
              <h3 className="w-full text-right">{name}</h3>

              <CategoryList categories={product?.categories} />
            </div>
            {/* titles end */}

            <div className="flex flex-col md:flex-row justify-between mb-5 gap-3">
              {/* tags */}
              <div className="flex flex-row w-full md:w-1/2 gap-2">
                <MaterialsList list={product.materials} max={3} />
              </div>
              {/* tags end */}

              <div className="flex flex-row-reverse md:flex-row gap-2 md:justify-start justify-end items-center text-sm ">
                {/* <h4> کالری {calory}</h4>
                <FireIcon className="w-4 h-4" /> */}
              </div>
            </div>

            {/* price and button */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-t-[1px] border-t-gray-300 py-4">
              <AddProductButton {...{ id, product }} />
              <Price {...{ price }} />
            </div>
            {/*end price and button */}
          </div>
        </div>
      </>
    );
}

function createMarkup(content) {
  return { __html: content };
}
