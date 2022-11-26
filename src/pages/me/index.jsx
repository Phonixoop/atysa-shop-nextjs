import React from "react";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";

//ui
import withLable from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";

import TextField from "ui/forms/text-field";
import TextAreaField from "ui/forms/textarea-field";
import Button from "ui/buttons";
import AddressFields from "../../features/address-fields";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { data } from "autoprefixer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser, updateUser } from "api";
const TextWithLable = withLable(TextField);
const TextAreaWithLable = withLable(TextAreaField);

export default function MePage() {
  const { data, isLoading, isSuccess } = useQuery(["user"], () => {
    return getUser();
  });

  return <>{isLoading ? "loading" : <UserForm formData={data.data.user} />}</>;
}

function UserForm({ formData = {} }) {
  const updateUserMutate = useMutation(({ data }) => {
    console.log(data);
    return updateUser({ user: data });
  });

  const [userForm, setUserForm] = useState({
    first_name: formData.first_name || "",
    last_name: formData.last_name || "",
    addresses: formData.addresses || [],
  });

  return (
    <form
      className="flex flex-col gap-5 p-5 w-full"
      onSubmit={(e) => {
        e.preventDefault();

        updateUserMutate.mutate({
          data: userForm,
        });
      }}
    >
      <Title>مشخصات فردی</Title>

      <div className="flex gap-2 w-full">
        <div className="flex-grow">
          <TextWithLable
            label="نام"
            value={userForm.first_name}
            onChange={(first_name) => {
              setUserForm((prev) => {
                return { ...prev, first_name };
              });
            }}
          />
        </div>
        <div className="flex-grow">
          <TextWithLable
            label="نام خانوادگی"
            value={userForm.last_name}
            onChange={(last_name) => {
              setUserForm((prev) => {
                return { ...prev, last_name };
              });
            }}
          />
        </div>
        <div className="flex-grow">
          <TextWithLable disabled label="شماره" value={formData.phonenumber} />
        </div>
      </div>
      <Title>آدرس</Title>
      <div>
        <AddressFields
          values={userForm.addresses}
          onChange={(addresses) => {
            setUserForm((prev) => {
              return { ...prev, addresses };
            });
          }}
        />
      </div>
      <Button className="bg-atysa-secondry" type="submit">
        ثبت
      </Button>
    </form>
  );
}

function Title({ children }) {
  return (
    <div className="flex w-full ">
      <span className="border-b-2 text-atysa-900">{children}</span>
    </div>
  );
}
MePage.PageLayout = MainLayout;
