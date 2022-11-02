import React, { useEffect, useRef, useState } from "react";
import PhoneField from "@/ui/forms/phone-field";
import TextField from "@/ui/forms/text-field";
import withLabel from "@/ui/forms/with-label";
import withValidation from "@/ui/forms/with-validation";
import SearchIcon from "@/ui/icons/searchs";
import UserIcon from "@/ui/icons/users";

const PhoneWithLabel = withLabel(PhoneField);
const PhoneWithValidation = withValidation(PhoneWithLabel);

const TextWithLabel = withLabel(TextField);
const TextWithIcon = withIcon(TextWithLabel);

export default function TestPage() {
  const [phonenumber, setPhonenumber] = useState();
  const [validations, setValidations] = useState();

  const isPhoneNumber = (text) =>
    text.startsWith("09") ? "" : "Must start with 09";

  const isElevenNumber = (text) =>
    text.length === 11 ? "" : "Must be 11 number";

  return (
    <div className="w-full flex justify-center items-center mx-auto h-screen bg-pink-900">
      <div className="w-[500px] flex flex-col gap-10">
        {/* <PhoneWithValidation
          value={phonenumber}
          onChange={(phonenumber) => setPhonenumber(phonenumber)}
          label="شماره تلفن همراه "
          validations={[isPhoneNumber, isElevenNumber]}
          onValidation={(value) => setValidations(value)}
          required
        /> */}
        <PhoneWithLabel
          label="نام"
          placeholder="مثال : علی"
          value={phonenumber}
          onChange={(phonenumber) => setPhonenumber(phonenumber)}
        >
          <UserIcon className="w-5 h-5" />
        </PhoneWithLabel>
        <PhoneWithLabel
          label="نام"
          placeholder="مثال : علی"
          value={phonenumber}
          onChange={(phonenumber) => setPhonenumber(phonenumber)}
        >
          <UserIcon className="w-5 h-5" />
        </PhoneWithLabel>
        <TextWithLabel
          label="نام"
          placeholder="مثال : علی"
          value={phonenumber}
          onChange={(phonenumber) => setPhonenumber(phonenumber)}
        >
          <UserIcon className="w-5 h-5" />
        </TextWithLabel>
        <TextField
          label="نام"
          placeholder="مثال : علی"
          value={phonenumber}
          onChange={(phonenumber) => setPhonenumber(phonenumber)}
        >
          <UserIcon className="w-5 h-5" />
        </TextField>
      </div>
    </div>
  );
}

export function TextBox({
  children,
  isRtl = true,
  value,
  placeholder,
  label,
  onChange = () => {},
}) {
  return (
    <>
      <div className="flex px-2.5 py-5  placeholder:opacity-0 focus:placeholder:opacity-100 selection:text-white selection:bg-blue-900 rounded-t-lg   w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer">
        <input
          type="text"
          id="floating_filled"
          value={value}
          onChange={() => {
            onChange();
          }}
          className="w-full bg-transparent"
          placeholder=" "
        />
      </div>
    </>
  );
}

export function TextB({
  children,
  isRtl = true,
  value,
  placeholder,
  label,
  onChange = () => {},
}) {
  return (
    <div className="flex relative">
      <div className="relative mb-6">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          {children}
        </div>
        <input
          ref={inputRef}
          type="text"
          id="floating_filled"
          value={value}
          onChange={() => {
            onChange();
          }}
          className=" placeholder:opacity-0 focus:placeholder:opacity-100 selection:text-white selection:bg-blue-900 block rounded-t-lg px-2.5 pl-10 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
        />
        <label
          ref={placeholderRef}
          htmlFor="floating_filled"
          className={`absolute text-sm select-none text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4  scale-75 top-9  origin-top-right  right-2.5 peer-focus:text-blue-400 peer-focus:dark:text-blue-200 peer-placeholder-shown:scale-100   opacity-0 mobile:peer-focus:opacity-100
          ${hide ? "bg-red-400" : "bg-blue-400"}
       `}
        >
          {placeholder}
        </label>
        <label
          htmlFor="floating_filled"
          className="absolute text-sm select-none text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-top-right right-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
          {label}
        </label>
      </div>
    </div>
  );
}

export function withIcon(Component) {
  return function WrappedWithIcon({ ...rest }) {
    return (
      <>
        <div
          className={`relative flex gap-2 justify-center items-center pr-2 placeholder:opacity-0 focus:placeholder:opacity-100  selection:text-white selection:bg-blue-900  rounded-t-lg text-sm text-gray-900 bg-gray-50 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
        >
          <Component {...rest} />
          <SearchIcon />
        </div>
      </>
    );
  };
}
