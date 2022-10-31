import React, { useMemo, useState } from "react";

import AdminLayout from "layouts/adminLayout";

import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { getCategories, createCategory } from "@/api";

//featuers
import CategoryAll from "@/features/admin/category/all";
import CategoryForm from "@/features/admin/category/form";
import Modal from "@/ui/modals";

// with
import withLabel from "@/ui/froms/with-label";
import withValidation from "@/ui/froms/with-validation";

//ui
import TextField from "@/ui/froms/text-field";
import IntegerField from "@/ui/froms/integer-field";
import Button from "@/ui/buttons";
import { useRouter } from "next/router";

const TextFieldWithLabel = withLabel(TextField);
const IntegerFieldWithLabel = withLabel(IntegerField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);
const IntegerFieldwithValidation = withValidation(IntegerFieldWithLabel);

export default function CategoriesPage() {
  const { data: categories } = useQuery(["categories"], getCategories, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const columns = useMemo(
    () => [
      {
        Header: "نام",
        accessor: "name",
      },
      {
        Header: "پیوند",
        accessor: "slug",
      },
      {
        Header: "تعداد محصول",
        accessor: "product_ids",
        Cell: ({ row }) => {
          const data = row.original;
          return data.product_ids.length;
        },
      },
    ],
    []
  );
  const _categories = useMemo(() => categories, [categories]);

  return (
    <>
      <div className="flex flex-col w-6/12 h-5/6">
        <div className="flex w-full">
          <NewCategory />
        </div>
        <div className="flex flex-col w-full h-full justify-center gap-5 items-center">
          <div className="w-full overflow-hidden rounded-[20px]">
            <CategoryAll columns={columns} data={_categories} />
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
          canClick={true}
          onClick={() => setShowModal(true)}
          extraClass="bg-green-500 w-20"
        >
          جدید
        </Button>
      </div>

      <Modal isOpen={showModal} onClose={handleClose}>
        <div className="flex flex-grow w-full justify-center overflow-y-auto">
          <div className="flex flex-1 p-10 flex-grow justify-center items-start">
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
