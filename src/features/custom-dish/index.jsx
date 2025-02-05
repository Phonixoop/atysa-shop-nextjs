import { useEffect } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import Image from "next/image";

import { trpc } from "utils/trpc";
//ui

import Tag from "ui/tag";
import Button from "ui/buttons";
import MultiBox from "ui/forms/multi-box";

import ThreeDotsWave from "ui/loadings/three-dots-wave";
import { AnimatePresence, motion } from "framer-motion";

import { isEmpty } from "validations";

//ui
import TextField from "ui/forms/text-field";
import TextAreaField from "ui/forms/textarea-field";

import withLabel from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";
import ToolTip from "ui/tooltip";
import SearchIcon from "ui/icons/searchs";
import SearchField from "ui/forms/search-field";

const TextFieldWithLabel = withLabel(TextField);
const TextFieldWithValidation = withValidation(TextFieldWithLabel);
const TextAreaFieldWithLabel = withLabel(TextAreaField);

export default function CusotmDishView({
  value = { name: "", description: "", materials: [] },
  onChange = () => {},
  onCanSubmit = () => {},
}) {
  const material = trpc.material.getAll.useQuery();

  const materials = material.data || [];

  const [customDishData, setCustomDishData] = useState(value);
  const [validations, setValidations] = useState({
    name: [""],
  });
  const [selectedTab, setSelectedTab] = useState(materials[0] || {});
  const [searchText, setSearchText] = useState("");
  const searchedTab = useMemo(() => {
    if (!materials) return;

    const mat = materials.find((item) =>
      item.ingredients.find((ingredient) =>
        ingredient.name.includes(searchText)
      )
    );
    if (mat) return setSelectedTab(mat);

    const material = materials.find((a) => a.name.includes(searchText));
    if (material) return setSelectedTab(material);
  }, [searchText]);

  const selectedIngredients = useMemo(() => {
    return customDishData.materials.flatMap((item) => item.ingredients);
  });

  const canSubmit =
    Object.entries(validations)
      .map(([_, value]) => {
        return value.length;
      })
      .reduce((a, b) => {
        return a + b;
      }, 0) <= 0 && selectedIngredients.length > 0;

  onCanSubmit(canSubmit);

  useEffect(() => {
    onChange({
      name: customDishData.name,
      description: customDishData.description,
      ingredients: selectedIngredients,
    });
  }, [customDishData]);

  if (material.isLoading)
    return (
      <div className=" p-2  rounded-xl">
        <ThreeDotsWave />
      </div>
    );
  if (!materials) return "no materials found";

  return (
    <div className="flex flex-col gap-6 py-5">
      <div>
        <SearchField
          value={searchText}
          onChange={setSearchText}
          title="جستجو مواد اولیه"
        />
      </div>

      <Tab
        list={materials}
        selectedTab={selectedTab}
        onChange={setSelectedTab}
        renderItem={(selectedTabMaterial) => {
          if (!selectedTabMaterial) return "";
          return (
            <div className="w-full flex flex-col gap-5">
              <span className="w-full text-right text-atysa-800 font-bold">
                تعداد مجاز انتخاب از این دسته{" "}
                <span className="fold-bold text-atysa-800">
                  {selectedTabMaterial.max_choose}
                </span>{" "}
                می باشد
              </span>
              <MultiBox
                className={`flex flex-wrap justify-right items-center gap-5 w-fit snap-mandatory snap-x `}
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
                      key={ingredient.id}
                      className={`rounded-xl flex-row md:flex-col flex-grow gap-2  text-sm ${
                        isSelected
                          ? "shadow-inner bg-atysa-main text-white "
                          : "text-atysa-900"
                      }   ${
                        searchText !== "" &&
                        ingredient.name.includes(
                          searchText.trimStart().trimEnd()
                        )
                          ? "border border-dashed border-atysa-900 shadow-lg"
                          : ""
                      }`}
                    >
                      <Image
                        src={
                          ingredient.image_url ||
                          "https://atysa.ir/icons/ingredients/سینه مرغ.png"
                        }
                        objectFit="fill"
                        width={25}
                        height={25}
                      />
                      <span className="font-bold text-inherit">
                        {ingredient.name}
                      </span>
                      <span className="text-sm text-inherit">
                        {ingredient.calories} کالری
                      </span>
                    </Button>
                  );
                }}
              />
            </div>
          );
        }}
      >
        <div className="flex justify-start items-center gap-2 w-full bg-white rounded-xl p-2">
          <div className="flex md:flex-wrap flex-nowrap items-center gap-5 bg-white w-full md:min-h-fit min-h-[7rem] scrollbar-none md:overflow-visible overflow-x-auto overflow-y-visible  rounded-xl">
            {selectedIngredients.length <= 0 ? (
              <span className="py-2">موادی انتخاب نشده است</span>
            ) : (
              selectedIngredients.map((ingredient) => {
                return (
                  <ToolTip key={ingredient.id} title={ingredient.name}>
                    <span className="text-atysa-main rounded-full p-2 font-bold">
                      <Image
                        src={
                          ingredient.image_url ||
                          "https://atysa.ir/icons/ingredients/سینه مرغ.png"
                        }
                        width={25}
                        height={25}
                      />
                    </span>
                  </ToolTip>
                );
              })
            )}
          </div>
        </div>
      </Tab>
      <div className="w-full flex flex-col gap-2">
        <TextFieldWithValidation
          label="نام بشقاب"
          validations={[isEmpty]}
          onValidation={(value) => {
            setValidations({
              name: value,
            });
          }}
          value={customDishData.name}
          onChange={(name) => {
            setCustomDishData((prev) => {
              return { ...prev, name };
            });
          }}
        />
        <TextAreaFieldWithLabel
          label="توضیحات"
          value={customDishData.description}
          onChange={(description) => {
            setCustomDishData((prev) => {
              return { ...prev, description };
            });
          }}
        />{" "}
      </div>
    </div>
  );
}

function Tab({
  children,
  list = [],
  selectedTab = {},
  onChange = () => {},
  renderItem = () => {},
}) {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      <div className="flex items-center gap-5 bg-white w-full overflow-hidden scrollbar-none  overflow-x-auto p-2 rounded-xl">
        {list.map((item) => {
          return (
            <div key={item.id} className="relative min-w-fit px-5 flex-grow">
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
                onClick={() => onChange(item)}
              >
                <span className="flex justify-center items-center text-center">
                  {item.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full">{children}</div>
      <div className="w-full  flex  justify-right items-center bg-white rounded-xl p-5">
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={selectedTab ? selectedTab.id : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {selectedTab.id ? renderItem(selectedTab) : <></>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
