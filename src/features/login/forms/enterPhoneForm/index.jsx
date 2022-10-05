// next components
// next auth
// my ui

import useFetch from "hooks/useFetch";
import { useEffect, useState } from "react";
import PhoneField from "ui/froms/phone-field";
import withLabel from "ui/froms/with-label";
import withValidation from "ui/froms/with-validation";
import Cricle from "ui/icons/loadings/cricle";

const PhoneWithLabel = withLabel(PhoneField);
const PhoneWithValidation = withValidation(PhoneWithLabel);

export default function PhonenumberForm({
  phonenumber,
  onChange = () => {},
  onSubmit = () => {},
  onNext = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState([""]);

  const canGoNext = () => !loading && validations.length <= 0;

  const isPhoneNumber = (text) =>
    text.startsWith("09") ? "" : "Must start with 09";

  const isElevenNumber = (text) =>
    text.length === 11 ? "" : "Must be 11 number";

  async function handleForm(e) {
    e.preventDefault();
    if (!canGoNext()) return;
    setLoading(true);
    const result = await requestCode({ phonenumber });
    if (!result.ok) {
      setLoading(false);
      return false;
    }
    setLoading(false);
    onSubmit();
    onNext();
  }

  return (
    <>
      <h1 className="text-2xl text-blue-600 pb-2">خوش آمدید</h1>
      <h3>فقط کافیست شماره تلفن همراه خود را وارد نمایید</h3>

      <form className="w-8/12 flex flex-col gap-4" onSubmit={handleForm}>
        <PhoneWithValidation
          value={phonenumber}
          onChange={(phonenumber) => onChange(phonenumber)}
          label="شماره تلفن همراه "
          validations={[isPhoneNumber, isElevenNumber]}
          onValidation={(value) => setValidations(value)}
          placeholder="مثال : 09121112211"
          required
        />
        <button
          type="submit"
          className={`${
            canGoNext()
              ? "bg-blue-400 hover:bg-blue-600 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          } relative w-full flex justify-start items-center p-2  rounded-lg  transition-all duration-400`}
          disabled={!canGoNext()}
        >
          <span className="flex-grow">گرفتن کد تایید</span>
          <Cricle
            extraClasses={`${
              loading ? "opacity-100" : "opacity-0"
            } absolute z-10 `}
          />
        </button>
      </form>
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
