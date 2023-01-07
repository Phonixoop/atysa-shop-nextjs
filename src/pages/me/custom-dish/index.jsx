import { useState } from "react";

//layout
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";

//featuers
import CustomDishView from "features/custom-dish";
import Price from "ui/cards/product/price";

//ui
import Button from "ui/buttons";

import { trpc } from "utils/trpc";

export default function CustomDishPage() {
  const addCustomProduct = trpc.user.addCustomProduct.useMutation();

  const [customDishData, setCustomDishData] = useState({
    name: "",
    description: "",
    ingredients: [],
  });

  const [canSubmit, setCanSubmit] = useState(false);

  const allCalories = customDishData.ingredients.map(
    (ingredient) => ingredient.calories
  );

  const allPrices = customDishData.ingredients.map(
    (ingredient) => ingredient.price
  );

  const total_calories = allCalories.reduce(
    (prev, current) => prev + current,
    0
  );

  const total_price = allPrices.reduce((prev, current) => prev + current, 0);
  return (
    <>
      <ProfileLayout withShadow={false}>
        <div className="flex md:flex-row flex-col w-full bg-atysa-primary ">
          <div className="md:w-8/12 w-full p-2">
            <CustomDishView
              onCanSubmit={(value) => {
                setCanSubmit(value);
              }}
              onChange={({ name, description, ingredients }) => {
                setCustomDishData({ name, description, ingredients });
              }}
            />
            <Button
              onClick={() => {
                addCustomProduct.mutate({
                  name: customDishData.name,
                  description: customDishData.description,
                  calories: total_calories,
                  price: total_price,
                  ingredients: customDishData.ingredients,
                });
              }}
              disabled={!canSubmit || addCustomProduct.isLoading}
              isLoading={addCustomProduct.isLoading}
              className="bg-atysa-main"
            >
              ثبت
            </Button>
          </div>
          <div className="relative flex md: md:w-4/12 w-full  p-5 ">
            <div className="sticky top-5 flex flex-col gap-5 bg-white rounded-xl h-fit  w-full p-5">
              <Row title={"مجموع کالری"}>
                <span className="text-atysa-main font-bold">
                  {total_calories}
                </span>
              </Row>
              <Row title={"قیمت"}>
                <Price
                  price={total_price}
                  className="text-atysa-main font-bold"
                />
              </Row>
            </div>
          </div>
        </div>
      </ProfileLayout>
    </>
  );
}

function Row({ title, children }) {
  return (
    <div className="flex justify-between items-center w-full bg-atysa-primary shadow-inner p-2  rounded-md">
      <span className="w-full text-right text-atysa-main font-bold">
        {title}
      </span>
      <div className="flex items-center min-w-fit ">{children}</div>
    </div>
  );
}

CustomDishPage.PageLayout = MainLayout;
