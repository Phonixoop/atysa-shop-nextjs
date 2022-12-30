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
import { dehydrate, QueryClient, useMutation } from "@tanstack/react-query";

import { getMaterials } from "api/material";

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

import MaterialsTable from "features/admin/material/all";

export default function MaterialPage() {
  return (
    <>
      <MaterialsTable />
    </>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["materials"], getMaterials);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

MaterialPage.PageLayout = AdminLayout;
