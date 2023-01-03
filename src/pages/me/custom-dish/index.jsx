import { useState } from "react";

//layout
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";

//featuers
import CustomDishView from "features/custom-dish";
import Price from "ui/cards/product/price";

//ui
import Button from "ui/buttons";

export default function CustomDishPage() {
  const [customDishData, setCustomDishData] = useState({
    name: "",
    description: "",
    ingredients: [],
  });

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
        <div className="flex w-full bg-atysa-primary ">
          <div className="w-8/12  p-2">
            <CustomDishView
              onChange={({ name, description, ingredients }) => {
                setCustomDishData({ name, description, ingredients });
              }}
            />
            <Button className="bg-atysa-main">ثبت</Button>
          </div>
          <div className="relative flex flex-grow p-5 ">
            <div className="sticky top-[5.5em] flex flex-col gap-5 bg-white rounded-xl h-fit  w-full p-5 ">
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
    <div className="flex justify-between items-center w-full bg-atysa-50 p-2 border-b-2 rounded-md">
      <span className="w-full text-right text-atysa-main font-bold">
        {title}
      </span>
      <div className="flex items-center min-w-fit ">{children}</div>
    </div>
  );
}

CustomDishPage.PageLayout = MainLayout;
