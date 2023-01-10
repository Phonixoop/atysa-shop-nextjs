import React, { useRef, useState } from "react";
import Link from "next/link";
import AdminLayout from "layouts/admin";
// import { unstable_getServerSession } from "next-auth";
// import { authOptions } from "api/auth/[...nextauth]";

//
import { getProducts, getCategories } from "api";
// with
import withLabel from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";

//featuers
import CategoryAll from "features/admin/category/all";
import ProductAll from "features/admin/product/all";
import Gallery from "features/admin/gallery";
//ui
import TextField from "ui/forms/text-field";
import IntegerField from "ui/forms/integer-field";
import OrdersPage from "./orders";

import { dehydrate, QueryClient } from "@tanstack/react-query";

const TextFieldWithLabel = withLabel(TextField);
const IntegerFieldWithLabel = withLabel(IntegerField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);
const IntegerFieldwithValidation = withValidation(IntegerFieldWithLabel);

const doesStartWithA = (text) =>
  text.startsWith("A") ? "" : "Must starts with A";

const isFourNumber = (text) => (text.length === 4 ? "" : "باید 4 رقم باشد");

const form = {
  name: "add product",
  fields: [
    {
      id: "0",
      label: "نام",
      value: "",
      Component: TextFieldWithValidation,
      validations: [doesStartWithA],
    },
    {
      id: "2",
      label: "قیمت",
      value: "",
      Component: IntegerFieldwithValidation,
      validations: [isFourNumber],
    },
  ],
};

export default function AdminDashboard() {
  return (
    <div className="flex justify-center items-center w-full h-auto">
      <div className="grid overflow-hidden  grid-cols-2 grid-rows-2 gap-3 w-full h-auto">
        <div className="bg-white rounded-lg h-96 overflow-scroll p-5">
          <OrdersPage />
        </div>
        <div className="bg-white rounded-lg h-96 overflow-scroll p-5">
          <ProductAll />
        </div>
        <div className="bg-white rounded-lg h-96 overflow-scroll p-5">
          <Gallery />
        </div>
        <div className="bg-white rounded-lg h-96 overflow-scroll p-5">
          <CategoryAll />
        </div>
      </div>
    </div>
  );
}

AdminDashboard.PageLayout = AdminLayout;

// function MyForm({ children, form = {}, onSubmit = () => {} }) {
//   const [data, setData] = useState(form.fields);
//   return (
//     <form className="w-2/12 flex flex-col gap-4" onSubmit={onSubmit(data)}>
//       {form.fields.map(({ type, label, Component, validations }, index) => {
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
//                     console.log(data[index]);
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
//                     console.log(data[index]);
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

// export async function getServerSideProps(context) {
//   const session = await unstable_getServerSession(
//     context.req,
//     context.res,
//     authOptions
//   );

//   // if (session?.user.role === "admin") {
//   //   return {
//   //     redirect: {
//   //       destination: "/",
//   //       permanent: false,
//   //     },
//   //   };
//   // }

//   return {
//     props: {
//       session,
//     },
//   };
// }

// AdminDashboard.auth = {
//   role: "admin",
//   loading: <div className="w-full h-full bg-atysa-900 text-white">hi</div>,
//   unauthorized: "/login-with-different-user",
// };
export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["products"], getProducts);
  await queryClient.prefetchQuery(["gallery"], () => getUploads());
  await queryClient.prefetchQuery(["categories"], getCategories);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
