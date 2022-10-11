import { useState } from "react";
// next components
// next auth
// my ui
import Cricle from "@/ui/icons/loadings/cricle";
import { signIn } from "next-auth/react";
import withValidation from "@/ui/froms/with-validation";
import withLabel from "@/ui/froms/with-label";
import PhoneField from "@/ui/froms/phone-field";

const IntegerWithLabel = withLabel(PhoneField);
const CodeWithValidation = withValidation(IntegerWithLabel);

export default function VerificationCodeForm({
  phonenumber,
  onSubmit = () => {},
}) {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [validations, setValidations] = useState([""]);

  const canGoNext = () => !loading && validations.length <= 0;

  const isFourNumber = (text) => (text.length === 4 ? "" : "Must be 4 number");

  async function handleForm(e) {
    e.preventDefault();
    if (!canGoNext) return;
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
    onSubmit(result);
  }
  return (
    <>
      <h3>
        کد فرستاده شده به <span className="text-blue-900"> {phonenumber} </span>
        را وارد کنید
      </h3>
      <form className="w-8/12 flex flex-col gap-4" onSubmit={handleForm}>
        <CodeWithValidation
          focused={true}
          label="کد تایید"
          value={verificationCode}
          validations={[isFourNumber]}
          onValidation={(value) => setValidations(value)}
          onChange={(value) => setVerificationCode(value)}
          autoComplete="one-time-code"
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
          <span className="flex-grow"> ورود/ثبت نام </span>
          <Cricle
            extraClasses={`${
              loading ? "opacity-100" : "opacity-0"
            } absolute z-10 `}
          />
        </button>
      </form>
      <span className="text-red-600">{error}</span>
    </>
  );
}
