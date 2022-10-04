// next components
// next auth
// my ui

import { useState } from "react";
import PhoneField from "ui/froms/phone-field";
import withValidation from "ui/froms/with-validation";
import Cricle from "ui/icons/loadings/cricle";

const PhoneWithValidation = withValidation(PhoneField);

export default function EnterPhonenumberForm({
  phonenumber,
  onChange = () => {},
  onSubmit = () => {},
  ...rest
}) {
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState([""]);

  const isPhoneNumber = (text) =>
    text.startsWith("09") ? "" : "Must start with 09";

  const isElevenNumber = (text) =>
    text.length === 11 ? "" : "Must be 11 number";

  return (
    <>
      <h1 className="text-2xl text-blue-600 pb-2">خوش آمدید</h1>
      <h3>فقط کافیست شماره تلفن همراه خود را وارد نمایید</h3>
      <div className="w-8/12 flex flex-col gap-4">
        <PhoneWithValidation
          value={phonenumber}
          onChange={(phonenumber) => onChange(phonenumber)}
          label="شماره تلفن همراه "
          validations={[isPhoneNumber, isElevenNumber]}
          onValidation={(value) => setValidations(value)}
          autoComplete="off"
          required
        />
        <button
          className={`${
            loading || validations.length > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-400 hover:bg-blue-600  cursor-pointer"
          } relative w-full flex justify-start items-center p-2  rounded-lg  transition-all duration-400`}
          disabled={false}
          onClick={async () => {
            if (loading || phonenumber.length <= 0) return;
            setLoading(true);
            const result = await requestCode({ phonenumber });
            if (!result.ok) {
              return false;
            }
            setLoading(false);
            onSubmit();
          }}
        >
          <span className="flex-grow">گرفتن کد تایید</span>
          <Cricle
            extraClasses={`${
              loading ? "opacity-100" : "opacity-0"
            } absolute z-10 `}
          />
        </button>
      </div>
    </>
  );
}

async function requestCode({ phonenumber }) {
  const result = await fetch("/api/auth/send-verification-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phonenumber }),
  });
  const data = await result.json();
  return data;
}
