import React, { useEffect, useState } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import ProductForm from "@/features/admin/product/form";
// with
import withLabel from "@/ui/forms/with-label";
import withValidation from "@/ui/forms/with-validation";

//ui

import TextField from "@/ui/forms/text-field";

const TextFieldWithLabel = withLabel(TextField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);

//icons

import { getProductBySlug, updateProduct, deleteProduct } from "api";
import { useRouter } from "next/router";

export default function ProductDetails({ slug }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: productData,
    isLoading,
    isFetching,
    isPaused,
  } = useQuery(["products", slug], () => getProductBySlug(slug), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });

  const updateProductMutate = useMutation(
    ({ id, product }) => updateProduct({ id, product }),
    {
      onMutate: async (updatedProduct) => {
        await queryClient.cancelQueries({
          queryKey: ["products", updatedProduct.slug],
        });
        const previousProduct = queryClient.getQueryData([
          "products",
          updatedProduct.slug,
        ]);

        queryClient.setQueryData(
          ["products", updatedProduct.slug],
          updatedProduct
        );

        return { previousProduct, updatedProduct };
      },
      onError: (err, updatedProduct, context) => {
        queryClient.setQueryData(
          ["products", context.updatedProduct.slug],
          context.previousProduct
        );
      },
      onSettled: (updatedProduct) => {
        queryClient.invalidateQueries({
          queryKey: ["products", updatedProduct.slug],
        });
      },
    }
  );

  const deleteProductMutate = useMutation(({ id }) => deleteProduct({ id }), {
    onSettled: (data) => {
      if (!!!data) return;
      router.replace(`/admin/products/`, `/admin/products/`);
    },
  });

  const isProductLoading = isLoading || isFetching || !productData;

  function handleSubmit(data) {
    updateProductMutate.mutate({
      id: data.id,
      product: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive,
        price: parseInt(data.price),
        category_ids: data.category_ids,
        defaultImage: data.defaultImage,
        images: data.images,
        meal_type: data.meal_type,
        available_quantity: parseInt(data.available_quantity),
        deliver_period: {
          ...data.deliver_period,
          delay: parseInt(data?.deliver_period?.delay || 0),
          timePeriod: {
            startHour: parseInt(data?.deliver_period?.timePeriod?.startHour),
            endHour: parseInt(data?.deliver_period?.timePeriod?.endHour),
          },
        },
        materials: data.materials
          .filter((mat) => !!mat.name && !!mat.weight != "")
          .map((_mat) => {
            return { ..._mat, weight: parseFloat(_mat?.weight) };
          }),

        nutritions: data.nutritions
          .filter((nut) => !!nut.name && !!nut.amount)
          .map((_nut) => {
            return { ..._nut, amount: parseFloat(_nut?.amount) };
          }),
      },
    });
  }
  function handleDelete(id) {
    deleteProductMutate.mutate({
      id: id,
    });
  }

  return (
    <div className="flex flex-grow w-full justify-center overflow-y-auto">
      <div className="flex flex-1 px-10 flex-grow justify-center items-start">
        {isProductLoading ? (
          <FormSkeleton />
        ) : (
          <ProductForm
            formData={productData}
            isLoading={
              (updateProductMutate.isLoading ||
                deleteProductMutate.isLoading) &&
              !isPaused
            }
            onSubmit={(e, data) => handleSubmit(e, data)}
            onDelete={(id) => handleDelete(id)}
          />
          // <MyForm form={productData} />
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
            className="flex w-full desktopMin:flex-row flex-col justify-end items-stretch gap-5"
          >
            <div className="flex flex-col justify-center items-center desktopMin:w-1/2 w-full gap-5 flex-1 ">
              <div className="w-full  h-12 bg-gray-300 animate-pulse rounded-xl" />
              <div className="w-full  h-12 bg-gray-300 animate-pulse rounded-xl" />
              <div className="w-full  h-12 bg-gray-300 animate-pulse rounded-xl" />
            </div>

            <div className="flex justify-center items-center bg-gray-300 desktopMin:flex-1 desktopMin:h-52 h-52 rounded-xl" />
          </div>
          <div className="w-11 h-10 bg-gray-300 rounded-xl ml-auto" />
          <div className="flex flex-col w-full gap-2">
            <div className="w-full h-10 bg-gray-300 rounded-xl" />
            <div className="w-full h-10 bg-gray-300 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}
