import { useEffect, useState } from "react";
import React from "react";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";

//ui

import MultiBox from "ui/forms/multi-box";
import withLable from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";

import TextField from "ui/forms/text-field";
import IntegerField from "ui/forms/integer-field";
import BirthdayField from "ui/forms/birthday-field";

import Button from "ui/buttons";
// import AddressBar from "features/address-bar";

import { GENDERS } from "data";

import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { getUser, updateUser } from "api";
import { trpc } from "utils/trpc";
import Image from "next/image";
import DateField from "ui/forms/date-field";
const TextWithLable = withLable(TextField);
const BirthdayFieldWithLable = withLable(BirthdayField);

const IntegerWithLable = withLable(IntegerField);
const IntegerWithValidation = withValidation(IntegerWithLable);

export default function MePage() {
  const { data, isLoading, isFetching } = trpc.user.getUser.useQuery(["user"], {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
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
    updateUserMutate.mutate({
      data: userForm,
    });
  }
  const isUserLoading = isLoading || isFetching || !data;

  return (
    <ProfileLayout>
      <div className="w-full">
        {isUserLoading ? (
          <UserFormSkeleton />
        ) : (
          <>
            <div className="flex flex-col justify-center md:flex-row">
              <UserForm
                formData={data.user}
                isLoading={updateUserMutate.isLoading}
                onSubmit={(userForm) => handleForm({ userForm })}
              />
              <Image
                className="hidden px-10 md:flex"
                src={"/images/illustrations/user-account.png"}
                objectFit="contain"
                width={400}
                height={400}
              />
            </div>
          </>
        )}
      </div>
    </ProfileLayout>
  );
}

const is24NUmber = (text) =>
  text?.length === 24 || text?.length === 0 || !text ? "" : "باید 24 رقم باشد";

function UserForm({
  formData = undefined,
  isLoading = false,
  onCanSubmit = () => {},
  onSubmit = () => {},
}) {
  const [userForm, setUserForm] = useState({
    first_name: formData.first_name,
    last_name: formData.last_name,
    ibancode: formData.ibancode,
    gender: formData.gender,
    birthday: formData.birthday,
  });
  const [validations, setValidations] = useState([]);
  const canSubmit = validations.length <= 0;
  useEffect(() => {
    onCanSubmit(canSubmit);
  }, [canSubmit]);
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 p-5">
      <form
        className={`${isLoading ? "opacity-50" : ""} 
        flex w-full flex-col items-center justify-center gap-5 p-5`}
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          onSubmit(userForm);
        }}
      >
        <Title>مشخصات فردی</Title>

        <div className="flex w-full flex-col gap-5 md:flex-row md:gap-0">
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
              extraClass="opacity-50"
              bg="bg-transparent"
              disabled
              label="شماره"
              value={formData?.phonenumber}
            />
          </div>
        </div>

        <div className="justify-right flex w-full flex-col  items-center gap-5 md:flex-row">
          <div className="flex w-full items-center justify-center md:w-fit">
            <DateField
              className="relative bg-atysa-primary font-bold text-atysa-main"
              title={userForm.birthday || "انتخاب تاریخ تولد"}
              value={userForm.birthday}
              onChange={(date) => {
                //  console.log({ birthday });
                setUserForm((prev) => {
                  return { ...prev, birthday: date.formatted };
                });
              }}
            />
          </div>
          <MultiBox
            className="md:justify-right flex h-full justify-center  gap-2 pb-1 md:items-end "
            initialKeys={GENDERS.filter(
              (gender) => gender.id === userForm.gender
            )}
            list={GENDERS}
            renderItem={(value, isSelected) => {
              return (
                <>
                  <span
                    className={`w-fit cursor-pointer rounded-lg border border-dashed border-atysa-main px-5 py-1 ${
                      isSelected
                        ? "bg-atysa-main text-white"
                        : " bg-atysa-primary text-black "
                    }`}
                  >
                    {value.value}
                  </span>
                </>
              );
            }}
            onChange={(value) => {
              setUserForm((prev) => {
                return { ...prev, gender: value[0]?.id };
              });
            }}
          />
        </div>

        <div className="flex w-full flex-row-reverse items-center justify-center">
          <div className="w-full">
            <IntegerWithValidation
              bg="bg-gray-200"
              extraClass={"rounded-tr-lg"}
              max={24}
              label="شبا"
              value={userForm?.ibancode}
              onChange={(ibancode) => {
                setUserForm((prev) => {
                  return { ...prev, ibancode };
                });
              }}
              validations={[is24NUmber]}
              onValidation={(value) => setValidations(value)}
            >
              <span className="flex items-center justify-center rounded-tl-lg border-b-2 border-atysa-main bg-gray-200 px-2 pt-3 font-bold text-atysa-main ">
                IR
              </span>
            </IntegerWithValidation>
          </div>
        </div>
        <div className=" flex w-full justify-start">
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full bg-atysa-main text-white md:w-1/3"
            type="submit"
          >
            ویرایش
          </Button>
        </div>
      </form>
    </div>
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
    <div role="status" className="w-full animate-pulse p-5">
      <div className="dark:bg-gray-700 mx-auto mb-2.5 h-2.5 max-w-[640px] rounded-full bg-gray-300"></div>
      <div className="dark:bg-gray-700 mx-auto h-2.5 max-w-[540px] rounded-full bg-gray-300"></div>
      <div className="mt-4 flex items-center justify-center">
        <div className="dark:bg-gray-700 mr-3 h-2.5 w-20 rounded-full bg-gray-200"></div>
        <div className="dark:bg-gray-700 h-2 w-24 rounded-full bg-gray-200"></div>
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

function Select({
  children,
  className = "",
  multiple = false,
  values = [],
  onChange = () => {},
  renderItem = () => {},
}) {
  const [items, setItems] = useState(values || []);
  const isSelected = (item) => items.includes(item);
  function handleChange(item) {
    if (selectedKeys.length > (max || list.length)) return;
    const { key } = item;
    if (selectedKeys.includes(key) && selectedKeys.length <= min) return;
    onChange((prevKeys) => {
      return multiple
        ? prevKeys.includes(item.key)
          ? [...prevKeys.filter((key) => key !== item.key)]
          : [...prevKeys, item.key]
        : [key];
    });
  }

  return (
    <div className={className}>
      {values.map((value) => {
        return (
          <>
            <div onClick={() => handleChange(value)}>
              {renderItem(value, isSelected(value))}{" "}
            </div>
          </>
        );
      })}
    </div>
  );
}
