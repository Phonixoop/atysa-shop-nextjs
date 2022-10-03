// next components
// next auth
// my ui
import IntegerField from "@/ui/froms/integer-field";
import { useState } from "react";
import Cricle from "ui/icons/loadings/cricle";

export default function EnterPhonenumberForm({
  phonenumber,
  onChange = () => {},
  onSubmit = () => {},
  ...rest
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  return (
    <>
      <h1 className="text-2xl text-blue-600 pb-2">خوش آمدید</h1>
      <h3>فقط کافیست شماره تلفن همراه خود را وارد نمایید</h3>
      <div className="w-8/12 flex flex-col gap-4">
        <IntegerField
          value={phonenumber}
          onChange={(phonenumber) => onChange(phonenumber)}
          label="شماره تلفن همراه "
          required
        />
        <button
          className={`${
            loading || phonenumber.length <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-400 hover:bg-blue-600  cursor-pointer"
          } relative w-full flex justify-start items-center p-2  rounded-lg  transition-all duration-400`}
          disabled={false}
          onClick={async () => {
            if (loading || phonenumber.length <= 0) return;
            setLoading(true);
            const result = await requestCode({ phonenumber });
            alert(JSON.stringify(result));
            if (!result.ok) {
              return setError(result.error);
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
