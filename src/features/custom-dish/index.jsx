import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import MainWithCategoryLayout from "layouts/mainWithCategoryLayout";

import Tag from "ui/tag";
import Button from "ui/buttons";

import { getMaterials } from "api/material";

import { trpc } from "utils/trpc";
//ui

import MultiBox from "ui/forms/multi-box";

import ThreeDotsWave from "ui/loadings/three-dots-wave";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

//ui
import TextField from "ui/forms/text-field";
import TextAreaField from "ui/forms/textarea-field";

import withLabel from "ui/forms/with-label";
import { useEffect } from "react";

const TextFieldWithLabel = withLabel(TextField);
const TextAreaFieldWithLabel = withLabel(TextAreaField);

export default function CusotmDishView({
  value = { name: "", description: "", materials: [] },
  onChange = () => {},
}) {
  const material = trpc.material.getAll.useQuery();

  const materials = material.data;
  const [customDishData, setCustomDishData] = useState(value);

  const selectedIngredients = useMemo(() => {
    return customDishData.materials.flatMap((item) => item.ingredients);
  });

  useEffect(() => {
    onChange({
      name: customDishData.name,
      description: customDishData.description,
      ingredients: selectedIngredients,
    });
  }, [customDishData]);

  if (material.isLoading)
    return (
      <div className="bg-white p-2 rounded-xl">
        <ThreeDotsWave />
      </div>
    );
  if (!materials) return "no materials found";

  return (
    <div className="flex flex-col gap-5 py-5">
      <TextFieldWithLabel
        label="نام بشقاب"
        value={customDishData.name}
        onChange={(name) => {
          setCustomDishData((prev) => {
            return { ...prev, name };
          });
        }}
      />
      <Tab
        list={materials}
        renderItem={(selectedTabMaterial) => {
          return (
            <MultiBox
              className={`flex justify-around items-center gap-5 w-fit`}
              initialKeys={
                customDishData.materials.find(
                  (item) => item.id === selectedTabMaterial.id
                )?.ingredients
              }
              list={selectedTabMaterial?.ingredients}
              multiple={selectedTabMaterial.max_choose === 1 ? false : true}
              max={selectedTabMaterial.max_choose}
              min={selectedTabMaterial.min_choose}
              onChange={(ingredients) => {
                setCustomDishData((prev) => {
                  const newMaterial = {
                    ...selectedTabMaterial,
                    ingredients,
                  };
                  const isAlreadySelected = prev.materials.find(
                    (material) => material.id === selectedTabMaterial.id
                  );
                  if (isAlreadySelected) {
                    return {
                      name: prev.name,
                      description: prev.description,
                      materials: prev.materials.map((material) =>
                        material.id === selectedTabMaterial.id
                          ? newMaterial
                          : material
                      ),
                    };
                  }
                  return {
                    name: prev.name,
                    description: prev.description,
                    materials: [...prev.materials, newMaterial],
                  };
                });
              }}
              renderItem={(ingredient, isSelected) => {
                return (
                  <Button
                    className={`rounded-xl text-sm ${
                      isSelected
                        ? "bg-atysa-primary text-atysa-main"
                        : "text-atysa-900"
                    } `}
                  >
                    <Tag
                      extraClass="text-inherit flex-col"
                      iconUrl={
                        ingredient.image_url ||
                        "https://atysa.ir/icons/ingredients/سینه مرغ.png"
                      }
                    >
                      <span> {ingredient.name}</span>
                      <span> {ingredient.calories} کالری</span>
                    </Tag>
                  </Button>
                );
              }}
            />
          );
        }}
      >
        <div className="flex justify-start items-center gap-2 w-full bg-white rounded-xl p-2">
          {selectedIngredients.map((ingredient) => {
            return (
              <span className="w-fit bg-atysa-primary text-atysa-main rounded-full p-2 font-bold">
                {ingredient.name}
              </span>
            );
          })}
        </div>
      </Tab>
      <TextAreaFieldWithLabel
        label="توضیحات"
        value={customDishData.description}
        onChange={(description) => {
          setCustomDishData((prev) => {
            return { ...prev, description };
          });
        }}
      />
    </div>
  );
}

function Tab({ children, list = [], renderItem = () => {} }) {
  const [selectedTab, setSelectedTab] = useState(list[0]);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      <div className="flex justify-around w-full  bg-white rounded-xl p-1">
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
                font-bold
                transition-colors duration-500 
              ${
                item.id === selectedTab.id
                  ? "text-atysa-main "
                  : "text-atysa-900"
              }
              `}
                onClick={() => setSelectedTab(item)}
              >
                <span className="text-inherit  text-center flex justify-center items-center">
                  {item.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full">{children}</div>
      <div className="w-full flex justify-center items-center bg-white rounded-xl py-5">
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={selectedTab ? selectedTab.id : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderItem(selectedTab)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
