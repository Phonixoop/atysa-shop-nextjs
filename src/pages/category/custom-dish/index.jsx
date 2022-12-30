import { useState } from "react";
import MainWithCategoryLayout from "@/layouts/mainWithCategoryLayout";
import Tag from "ui/tag";
import Button from "ui/buttons";
import { getMaterials } from "api/material";
import { useQuery } from "@tanstack/react-query";

import ThreeDotsWave from "ui/loadings/three-dots-wave";
import { AnimatePresence, motion } from "framer-motion";

const data = {
  materials: [
    {
      name: "پروتئین",
      max_choose: 1,
      min_choose: 0,
      ingredients: [
        {
          name: "گوشت 100 گرمی",
          calories: 10,
        },
        {
          name: "گوشت 200 گرمی",
        },
        {
          name: "گوشت 300 گرمی",
        },
        {
          name: "گوشت 400 گرمی",
        },
        {
          name: "گوشت 500 گرمی",
        },
      ],
    },
    {
      name: "سبزیجات",
      max_choose: 1,
      min_choose: 0,
      ingredients: [
        {
          name: "مرغ",
        },
        {
          name: "مرغ",
        },
        {
          name: "مرغ",
        },
        {
          name: "مرغ",
        },
        {
          name: "مرغ",
        },
      ],
    },
  ],
};

export default function CusotmDishPage() {
  const {
    data: materials,
    isLoading,
    refetch,
  } = useQuery(["materials"], getMaterials, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const [selectedItems, setSelectedItems] = useState([]);

  if (isLoading) return <ThreeDotsWave />;
  return (
    <div className="py-5">
      <Tab
        list={materials}
        renderItem={(material, ingredient) => {
          return (
            <Button
              className={`${
                selectedItems.find((item) =>
                  item.ingredients.find((a) => a.id === ingredient.id)
                )
                  ? "bg-black"
                  : "bg-gray-300"
              }`}
              key={ingredient.id}
              onClick={() => {
                // const canChoose =
                //   selectedItems.filter((item) => item.id === ingredient.id)
                //     .length < material.max_choose;

                const items = selectedItems.filter((item) => item.ingredients);
                console.log({ items });
                const toggle = items.find((item) => item.id === ingredient.id);
                setSelectedItems((prev) => {
                  const newItem = {
                    ...material,
                    ingredients: material.ingredients.filter((item) =>
                      toggle
                        ? item.id !== ingredient.id
                        : item.id === ingredient.id
                    ),
                  };

                  return [...prev, newItem];
                });
              }}
            >
              <Tag
                iconUrl={
                  ingredient.image_url ||
                  "https://atysa.ir/icons/ingredients/سینه مرغ.png"
                }
              >
                {ingredient.name}
              </Tag>
            </Button>
          );
        }}
      />
    </div>
  );
}

function Tab({ list = [], renderItem = () => {} }) {
  const [selectedTab, setSelectedTab] = useState(list[0]);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-10">
      <div className="flex justify-around w-full ">
        {list.map((item) => {
          return (
            <div key={item.id} className="relative w-full ">
              {item.id === selectedTab.id ? (
                <motion.div
                  className="absolute inset-0 bg-atysa-50 rounded-xl "
                  layoutId="underline"
                />
              ) : (
                ""
              )}
              <div
                className={`
                relative
                w-full
              cursor-pointer 
              rounded-lg
              py-1
            
              ${item.id === selectedTab.id ? "text-atysa-main" : "text-black"}
              `}
                onClick={() => setSelectedTab(item)}
              >
                <Tag
                  iconUrl={
                    item.image_url ||
                    "https://atysa.ir/icons/ingredients/سینه مرغ.png"
                  }
                >
                  {item.name}
                </Tag>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={selectedTab ? selectedTab.id : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center items-center"
          >
            {selectedTab.ingredients.map((ingredient) => {
              return renderItem(selectedTab, ingredient);
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

CusotmDishPage.PageLayout = MainWithCategoryLayout;
