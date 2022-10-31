import React, { useEffect, useState } from "react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

import CategoryForm from "@/features/admin/category/form";
// with
import withLabel from "@/ui/froms/with-label";
import withValidation from "@/ui/froms/with-validation";

//ui
import Button from "@/ui/buttons";
import TextField from "@/ui/froms/text-field";

const TextFieldWithLabel = withLabel(TextField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);

//icons
import Upload from "@/ui/icons/upload";
import { getCategoryBySlug, updateCategory, deleteCategory } from "api";
import { useRouter } from "next/router";

// const getCategory = async (slug) => {
//   return await (
//     await fetch(`http://localhost:3000/api/categories?slug=${slug}`)
//   ).json();
// };

const isEmpty = (text) =>
  text?.length > 0 ? "" : "این فیلد نباید خالی رها شود";
const isEnglish = (text) =>
  !(text.match(/^[a-zA-Z0-9-]+$/) === null)
    ? ""
    : "فقط عدد و حروف انگلیسی مجاز است";

export default function CategoryDetails({ slug }) {
  const router = useRouter();

  const {
    data: categoryData,
    isLoading,
    isFetching,
  } = useQuery(["categories", slug], () => getCategoryBySlug(slug), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });

  const updateCategoryMutate = useMutation(
    ({ id, category }) => updateCategory({ id, category }),
    {
      onSettled: (data) => {
        if (!!!data) return;
        router.replace(
          `/admin/categories/?slug=${data.slug}`,
          `/admin/categories/${data.slug}`,
          { shallow: true }
        );
      },
    }
  );

  const deleteCategoryMutate = useMutation(({ id }) => deleteCategory({ id }), {
    onSettled: (data) => {
      if (!!!data) return;
      router.replace(`/admin/categories/`, `/admin/categories/`);
    },
  });

  const isCategoryLoading = isLoading || isFetching || !categoryData;

  function handleSubmit(data) {
    updateCategoryMutate.mutate({
      id: data.id,
      category: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive,
      },
    });
  }
  function handleDelete(id) {
    deleteCategoryMutate.mutate({
      id: id,
    });
  }

  return (
    <div className="flex flex-grow w-full justify-center overflow-y-auto">
      <div className="flex flex-1 p-10 flex-grow justify-center items-start">
        {isCategoryLoading ? (
          <FormSkeleton />
        ) : (
          <CategoryForm
            formData={categoryData}
            isLoading={
              updateCategoryMutate.isLoading || deleteCategoryMutate.isLoading
            }
            onSubmit={(e, data) => handleSubmit(e, data)}
            onDelete={(id) => handleDelete(id)}
          />
          // <MyForm form={categoryData} />
        )}
      </div>
    </div>
  );
}

function HandleLoading({ children, isBusy, fallback }) {
  return <>{isBusy ? fallback : children}</>;
}

function MyForm({ children, form = {}, onSubmit = () => {} }) {
  const [data, setData] = useState(form);
  return (
    <form className="w-full flex flex-col gap-4" onSubmit={onSubmit(data)}>
      {form?.map(({ label, value, validations, Component }, index) => {
        return (
          <>
            <Component
              key={index}
              label={label}
              value={data[index].value}
              validations={validations}
              onValidation={(validations) =>
                setData(
                  data.map((field) => {
                    if (field.id != data[index].id) return field;
                    return {
                      ...field,
                      validations,
                    };
                  })
                )
              }
              onChange={(value) =>
                setData(
                  data.map((field) => {
                    if (field.id != data[index].id) return field;
                    return {
                      ...field,
                      value,
                    };
                  })
                )
              }
            />
          </>
        );
      })}
    </form>
  );
}

function FormSkeleton() {
  return (
    <>
      <div className="flex flex-grow w-full justify-center overflow-y-auto">
        <div className="flex flex-col justify-center items-start w-full gap-11">
          <div className="w-full h-12 bg-gray-300 animate-pulse rounded-xl" />
          <div
            dir="rtl"
            className="flex w-full desktop:flex-row flex-col justify-start items-stretch gap-5"
          >
            <div className="flex flex-col desktop:w-1/2 w-full gap-5 flex-1 ">
              <div className="w-full  h-12 bg-gray-300 animate-pulse rounded-xl" />
              <div className="w-full  h-12 bg-gray-300 animate-pulse rounded-xl" />
            </div>

            <div className="flex justify-center items-center bg-gray-300 desktop:flex-1 desktop:h-auto h-28 rounded-xl" />
          </div>
          <div className="w-11 h-10 bg-gray-300 rounded-xl" />
          <div className="flex flex-col w-full gap-2">
            <div className="w-full h-10 bg-gray-300 rounded-xl" />
            <div className="w-full h-10 bg-gray-300 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}
