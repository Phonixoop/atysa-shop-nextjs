import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";

import AdminLayout from "layouts/adminLayout";

import { dehydrate, QueryClient, useMutation } from "@tanstack/react-query";
import { getCategories, createCategory } from "@/api";

//featuers
import CategoryAll from "@/features/admin/category/all";
import CategoryForm from "@/features/admin/category/form";
import Modal from "@/ui/modals";

//ui
import Button from "@/ui/buttons";

export default function CategoriesPage() {
  return (
    <>
      <div className="flex flex-col w-full h-5/6">
        <div className="flex w-full">
          <NewCategory />
        </div>
        <div className="flex flex-col w-full h-full justify-center gap-5 items-center">
          <div className="w-full overflow-hidden rounded-[20px]">
            <CategoryAll />
          </div>
        </div>
      </div>
    </>
  );
}
function NewCategory() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const createCategoryMutate = useMutation(
    ({ category }) => createCategory({ category }),
    {
      onError: (error, variables, context) => {
        // An error happened!
        // give alert later
        console.log(`rolling back optimistic update with id ${context.id}`);
      },
      onSuccess: (data, variables, context) => {
        router.replace(`/admin/categories/`, `/admin/categories/`);
        setShowModal(false);
      },
    }
  );

  function handleSubmit(data) {
    createCategoryMutate.mutate({
      category: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive,
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
          onClick={() => setShowModal(true)}
          extraClass="bg-green-500 w-20"
        >
          جدید
        </Button>
      </div>

      <Modal isOpen={showModal} onClose={handleClose} title="دسته بندی جدید">
        <div className="flex flex-grow w-full justify-center overflow-y-auto">
          <div className="flex flex-1 px-10 flex-grow justify-center items-start">
            <CategoryForm
              isLoading={createCategoryMutate.isLoading}
              formData={{ isActive: true }}
              mutate={createCategoryMutate}
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

  await queryClient.prefetchQuery(["categories"], getCategories);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
CategoriesPage.PageLayout = AdminLayout;

// function MyForm({ children, form = {}, onSubmit = () => {} }) {
//   const [data, setData] = useState(form);
//   return (
//     <form className="w-full flex flex-col gap-4" onSubmit={onSubmit(data)}>
//       {form?.map(({ label, value, validations, Component }, index) => {
//         return (
//           <>
//             <Component
//               key={index}
//               label={label}
//               value={data[index].value}
//               validations={validations}
//               onValidation={(validations) =>
//                 setData(
//                   data.map((field) => {
//                     if (field.id != data[index].id) return field;
//                     return {
//                       ...field,
//                       validations,
//                     };
//                   })
//                 )
//               }
//               onChange={(value) =>
//                 setData(
//                   data.map((field) => {
//                     if (field.id != data[index].id) return field;
//                     return {
//                       ...field,
//                       value,
//                     };
//                   })
//                 )
//               }
//             />
//           </>
//         );
//       })}
//     </form>
//   );
// }

// const categoryForm = {
//   name: "ویرایش دسته بندی",
//   fields: [
//     {
//       id: "0",
//       label: "نام",
//       value: "",
//       Component: TextFieldWithValidation,
//       validations: [isFilled],
//     },
//     {
//       id: "2",
//       label: "پیوند",
//       value: "",
//       Component: TextFieldWithValidation,
//     },
//     {
//       id: "3",
//       label: "توضیحات",
//       value: "",
//       Component: TextFieldWithValidation,
//     },
//   ],
// };
