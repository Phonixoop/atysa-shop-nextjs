import { useEffect, useState } from "react";
import React from "react";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";

//ui
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

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
            <div className="flex md:flex-row flex-col justify-center">
              <UserForm
                formData={data.user}
                isLoading={updateUserMutate.isLoading}
                onSubmit={(userForm) => handleForm({ userForm })}
              />
              <Image
                className="hidden md:flex px-10"
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
    <div className="flex flex-col justify-center items-center gap-5 p-5 w-full">
      <form
        className={`${isLoading ? "opacity-50" : ""} 
        flex flex-col justify-center items-center gap-5 p-5 w-full`}
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          onSubmit(userForm);
        }}
      >
        <Title>مشخصات فردی</Title>

        <div className="flex flex-col md:flex-row md:gap-0 gap-5 w-full">
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

        <div className="flex flex-col md:flex-row justify-right  items-center gap-5 w-full">
          <div className="flex justify-center items-center md:w-fit w-full">
            <PickDate
              className="relative text-atysa-main font-bold bg-atysa-primary"
              title={userForm.birthday || "انتخاب تاریخ تولد"}
              value={"1378/03/30"}
              onChange={(birthday) => {
                //  console.log({ birthday });
                setUserForm((prev) => {
                  return { ...prev, birthday };
                });
              }}
            />
          </div>
          <MultiBox
            className="flex md:justify-right md:items-end justify-center  pb-1 gap-2 h-full "
            initialKeys={GENDERS.filter(
              (gender) => gender.id === userForm.gender
            )}
            list={GENDERS}
            renderItem={(value, isSelected) => {
              return (
                <>
                  <span
                    className={`cursor-pointer rounded-lg w-fit px-5 py-1 border-atysa-main border-dashed border ${
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

        <div className="flex flex-row-reverse justify-center items-center w-full">
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
              <span className="bg-gray-200 px-2 rounded-tl-lg flex justify-center items-center pt-3 font-bold text-atysa-main border-atysa-main border-b-2 ">
                IR
              </span>
            </IntegerWithValidation>
          </div>
        </div>
        <div className=" flex w-full justify-start">
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            className="bg-atysa-main text-white md:w-1/3 w-full"
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

function PickDate({
  children,
  className = "",
  title = "",
  value,
  onChange = () => {},
}) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button
        className={className}
        onClick={() => {
          setShow((prev) => !prev);
        }}
      >
        {title}
      </Button>
      {show && (
        <>
          <Calendar
            onFocusedDateChange={() => {
              setShow(false);
            }}
            value={value}
            className="absolute bg-white/50 backdrop-blur-lg shadow-none  "
            calendar={persian}
            locale={persian_fa}
            onChange={(date) => {
              onChange(date.format("YYYY/MM/DD"));
            }}
          >
            {children}
          </Calendar>
        </>
      )}
    </>
  );
}
