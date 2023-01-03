import MainWithCategoryLayout from "layouts/mainWithCategoryLayout";

import CusotmDishView from "features/custom-dish";

export default function CusotmDishPage() {
  return (
    <>
      <CusotmDishView />
    </>
  );
}

CusotmDishPage.PageLayout = MainWithCategoryLayout;
