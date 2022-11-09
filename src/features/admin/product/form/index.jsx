import React, { useEffect, useState } from "react";

// with
import withLabel from "@/ui/forms/with-label";
import withValidation from "@/ui/forms/with-validation";

//ui
import Button from "@/ui/buttons";
import WarningButton from "@/ui/buttons/warning";
import TextField from "@/ui/forms/text-field";
import IntegerField from "@/ui/forms/integer-field";
import MultiSelectBox from "@/ui/forms/multi-select";
import CheckBox from "@/ui/forms/checkbox";

import ProductImage from "@/ui/product-image";
import GalleryView from "@/ui/gallery-view";
//icons

import { useQuery } from "@tanstack/react-query";

//api
import { getCategories } from "api";

const TextFieldWithLabel = withLabel(TextField);
const IntegerWithLabel = withLabel(IntegerField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);
const IntegerFieldWithValidation = withValidation(IntegerWithLabel);

const isEmpty = (text) =>
  text?.length > 0 ? "" : "این فیلد نباید خالی رها شود";
const isEnglish = (text) =>
  !(text.match(/^[a-zA-Z0-9-]+$/) === null)
    ? ""
    : "فقط عدد و حروف انگلیسی مجاز است";

export default function ProductForm({
  formData = undefined,
  isLoading = false,
  onDelete = () => {},
  onSubmit = () => {},
}) {
  const { data: categories } = useQuery(["categories"], () => getCategories(), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });

  const [productForm, setProductForm] = useState(formData);
  const [validations, setValidations] = useState({
    slug: [""],
    name: [""],
  });

  const canSubmit =
    Object.entries(validations)
      .map(([_, value]) => {
        return value.length;
      })
      .reduce((a, b) => {
        return a + b;
      }, 0) <= 0 && isLoading === false;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(productForm);
      }}
      className={`flex flex-col justify-center items-end w-full py-5 gap-5 ${
        isLoading ? "opacity-50" : ""
      }`}
    >
      <div className="w-full flex-1">
        <TextFieldWithValidation
          isRtl={false}
          label="پیوند"
          value={productForm.slug}
          validations={[isEmpty, isEnglish]}
          onValidation={(value) =>
            setValidations((prev) => {
              return { ...prev, slug: value };
            })
          }
          onChange={(value) =>
            setProductForm((prev) => {
              const parsedValue = value.trimLeft().replace(" ", "-");
              return { ...prev, ...{ slug: parsedValue } };
            })
          }
          disabled={isLoading}
        />
      </div>

      <div
        dir="rtl"
        className="flex flex-col desktopMin:flex-row w-full justify-start items-stretch gap-5"
      >
        <div className="flex flex-col w-full desktopMin:w-1/2 gap-5 flex-1 ">
          <div className="flex-1">
            <TextFieldWithValidation
              label="نام"
              value={productForm.name}
              validations={[isEmpty]}
              onValidation={(value) =>
                setValidations((prev) => {
                  return { ...prev, name: value };
                })
              }
              onChange={(value) =>
                setProductForm((prev) => {
                  return { ...prev, ...{ name: value } };
                })
              }
              disabled={isLoading}
            />
          </div>
          <div className="flex-1">
            <TextFieldWithValidation
              label="توضیحات"
              value={productForm.description}
              onChange={(value) =>
                setProductForm((prev) => {
                  return { ...prev, ...{ description: value } };
                })
              }
              disabled={isLoading}
            />
          </div>
          <div className="flex-1">
            <IntegerFieldWithValidation
              label="قیمت"
              value={productForm.price}
              onChange={(value) =>
                setProductForm((prev) => {
                  return { ...prev, ...{ price: value } };
                })
              }
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex laptopMax:relative laptopMax:overflow-hidden justify-center items-center  border-dashed border-gray-400 border-2 h-20 desktopMin:h-auto flex-1  rounded-xl">
          {productForm?.defualtImage ? (
            <ProductImage url={productForm.image} />
          ) : (
            <GalleryView />
          )}
        </div>
      </div>

      <div className="flex w-full justify-end items-center text-right">
        <CheckBox
          value={productForm.isActive}
          onChange={(value) => {
            setProductForm((prev) => {
              return { ...prev, ...{ isActive: value } };
            });
          }}
        >
          active :
        </CheckBox>
      </div>
      <div>
        {!!categories && (
          <MultiSelectBox
            values={productForm?.categories?.map((item) => item.id)}
            list={categories.map((item) => {
              return {
                key: item.id,
                value: item.name,
              };
            })}
            onChange={(values) =>
              setProductForm((prev) => {
                return { ...prev, ...{ category_ids: values } };
              })
            }
          />
        )}
      </div>
      <Button
        className="bg-atysa-secondry"
        canClick={canSubmit}
        isLoading={isLoading}
      >
        ثبت
      </Button>

      {!!productForm.id && (
        <WarningButton
          type="button"
          canClick={true}
          isLoading={isLoading}
          onClick={() => onDelete(productForm.id)}
        >
          حذف
        </WarningButton>
      )}
      {!!categories && <SelectCategories categories={categories} />}
    </form>
  );
}

function SelectCategories({ categories }) {
  const [selectedCategory, setSelectedCategory] = useState([]);
  return (
    <MultiBox
      list={categories}
      multiple
      onChange={(category) => {
        console.log(category);
      }}
      renderItem={(category, selected) => {
        return (
          <div className={`${selected ? "text-red-700" : "text-black"}`}>
            {category?.name}
          </div>
        );
      }}
    />
  );
}

function Select({
  list = [],
  multiple = false,
  onClick = () => {},
  renderItem = () => {},
}) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    onClick(items);
  }, [items]);

  function onChange(item) {
    setItems((prev) => {
      return multiple
        ? prev.includes(item.key)
          ? [...prev.filter((i) => i !== item)]
          : [...prev, item]
        : [item];
    });
  }

  return (
    <>
      {!!list &&
        list.map((item, i) => {
          return (
            <div
              onClick={() => onChange(item)}
              onContextMenu={() => onChange(item)}
              key={i}
            >
              {renderItem(item, list.includes(item))}
            </div>
          );
        })}
    </>
  );
}

function MultiBox({
  list = [],
  multiple = false,
  onChange = () => {},
  renderItem = () => {},
}) {
  const [selectedKeys, setSelectedKeys] = useState(
    list.map((item, i) => {
      return { ...item, key: i };
    })
  );
  const isSelected = (item) =>
    selectedKeys.map((a) => a.key).includes(item.key);
  console.log(selectedKeys);
  useEffect(() => {
    console.log({ selectedKeys });
    onChange(list[selectedKeys]);
  }, [selectedKeys]);

  function handleChange(item) {
    setSelectedKeys((prev) => {
      return multiple
        ? prev.includes(item.key)
          ? [...prev.filter((i) => i.key !== item.key)]
          : [...prev, item.key]
        : [item];
    });
  }
  return (
    <>
      {list.map((item, i) => {
        return (
          <div
            key={item.key}
            onClick={() => handleChange(item)}
            onContextMenu={() => handleChange(item)}
          >
            {renderItem(item, isSelected(selectedKeys[i]))}
          </div>
        );
      })}
    </>
  );
}
