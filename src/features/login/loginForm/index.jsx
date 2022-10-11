import React, { useState } from "react";
import { useRouter } from "next/router";

import MainLogo from "@/ui/logo";

import PhonenumberForm from "@/features/login/forms/enterPhoneForm";
import VerificationCodeForm from "@/features/login/forms/enterCodeForm";

import UserIcon from "@/ui/icons/users";
import SearchIcon from "@/ui/icons/searchs";
import ExitIcon from "@/ui/icons/exits";

export default function LoginForm() {
  const [step, setStep] = useState(0);
  const [phonenumber, setPhonenumber] = useState("");
  const [hasStartedVerification, setHasStartedVerification] = useState(false);
  return (
    <div
      className="flex flex-col justify-center items-center gap-6 text-center w-full h-full bg-white shadow-md shadow-blue-100 rounded-3xl px-10 "
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
          <UserIcon key={1} />,
          <SearchIcon key={2} />,
          <ExitIcon key={3} />,
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
          <LoginSuccessFull key={3} />,
        ]}
      />
    </div>
  );
}

export function LoginSuccessFull() {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, [router]);

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
                step === i ? "bg-blue-400 text-blue-100" : "text-black"
              } span-${i} green-dot flex flex-row justify-center items-center w-2 h-2 p-5  border text-center border-blue-400 rounded-full`}
            >
              <h4 key={i}>{icon}</h4>
            </span>
          );
        })}
      </div>

      <MainLogo href="/" />
      {forms[step]}
    </>
  );
}
