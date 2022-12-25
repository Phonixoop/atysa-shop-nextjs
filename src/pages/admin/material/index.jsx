import AdminLayout from "layouts/admin";

import { isEmpty, isEnglish } from "validations";

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
import { useMutation } from "@tanstack/react-query";

const TextFieldWithLabel = withLabel(TextField);
const IntegerFieldWithLabel = withLabel(IntegerField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);
const IntegerFieldWithValidation = withValidation(IntegerFieldWithLabel);

const schema = [
  {
    key: "name",
    label: "نام گروه",
    type: "string",
    value: "ali",
    validations: [isEmpty, isEnglish],
  },
  {
    key: "image_url",
    label: "عکس گروه",
    type: "string",
    value: 5,
    validations: [],
  },
  {
    label: "عکس گروه",
    type: "array",
    items: [
      {
        key: "ingredients",
        type: "array",
        items: [
          {
            key: "",
            label: "name",
            value: "",
          },
          {
            key: "",
            label: "calories",
            value: "",
          },
          {
            key: "",
            label: "image_url",
            value: "",
          },
        ],
      },
    ],
    validations: [],
  },
];

import { upsertMaterial } from "api/material";
export default function MaterialPage() {
  const updateMaterial = useMutation((data) =>
    upsertMaterial({ ...data.material })
  );

  function handleSubmit(data) {
    console.log(data);
    updateMaterial.mutate(data);
  }
  return (
    <>
      <MaterialForm onSubmit={handleSubmit} />
    </>
  );
}

function MaterialForm({ onSubmit = () => {} }) {
  const [formData, setFormData] = useState({
    material: {
      name: "",
      max_choose: 0,
      image_url: "",
      ingredients: [
        {
          name: "",
          calories: 0,
          image_url: "",
        },
      ],
    },
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
      <Form className="flex flex-col gap-2" onSubmit={() => onSubmit(formData)}>
        <h2 className="py-2 font-bold text-atysa-900 text-xl">گروه</h2>
        <TextFieldWithLabel
          label="نام گروه"
          value={formData.material.name}
          onChange={(name) => {
            handleMaterialChange({ key: "name", value: name });
          }}
        />
        <IntegerFieldWithLabel
          label="تعداد مجاز انتخاب"
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
                        const { name, calories, image_url } = value;
                        if (value.id === ingredient.id) {
                          return {
                            ...ingredient,
                            ...{ name, calories, image_url },
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
        <Button type="submit" className="bg-atysa-main text-white">
          ثبت
        </Button>
      </Form>
    </>
  );
}

function IngredientFields({
  value = { name: "", calories: 0, image_url: "" },
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

MaterialPage.PageLayout = AdminLayout;
