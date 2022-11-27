import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import MainLogo from "@/ui/logo";

import PhonenumberForm from "@/features/login/forms/enterPhoneForm";
import VerificationCodeForm from "@/features/login/forms/enterCodeForm";

import UserIcon from "@/ui/icons/users";
import SearchIcon from "@/ui/icons/searchs";
import ExitIcon from "@/ui/icons/exits";

export default function LoginForm({ onSuccess = () => {} }) {
  const [step, setStep] = useState(0);
  const [phonenumber, setPhonenumber] = useState("");
  const [hasStartedVerification, setHasStartedVerification] = useState(false);
  return (
    <div
      className="flex flex-col justify-center items-center gap-6 text-center w-full h-full  "
      dir="rtl"
    >
      {hasStartedVerification && (
        <div className="flex justify-start w-full">
          <button onClick={() => setHasStartedVerification(false)}>
            بازگشت
          </button>
        </div>
      )}

      <MultiStep
        step={step}
        icons={[
          <UserIcon className="w-4 h-4 fill-none stroke-inherit" key={1} />,
          <SearchIcon className="w-3 h-3 fill-inherit " key={2} />,
          <ExitIcon className="w-3 h-3 fill-inherit " key={3} />,
        ]}
        forms={[
          <PhonenumberForm
            key={1}
            phonenumber={phonenumber}
            onChange={(value) => setPhonenumber(value)}
            onSubmit={() => setStep((prev) => prev + 1)}
          />,
          <VerificationCodeForm
            key={2}
            phonenumber={phonenumber}
            onSubmit={(value) => setStep((prev) => prev + 1)}
          />,

          <LoginSuccessFull onSuccess={onSuccess} key={3} />,
        ]}
      />
    </div>
  );
}

export function LoginSuccessFull({ onSuccess = () => {} }) {
  const router = useRouter();
  onSuccess();
  useEffect(() => {
    router.push("/");
  }, []);

  return <div>با موفقیت انجام شد</div>;
}

export function MultiStep({ step, forms = [], icons = [] }) {
  return (
    <>
      <div className="flex gap-10 flex-row-reverse">
        {icons.map((icon, i) => {
          return (
            <span
              key={i}
              className={`${
                step === i
                  ? "bg-atysa-900 fill-white stroke-white scale-125"
                  : "border-[1px] border-dashed border-atysa-900  stroke-atysa-900 fill-atysa-900"
              } span-${i}  green-dot flex flex-row justify-center items-center w-2 h-2 p-5  border text-center rounded-full transition-transform`}
            >
              <h4 className="">{icon}</h4>
            </span>
          );
        })}
      </div>

      {forms[step]}
    </>
  );
}
