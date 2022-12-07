import useWindowSize from "@/hooks/useWindowSize";

import ProductImageBox from "./product-image-box";
import MaterialsList from "./materials-list";
import Tag from "ui/tag";
import Price from "./price";
import AddProductButton from "./add-product-button";
import CategoryList from "./categories-list";

//icons

import ExclamationIcon from "ui/icons/exclamation";
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
        relative md:min-w-[260px] md:max-w-[265px] flex md:flex-col justify-start items-start gap-1 bg-gradient-to-b from-transparent to-white 
       
        rounded-tr-lg 
        rounded-tl-lg
        rounded-bl-md
        rounded-br-md
       
        overflow-hidden
        md:hover:shadow-lg cursor-pointer
        transition-shadow duration-300
        select-none`}
        >
          <ProductImageBox
            className="relative flex  justify-center items-stretch  leading-[0px]"
            src={product.defaultImage}
            alt={name}
            blur={false}
          />

          <div className="w-full text-right px-3 h-full flex flex-col justify-end">
            {/* titles */}

            <div className="flex flex-col gap-2 py-3 h-full justify-start items-start">
              <h3 className="w-full font-bold text-right">{name}</h3>

              <div className="flex justify-between items-center w-full">
                <CategoryList categories={product?.categories} />
                <Tag
                  extraClass="flex gap-1 text-sm font-bold"
                  bg="bg-transparent"
                  text="text-atysa-800"
                >
                  {/* <ExclamationIcon className="fill-atysa-800 w-4 h-4" /> */}
                  {product.meal_type}
                </Tag>
              </div>
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
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-t-[1px] border-dotted border-t-atysa-main py-4">
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
