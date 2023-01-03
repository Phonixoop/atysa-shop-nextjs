import MainWithCategoryLayout from "layouts/mainWithCategoryLayout";

import CusotmDishView from "features/custom-dish";
import { trpc } from "utils/trpc";
import ThreeDotsWave from "ui/loadings/three-dots-wave";

export default function CusotmDishPage() {
  const customProducts = trpc.user.getCustomProducts.useQuery();
  if (customProducts.isLoading) return <ThreeDotsWave />;
  if (!customProducts.data) return "no data";
  console.log(customProducts.data);
  return (
    <div className="w-full">
      {customProducts.data.map((product) => {
        return <div>{product.name}</div>;
      })}
    </div>
  );
}

CusotmDishPage.PageLayout = MainWithCategoryLayout;
