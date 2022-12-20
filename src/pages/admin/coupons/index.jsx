import React, { useState } from "react";

import AdminLayout from "layouts/admin";

import DynamicForm from "ui/dynamic-form";
import { isEmpty, isEnglish } from "validations";

const schema = [
  {
    key: "name",
    label: "نام کد تخفیف",
    type: "",
    value: "ali",
    validations: [isEmpty, isEnglish],
  },
  {
    key: "age",
    label: "سن",
    type: 0,
    value: 5,
    validations: [],
  },
];

export default function CouponsPage() {
  return (
    <div>
      <DynamicForm
        onSubmit={() => {
          console.log("hi");
        }}
        schema={schema}
      />
    </div>
  );
}

CouponsPage.PageLayout = AdminLayout;
