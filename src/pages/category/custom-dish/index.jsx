import { useState } from "react";
import MainWithCategoryLayout from "@/layouts/mainWithCategoryLayout";
import Tag from "ui/tag";
import Button from "ui/buttons";
import { getMaterials } from "api/material";
import { useQuery } from "@tanstack/react-query";

//ui

import MultiBox from "ui/forms/multi-box";

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
        renderItem={(selectedMaterial) => {
          return (
            <MultiBox
              className={`flex justify-around items-center gap-5 w-fit`}
              list={selectedMaterial.ingredients}
              multiple={selectedMaterial.max_choose === 1 ? false : true}
              max={selectedMaterial.max_choose}
              min={selectedMaterial.min_choose}
              onChange={(keys) => {
                setSelectedItems((prev) => {
                  return keys;
                });
              }}
              renderItem={(ingredient, isSelected) => {
                return (
                  <Button
                    className={` rounded-xl ${
                      isSelected
                        ? "bg-atysa-50 text-atysa-main"
                        : "text-atysa-900"
                    } `}
                  >
                    <Tag
                      extraClass="text-inherit"
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
          );
        }}
      />
    </div>
  );
}

function Tab({ list = [], renderItem = () => {} }) {
  const [selectedTab, setSelectedTab] = useState(list[0]);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      <div className="flex justify-around w-full  bg-white rounded-xl p-1  ">
        {list.map((item) => {
          return (
            <div key={item.id} className="relative w-full">
              {item.id === selectedTab.id ? (
                <motion.div
                  className="absolute inset-0 bg-atysa-primary rounded-xl "
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
              z-0
              py-4
                text-sm
              ${item.id === selectedTab.id ? "text-atysa-main" : "text-black"}
              `}
                onClick={() => setSelectedTab(item)}
              >
                <Tag extraClass="text-inherit">{item.name}</Tag>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full">
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={selectedTab ? selectedTab.id : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center items-center bg-white rounded-xl py-5"
          >
            {renderItem(selectedTab)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

CusotmDishPage.PageLayout = MainWithCategoryLayout;
