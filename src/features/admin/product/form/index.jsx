import React, { useState } from "react";

// with
import withLabel from "@/ui/froms/with-label";
import withValidation from "@/ui/froms/with-validation";

//ui
import Button from "@/ui/buttons";
import WarningButton from "@/ui/buttons/warning";
import TextField from "@/ui/froms/text-field";
import IntegerField from "@/ui/froms/integer-field";

//icons
import Upload from "@/ui/icons/upload";
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
      className={`flex flex-col justify-center items-end w-full gap-5 ${
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
        className="flex flex-col desktop:flex-row w-full justify-start items-stretch gap-5"
      >
        <div className="flex flex-col w-full desktop:w-1/2 gap-5 flex-1 ">
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
        <div className="flex justify-center items-center  border-dashed border-gray-400 border-2 h-20 desktop:h-auto desktop:flex-1  rounded-xl">
          <Upload />
        </div>
      </div>

      <div className="flex w-full justify-end items-center text-right">
        <CheckBox
          value={productForm.isActive}
          onChange={(value) => {
            console.log(value);
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
          <select
            onChange={(e) =>
              setProductForm((prev) => {
                if (!e.target.value)
                  return { ...prev, ...{ category_ids: [] } };

                return { ...prev, ...{ category_ids: [e.target.value] } };
              })
            }
          >
            {categories.map((category) => {
              return (
                <option
                  value={category.id}
                  selected={category.id === productForm.categories[0]?.id}
                >
                  {category.name}
                </option>
              );
            })}
          </select>
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
    </form>
  );
}

function CheckBox({ children, value = false, onChange = () => {} }) {
  return (
    <>
      <input
        id="active"
        type={"checkbox"}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor="avtive">{children}</label>
    </>
  );
}
