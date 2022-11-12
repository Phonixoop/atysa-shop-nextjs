import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";

import AdminLayout from "layouts/adminLayout";

import { dehydrate, QueryClient, useMutation } from "@tanstack/react-query";
import { getProducts, createProduct } from "@/api";

//featuers
import ProductAll from "features/admin/product/all";
import ProductForm from "@/features/admin/product/form";
import Modal from "@/ui/modals";

//ui
import Button from "@/ui/buttons";

export default function ProductsPage() {
  return (
    <>
      <div className="flex flex-col w-full h-5/6">
        <div className="flex w-full">
          <NewProduct />
        </div>
        <div className="flex flex-col w-full h-full justify-center gap-5 items-center">
          <div className="w-full  rounded-[20px]">
            <ProductAll />
          </div>
        </div>
      </div>
    </>
  );
}

function NewProduct() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const createProductMutate = useMutation(
    ({ product }) => createProduct({ product }),
    {
      onError: (error, variables, context) => {
        // An error happened!
        // give alert later
        console.log(`rolling back optimistic update with id ${context.id}`);
      },
      onSuccess: (data, variables, context) => {
        router.replace(`/admin/products/`, `/admin/products/`);
        setShowModal(false);
      },
    }
  );

  function handleSubmit(data) {
    createProductMutate.mutate({
      product: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive,
        price: parseInt(data.price),
        category_ids: data.category_ids,
        defaultImage: data.defaultImage,
        images: data.images,
        materials: data.materials
          .filter((mat) => mat.name != "" && mat.weight != "")
          .map((_mat) => {
            return { ..._mat, weight: parseInt(_mat.weight) };
          }),
      },
    });
  }
  function handleClose() {
    setShowModal(false);
  }
  return (
    <>
      <div className="flex ">
        <Button
          canClick={true}
          onClick={() => setShowModal(true)}
          extraClass="bg-green-500 w-20"
        >
          جدید
        </Button>
      </div>

      <Modal isOpen={showModal} onClose={handleClose} title="محصول جدید">
        <div className="flex flex-grow w-full justify-center overflow-y-auto">
          <div className="flex flex-1 px-10 flex-grow justify-center items-start">
            <ProductForm
              isLoading={createProductMutate.isLoading}
              formData={{ isActive: true }}
              mutate={createProductMutate}
              onSubmit={(data) => handleSubmit(data)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["products"], getProducts);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
ProductsPage.PageLayout = AdminLayout;
