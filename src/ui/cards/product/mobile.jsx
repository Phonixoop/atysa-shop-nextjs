import { FireIcon } from "@heroicons/react/24/outline";
import ProductImageBox from "./product-image-box";
import MaterialsList from "./materials-list";
import Price from "./price";
import AddProductButton from "./add-product-button";
import CategoryList from "./categories-list";

export function SmallProductCard({ product, onClick = () => {}, ...rest }) {
  const { id, name, price, calory } = product;
  return (
    <>
      <div
        dir="rtl"
        className={`
          group
          product
          relative w-full flex justify-center items-center gap-5 bg-white
           dark:bg-black
           rounded-tr-lg
           rounded-tl-lg
           rounded-bl-md
           rounded-br-md
           mobileMax:drop-shadow-md
           mobileMin:border-[1.5px]
           border-dashed
           overflow-hidden
            md:hover:shadow-md cursor-pointer
            transition-shadow duration-300
            select-none`}
      >
        {/* Col right */}
        <div className="flex flex-col items-center justify-center">
          <ProductImageBox
            onClick={onClick}
            className="relative flex overflow-hidden justify-center items-stretch rounded-bl-lg w-[150px] h-[100px] leading-[0px]"
            src={product.defaultImage}
            alt={name}
          />

          {/*add button */}
          <div className="flex flex-col  gap-3 items-center justify-between  border-t-gray-300 p-2">
            <AddProductButton {...{ id, product }} />
          </div>
          {/*end add  button */}
        </div>

        {/* Col left */}
        <div
          onClick={onClick}
          className="flex flex-col items-center justify-center w-full text-center gap-5"
        >
          {/* titles */}
          <div className="flex flex-col items-center justify-center w-full  ">
            <h3 className="w-full text-center">{name}</h3>

            <CategoryList categories={product?.categories} />
          </div>
          {/* titles end */}

          {/* Tags and calory */}
          <div className="flex flex-col items-center w-[150px] overflow-hidden justify-between  gap-3">
            {/* tags */}

            <MaterialsList list={product.materials} max={3} />

            {/* tags end */}

            <div className="hidden  flex-row-reverse  gap-2 md:justify-start justify-end items-center text-sm ">
              <h4> کالری {calory}</h4>
              <FireIcon className="w-4 h-4" />
            </div>
          </div>
          {/*End Tags and calory */}

          <Price {...{ price }} />
        </div>
      </div>
    </>
  );
}
