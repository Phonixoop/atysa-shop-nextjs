import { User } from "@prisma/client";
import { GENDERS, ROLES } from "data";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import Button from "ui/buttons";
import Form from "ui/form";
import TextField from "ui/forms/text-field";
import withLabel from "ui/forms/with-label";
import withConfirmation from "ui/with-confirmation";
import { trpc } from "utils/trpc";

const TextFieldWithLabel = withLabel(TextField);

const ButtonWithConfirmation = withConfirmation(Button);

export default function UserDetails({ user }: { user: User | undefined }) {
  const deleteUserMutate = trpc.user.deleteUser.useMutation();
  if (!user) return <>user is undefined!</>;
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10">
      <div className="flex w-full items-center justify-center gap-5">
        <span>{user.phonenumber}</span>
        <span>
          {user.first_name} {user.last_name}
        </span>
      </div>
      {user && <UserForm user={user} />}
      <Button
        //@ts-ignore
        onClick={async (e) => {
          e.stopPropagation();

          await signIn("credentials", {
            phonenumber: user.phonenumber,
            verificationCode: user.code,
            callbackUrl: `${window.location.origin}/`,
            redirect: true,
          });
        }}
        className="w-fit min-w-[10rem] cursor-pointer  rounded-full bg-atysa-main py-2 px-2 text-white shadow-md transition-shadow hover:shadow-sm"
      >
        ورود
      </Button>
      <div className="w-fit min-w-[10rem]">
        <ButtonWithConfirmation
          onClick={() => {
            deleteUserMutate.mutate({ id: user.id });
          }}
          isLoading={deleteUserMutate.isLoading}
          disabled={deleteUserMutate.isLoading}
          title="حذف کاربر"
          className="bg-atysa-primary text-red-500 hover:bg-[#F4C3C2]"
        >
          حذف
        </ButtonWithConfirmation>
      </div>
    </div>
  );
}

function UserForm({ user }: { user: User }) {
  const updateUserMutate = trpc.user.updateUser.useMutation();
  const [userForm, setUserForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    role: user.role,
    gender: user.gender,
  });
  function updateUserForm(field: string, value: any) {
    setUserForm((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  }
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10">
      <Form className="flex w-full flex-grow flex-col items-center justify-center gap-10">
        <div className="flex w-full items-center justify-center gap-2">
          <div className="w-full">
            <TextFieldWithLabel
              value={userForm?.first_name}
              label={"نام"}
              //@ts-ignore
              onChange={(value) => {
                updateUserForm("first_name", value);
              }}
            />
          </div>
          <div className="w-full">
            <TextFieldWithLabel
              value={userForm?.last_name}
              label={"نام خانوادگی"}
              //@ts-ignore
              onChange={(value) => {
                updateUserForm("last_name", value);
              }}
            />
          </div>
        </div>

        <div>
          <select
            onChange={(e) => {
              updateUserForm("gender", e.target.value);
            }}
          >
            {GENDERS.map((gender) => {
              return (
                <>
                  <option
                    selected={gender.id === userForm?.gender}
                    value={gender.id}
                  >
                    {gender.value}
                  </option>
                </>
              );
            })}
          </select>
        </div>
        <div>
          <select
            onChange={(e) => {
              updateUserForm("role", e.target.value);
            }}
          >
            {ROLES.map((role) => {
              return (
                <>
                  <option selected={role.id === userForm?.role} value={role.id}>
                    {role.value}
                  </option>
                </>
              );
            })}
          </select>
        </div>
      </Form>
      <div className="w-fit min-w-[10rem]">
        <Button
          disabled={updateUserMutate.isLoading}
          isLoading={updateUserMutate.isLoading}
          className="bg-atysa-primary text-atysa-main"
          onClick={() => [
            updateUserMutate.mutate({
              ...userForm,
              id: user.id,
            }),
          ]}
        >
          ویرایش
        </Button>
      </div>
    </div>
  );
}
