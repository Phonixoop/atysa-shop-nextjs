import React, { useRef, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/layouts/adminLayout";
// import { unstable_getServerSession } from "next-auth";
// import { authOptions } from "@/api/auth/[...nextauth]";

//

// with
import withLabel from "@/ui/froms/with-label";
import withValidation from "@/ui/froms/with-validation";

//ui
import TextField from "@/ui/froms/text-field";
import IntegerField from "@/ui/froms/integer-field";

const TextFieldWithLabel = withLabel(TextField);
const IntegerFieldWithLabel = withLabel(IntegerField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);
const IntegerFieldwithValidation = withValidation(IntegerFieldWithLabel);

const doesStartWithA = (text) =>
  text.startsWith("A") ? "" : "Must starts with A";

const isFourNumber = (text) => (text.length === 4 ? "" : "Must be 4 number");

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
  return <MyForm form={form} />;
}

AdminDashboard.PageLayout = AdminLayout;

function MyForm({ children, form = {}, onSubmit = () => {} }) {
  const [data, setData] = useState(form.fields);
  return (
    <form className="w-2/12 flex flex-col gap-4" onSubmit={onSubmit(data)}>
      {form.fields.map(({ type, label, Component, validations }, index) => {
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
                    console.log(data[index]);
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
                    console.log(data[index]);
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

AdminDashboard.auth = {
  role: "admin",
  loading: <div className="w-full h-full bg-black text-white">hi</div>,
  unauthorized: "/login-with-different-user",
};
