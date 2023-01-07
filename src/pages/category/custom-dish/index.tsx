import MainWithCategoryLayout from "layouts/mainWithCategoryLayout";

import CusotmDishView from "features/custom-dish";
import { trpc } from "utils/trpc";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import AddProductButton from "ui/cards/product/add-product-button";

export default function CusotmDishPage() {
  const customProducts = trpc.user.getCustomProducts.useQuery();
  if (customProducts.isLoading) return <ThreeDotsWave />;
  if (!customProducts.data) return "no data";
  console.log(customProducts.data);
  return (
    <div className="w-full flex flex-wrap gap-5">
      {customProducts.data.map((product) => {
        return (
          <div className="flex flex-grow flex-col justify-center items-center bg-white rounded-xl px-5 py-2">
            <span>{product.name}</span>
            <span>{product.calories}</span>
            <span>{product.price}</span>
            <AddProductButton product={product} />
          </div>
        );
      })}
    </div>
  );
}

CusotmDishPage.PageLayout = MainWithCategoryLayout;
