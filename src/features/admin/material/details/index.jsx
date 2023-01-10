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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  upsertMaterial,
  getMaterialById,
  deleteMaterialById,
} from "api/material";
import { useRouter } from "next/router";

const TextFieldWithLabel = withLabel(TextField);
const IntegerFieldWithLabel = withLabel(IntegerField);

// const TextFieldWithValidation = withValidation(TextFieldWithLabel);
// const IntegerFieldWithValidation = withValidation(IntegerFieldWithLabel);

export default function MaterialDetails({ id }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isFetching } = useQuery(
    ["materials", id],
    () => getMaterialById(id),
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  );

  const updateMaterialMutate = useMutation(
    (data) => upsertMaterial({ ...data.material }),
    {
      onMutate: async (updatedOrCreatedMaterial) => {
        await queryClient.cancelQueries({
          queryKey: ["materials", updatedOrCreatedMaterial.id],
        });
        const previousProduct = queryClient.getQueryData([
          "materials",
          updatedOrCreatedMaterial.id,
        ]);

        queryClient.setQueryData(
          ["materials", updatedOrCreatedMaterial.id],
          updatedOrCreatedMaterial
        );

        return { previousProduct, updatedOrCreatedMaterial };
      },
      onError: (err, updatedOrCreatedMaterial, context) => {
        queryClient.setQueryData(
          ["materials", context.updatedOrCreatedMaterial.id],
          context.previousProduct
        );
      },
      onSettled: (updatedOrCreatedMaterial) => {
        console.log({ updatedOrCreatedMaterial });
        queryClient.invalidateQueries({
          queryKey: ["materials", updatedOrCreatedMaterial.id],
        });
      },
    }
  );

  const deleteMaterialMutate = useMutation((id) => deleteMaterialById(id), {
    onSettled: () => {
      router.replace(`/admin/materials/`, `/admin/materials/`);
    },
  });

  function handleSubmit(data) {
    updateMaterialMutate.mutate({
      ...data,
      ingredients: data.material.ingredients.map((a) => {
        delete a.id;
        return a;
      }),
    });
  }

  function handleDelete(id) {
    deleteMaterialMutate.mutate(id);
  }

  const isMaterialLoading = isLoading || isFetching || !data;
  if (isMaterialLoading && id) return <>loading</>;
  return (
    <>
      <MaterialForm
        isUpdating={updateMaterialMutate.isLoading}
        isDeleting={deleteMaterialMutate.isLoading}
        data={id || data?.id ? data : {}}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </>
  );
}

function MaterialForm({
  isUpdating = false,
  isDeleting = false,
  data = {},
  onSubmit = () => {},
  onDelete = () => {},
}) {
  const [formData, setFormData] = useState(() => {
    if (data.id)
      return {
        material: {
          ...data,
        },
      };

    return {
      id: undefined,
      material: {
        name: "",
        min_choose: 0,
        max_choose: 1,
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
        className="flex flex-col gap-2 w-full py-5"
        onSubmit={() => onSubmit(formData)}
      >
        <h2 className="py-2 font-bold text-atysa-900 text-xl">گروه</h2>
        <TextFieldWithLabel
          bg="bg-transparent"
          label="نام گروه"
          value={formData.material.name}
          onChange={(name) => {
            handleMaterialChange({ key: "name", value: name });
          }}
        />
        <IntegerFieldWithLabel
          bg="bg-transparent"
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
          bg="bg-transparent"
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
          bg="bg-transparent"
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
          isLoading={isUpdating}
          disabled={isUpdating || isDeleting}
          type="submit"
          className="bg-atysa-main text-white"
        >
          {data.id ? "ویرایش" : "ثبت"}
        </Button>

        {data.id && (
          <Button
            isLoading={isDeleting}
            disabled={isUpdating || isDeleting}
            onClick={() => onDelete(data.id)}
            className="bg-amber-500 text-white"
          >
            حذف
          </Button>
        )}
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
