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

import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { getUser, updateUser } from "api";
import { getToken } from "next-auth/jwt";
const TextWithLable = withLable(TextField);
const TextAreaWithLable = withLable(TextAreaField);

export default function MePage() {
  const { data, refetch, isLoading, isFetching } = useQuery(
    ["user"],
    () => {
      return getUser();
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );
  const updateUserMutate = useMutation(
    ({ data }) => {
      return updateUser({ user: data });
    },
    {
      onSettled: () => {
        refetch();
      },
    }
  );

  function handleForm({ userForm }) {
    userForm.addresses
      .filter((address) => !!address.title && !!address.description != "")
      .map((_address) => {
        return { ..._address };
      }),
      updateUserMutate.mutate({
        data: userForm,
      });
  }
  const isUserLoading = isLoading || isFetching || !data;
  return (
    <ProfileLayout>
      {isUserLoading ? (
        <UserFormSkeleton />
      ) : (
        <UserForm
          formData={data?.data?.user}
          isLoading={updateUserMutate.isLoading}
          onSubmit={(userForm) => handleForm({ userForm })}
        />
      )}
    </ProfileLayout>
  );
}

function UserForm({
  formData = undefined,
  isLoading = false,
  onSubmit = () => {},
}) {
  const [userForm, setUserForm] = useState({
    first_name: formData?.first_name,
    last_name: formData?.last_name,
    addresses: formData?.addresses,
  });

  return (
    <form
      className={`${
        isLoading ? "opacity-50" : ""
      } flex flex-col justify-center items-center gap-5 p-5 w-full`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(userForm);
      }}
    >
      <Title>مشخصات فردی</Title>

      <div className="flex gap-2 w-full">
        <div className="flex-grow">
          <TextWithLable
            bg="bg-transparent"
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
            bg="bg-transparent"
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
          <TextWithLable
            bg="bg-transparent"
            disabled
            label="شماره"
            value={formData?.phonenumber}
          />
        </div>
      </div>
      <Title>آدرس</Title>
      <div className="w-full ">
        <AddressFields
          values={userForm.addresses}
          onChange={(addresses) => {
            setUserForm((prev) => {
              return { ...prev, addresses };
            });
          }}
        />
      </div>
      <Button
        disabled={isLoading}
        isLoading={isLoading}
        className="bg-atysa-secondry md:w-1/2 w-full"
        type="submit"
      >
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

function UserFormSkeleton() {
  return (
    <div role="status" className="p-5 w-full animate-pulse">
      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
      <div className="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 max-w-[540px]"></div>
      <div className="flex justify-center items-center mt-4">
        <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
        <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
      <span className="sr-only"></span>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["user"], () => {
    return getUser();
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

MePage.PageLayout = MainLayout;
