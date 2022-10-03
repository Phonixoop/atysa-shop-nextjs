import { useState } from "react";
// next components
// next auth
// my ui
import TextField from "@/ui/froms/text-field";
import Cricle from "ui/icons/loadings/cricle";

export default function EnterVerificationCodeForm({ onSubmit }) {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <>
      کد را وارد کنید
      <div className="w-8/12 flex flex-col gap-4">
        <TextField
          label="کد تایید"
          value={verificationCode}
          onChange={(value) => setVerificationCode(value)}
          autoComplete="one-time-code"
          type="text"
        />

        <button
          className={`${
            loading || verificationCode.length <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-400 hover:bg-blue-600  cursor-pointer"
          } relative w-full flex justify-start items-center p-2  rounded-lg  transition-all duration-400`}
          disabled={false}
          onClick={() => {
            if (verificationCode.length <= 0) return;
            onSubmit(verificationCode);
            setLoading(true);
          }}
        >
          <span className="flex-grow"> ورود/ثبت نام </span>
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
