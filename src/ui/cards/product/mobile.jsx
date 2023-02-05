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
        onClick={onClick}
        dir="rtl"
        className={`
          product
          dark:bg-atysa-900
          group relative flex w-full cursor-pointer select-none items-center
           justify-center
           gap-5
           overflow-hidden
           rounded-tr-lg
           rounded-tl-lg
           rounded-bl-md
           
        
           rounded-br-md
            bg-white transition-shadow
            duration-300 md:hover:shadow-md
            mobileMax:drop-shadow-sm`}
      >
        {/* Col right */}
        <div className="flex flex-col items-center justify-center">
          <ProductImageBox
            className="relative flex h-[100px] w-[150px] items-stretch justify-center overflow-hidden rounded-bl-lg leading-[0px]"
            src={product?.defaultImage || ""}
            alt={name}
          />

          {/*add button */}
          <div className="flex flex-col  items-center justify-between gap-3  border-t-gray-300 p-2">
            <AddProductButton {...{ id, product }} />
          </div>
          {/*end add  button */}
        </div>

        {/* Col left */}
        <div className="flex w-full flex-col items-center justify-center gap-5 text-center">
          {/* titles */}
          <div className="flex w-full flex-col items-center justify-center  ">
            <h3 className="w-full text-center">{name}</h3>

            <CategoryList categories={product?.categories} />
          </div>
          {/* titles end */}

          {/* Tags and calory */}
          <div className="flex w-[150px] flex-col items-center justify-between gap-3  overflow-hidden">
            {/* tags */}

            <MaterialsList
              itemClass="rounded-md text-[0.8rem] py-1"
              list={product.materials}
              max={3}
            />

            {/* tags end */}

            <div className="hidden  flex-row-reverse  items-center justify-end gap-2 text-sm md:justify-start ">
              {/* <h4> کالری {calory}</h4>
              <FireIcon className="w-4 h-4" /> */}
            </div>
          </div>
          {/*End Tags and calory */}

          <Price {...{ price }} />
        </div>
      </div>
    </>
  );
}
