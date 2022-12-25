import AdminLayout from "layouts/admin";

// with
import withLabel from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";

//ui
import TextField from "ui/forms/text-field";
import IntegerField from "ui/forms/integer-field";
import Form from "ui/form";

import Button from "ui/buttons";
import MultiRowTextBox from "ui/forms/multi-row";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { upsertMaterial, getMaterialById } from "api/material";

const TextFieldWithLabel = withLabel(TextField);
const IntegerFieldWithLabel = withLabel(IntegerField);

// const TextFieldWithValidation = withValidation(TextFieldWithLabel);
// const IntegerFieldWithValidation = withValidation(IntegerFieldWithLabel);

export default function MaterialDetails({ id }) {
  const { data, isLoading, isFetching, isPaused } = useQuery(
    ["material", id],
    () => getMaterialById(id)
  );

  const updateMaterial = useMutation((data) =>
    upsertMaterial({ ...data.material })
  );

  function handleSubmit(data) {
    console.log(data);
    updateMaterial.mutate(data);
  }
  if (isLoading) return <>loading</>;
  return (
    <>
      <MaterialForm
        isMutating={updateMaterial.isLoading}
        isLoading={isLoading}
        data={data}
        onSubmit={handleSubmit}
      />
    </>
  );
}

function MaterialForm({
  isMutating = false,
  isLoading = false,
  data = {},
  onSubmit = () => {},
}) {
  const [formData, setFormData] = useState(() => {
    if (data)
      return {
        material: {
          ...data,
        },
      };

    return {
      material: {
        name: "",
        max_choose: 0,
        min_choose: 0,
        image_url: "",
        ingredients: [
          {
            name: "",
            calories: 0,
            price: 0,
            image_url: "",
          },
        ],
      },
    };
  });
  function handleMaterialChange({ key, value }) {
    setFormData((prev) => {
      return {
        ...prev,
        material: {
          ...prev.material,
          [key]: value,
        },
      };
    });
  }

  return (
    <>
      <Form
        className="flex flex-col gap-2 w-full"
        onSubmit={() => onSubmit(formData)}
      >
        <h2 className="py-2 font-bold text-atysa-900 text-xl">گروه</h2>
        <TextFieldWithLabel
          label="نام گروه"
          value={formData.material.name}
          onChange={(name) => {
            handleMaterialChange({ key: "name", value: name });
          }}
        />
        <IntegerFieldWithLabel
          label="حداقل تعداد مجاز انتخاب"
          value={formData.material.min_choose}
          onChange={(min_choose) => {
            handleMaterialChange({
              key: "min_choose",
              value: parseInt(min_choose),
            });
          }}
        />
        <IntegerFieldWithLabel
          label="حداکثر تعداد مجاز انتخاب"
          value={formData.material.max_choose}
          onChange={(max_choose) => {
            handleMaterialChange({
              key: "max_choose",
              value: parseInt(max_choose),
            });
          }}
        />
        <TextFieldWithLabel
          label="عکس گروه"
          value={formData.material.image_url}
          onChange={(image_url) => {
            handleMaterialChange({ key: "image_url", value: image_url });
          }}
        />
        <h2 className="py-2 font-bold text-atysa-900 text-xl">مواد اولیه</h2>
        <MultiRowTextBox
          values={formData.material.ingredients}
          onChange={(values) => {
            setFormData((prev) => {
              return {
                ...prev,
                material: {
                  ...prev.material,
                  ingredients: values,
                },
              };
            });
          }}
          renderItems={(value, isSelected) => {
            return (
              <>
                <IngredientFields
                  value={value}
                  onChange={(value) => {
                    const updatedIngredients =
                      formData.material.ingredients.map((ingredient) => {
                        const { name, calories, price, image_url } = value;
                        if (value.id === ingredient.id) {
                          return {
                            ...ingredient,
                            ...{ name, calories, price, image_url },
                          };
                        }
                        return ingredient;
                      });

                    setFormData((prev) => {
                      return {
                        ...prev,
                        material: {
                          ...prev.material,
                          ingredients: updatedIngredients,
                        },
                      };
                    });
                  }}
                />
              </>
            );
          }}
        />
        <Button
          isLoading={isMutating}
          disabled={isMutating}
          type="submit"
          className="bg-atysa-main text-white"
        >
          ثبت
        </Button>
      </Form>
    </>
  );
}

function IngredientFields({
  value = { name: "", calories: 0, price: 0, image_url: "" },
  onChange = () => {},
}) {
  return (
    <>
      <TextFieldWithLabel
        label="نام"
        value={value.name}
        onChange={(name) => {
          onChange({ ...value, name });
        }}
      />
      <IntegerFieldWithLabel
        label="کالری"
        value={value.calories}
        onChange={(calories) => {
          onChange({ ...value, calories: parseInt(calories) });
        }}
      />
      <IntegerFieldWithLabel
        label="قیمت"
        value={value.price}
        onChange={(price) => {
          onChange({ ...value, price: parseInt(price) });
        }}
      />
      <TextFieldWithLabel
        label="لینک عکس"
        value={value.image_url}
        onChange={(image_url) => {
          onChange({ ...value, image_url });
        }}
      />
    </>
  );
}
