import PhonenumberForm from "features/login/forms/enterPhoneForm";
import React, { useState } from "react";
import PhoneField from "ui/froms/phone-field";
import TextField from "ui/froms/text-field";
import SimpleTextField from "ui/froms/text-field/simple";
import withLabel from "ui/froms/with-label";
import withValidation from "ui/froms/with-validation";

const PhoneWithLabel = withLabel(PhoneField);
const PhoneWithValidation = withValidation(PhoneWithLabel);

export default function TestPage() {
  const [phonenumber, setPhonenumber] = useState();
  const [validations, setValidations] = useState();

  const isPhoneNumber = (text) =>
    text.startsWith("09") ? "" : "Must start with 09";

  const isElevenNumber = (text) =>
    text.length === 11 ? "" : "Must be 11 number";

  return (
    <div className="w-full flex justify-center items-center mx-auto h-screen bg-blue-100">
      <div className="w-[200px] flex flex-col gap-10">
        <PhoneWithValidation
          value={phonenumber}
          onChange={(phonenumber) => onChange(phonenumber)}
          label="شماره تلفن همراه "
          validations={[isPhoneNumber, isElevenNumber]}
          onValidation={(value) => setValidations(value)}
          required
        />
      </div>
    </div>
  );
}
