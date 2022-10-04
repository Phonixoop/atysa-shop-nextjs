import { useState } from "react";
// next components
// next auth
// my ui
import TextField from "@/ui/froms/text-field";
import Cricle from "ui/icons/loadings/cricle";
import { signIn } from "next-auth/react";
import IntegerField from "ui/froms/integer-field";
import withValidation from "ui/froms/with-validation";
import { jsonify } from "utils";

const CodeWithValidation = withValidation(IntegerField);

export default function EnterVerificationCodeForm({
  phonenumber,
  onSuccess = () => {},
}) {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [validations, setValidations] = useState([""]);

  const isFourNumber = (text) => (text.length === 4 ? "" : "Must be 4 number");
  return (
    <>
      <h3>
        کد فرستاده شده به <span className="text-blue-900">{phonenumber}</span>{" "}
        را وارد کنید
      </h3>
      <div className="w-8/12 flex flex-col gap-4">
        <CodeWithValidation
          label="کد تایید"
          value={verificationCode}
          validations={[isFourNumber]}
          onValidation={(value) => setValidations(value)}
          onChange={(value) => setVerificationCode(value)}
          autoComplete="one-time-code"
        />

        <button
          className={`${
            loading || validations.length > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-400 hover:bg-blue-600  cursor-pointer"
          } relative w-full flex justify-start items-center p-2  rounded-lg  transition-all duration-400`}
          disabled={false}
          onClick={async () => {
            if (verificationCode.length <= 0) return;
            setLoading(true);
            const result = await signIn("credentials", {
              phonenumber,
              verificationCode,
              callbackUrl: `${window.location.origin}/`,
              redirect: false,
            });
            setLoading(false);
            if (result?.error) {
              return setError(JSON.parse(result.error));
            }
            onSuccess(result);
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
      <span className="text-red-600">{error}</span>
    </>
  );
}
