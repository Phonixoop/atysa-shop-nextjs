// next components
// next auth
// my ui

import { useState } from "react";
import PhoneField from "ui/forms/phone-field";
import withLabel from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";
import Circle from "ui/icons/loadings/circle";
import Button from "ui/buttons";

import { isPhoneNumber, isElevenNumber } from "validations";
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

  async function handleForm(e) {
    e.preventDefault();
    if (!canGoNext()) return;
    setLoading(true);
    try {
      const result = await requestCode({ phonenumber });
      if (!result.ok || result.error) {
        setLoading(false);
        return false;
      }
      setLoading(false);
      onSubmit();
      onNext();
    } catch {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl text-atysa-main pb-2">خوش آمدید</h1>
      <h3>فقط کافیست شماره تلفن همراه خود را وارد نمایید</h3>

      <form
        className="md:w-8/12 w-full flex flex-col gap-4"
        onSubmit={handleForm}
      >
        <PhoneWithValidation
          value={phonenumber}
          onChange={(phonenumber) => onChange(phonenumber)}
          label="شماره تلفن همراه "
          validations={[isPhoneNumber, isElevenNumber]}
          onValidation={(value) => setValidations(value)}
          placeholder="مثال : 09121112211"
          required
        />
        <Button
          disabled={!canGoNext() || loading}
          isLoading={loading}
          className="bg-atysa-main text-white w-full"
          type="submit"
        >
          دریافت کد تایید
        </Button>
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
