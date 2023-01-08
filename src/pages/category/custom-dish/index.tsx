import MainWithCategoryLayout from "layouts/mainWithCategoryLayout";

import { trpc } from "utils/trpc";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import AddProductButton from "ui/cards/product/add-product-button";

import OptionContent from "features/option-buttons";
import Price from "ui/cards/product/price";
import Image from "next/image";
import { CustomProduct } from "@prisma/client";

export default function CusotmDishPage() {
  const customProducts = trpc.user.getCustomProducts.useQuery();
  if (customProducts.isLoading) return <ThreeDotsWave />;
  if (!customProducts.data) return "no data";
  console.log(customProducts.data);
  return (
    <div dir="rtl" className="w-full flex flex-wrap gap-5">
      {customProducts.data.map((product) => {
        return <CustomProductCard product={product} />;
      })}
    </div>
  );
}

function CustomProductCard({ product }: { product: CustomProduct }) {
  return (
    <>
      <div className="flex bg-white flex-grow flex-col gap-2 justify-center items-center rounded-xl p-5 shadow-light">
        <span className="w-full text-right">{product.name}</span>
        <div className="flex justify-between w-full">
          <div className="flex-grow">
            <Price price={product.price} />
            <span className="text-emerald-600 text-sm font-bold">
              {product.calories} کالری
            </span>
          </div>
          <div className="flex justify-end items-center flex-wrap gap-2">
            {product.ingredients.map((ingredient) => {
              return (
                <Image
                  src={`https://atysa.ir/icons/ingredients/${ingredient.name}.png`}
                  width={25}
                  height={25}
                />
                // <span className="text-sm bg-atysa-primary text-atysa-main px-2 py-1 rounded-xl">
                //   {a.name}
                // </span>
              );
            })}
          </div>
        </div>

        <AddProductButton id={product.id} product={product} />
      </div>
    </>
  );
}

CusotmDishPage.PageLayout = MainWithCategoryLayout;
