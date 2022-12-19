import { useState } from "react";
// next components
// next auth
// my ui
//import Circle from "@/ui/icons/loadings/circle";
import { signIn } from "next-auth/react";
import withValidation from "@/ui/forms/with-validation";
import withLabel from "@/ui/forms/with-label";
import PhoneField from "@/ui/forms/phone-field";
import Button from "ui/buttons";
import { useEffect } from "react";

const PhoneWithLabel = withLabel(PhoneField);
const CodeWithValidation = withValidation(PhoneWithLabel);

export default function VerificationCodeForm({
  phonenumber,
  onSubmit = () => {},
}) {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [validations, setValidations] = useState([""]);

  const canGoNext = () => !loading && validations.length <= 0;

  const isFourNumber = (text) => (text.length === 4 ? "" : "باید 4 رقم باشد");

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

  const [otp, setOtp] = useState("");
  useEffect(() => {
    if ("OTPCredential" in window) {
      window.addEventListener("DOMContentLoaded", (e) => {
        const ac = new AbortController();

        navigator.credentials
          .get({
            otp: { transport: ["sms"] },
            signal: ac.signal,
          })
          .then((otp) => {
            setOtp(otp.code);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }, []);

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
        code : {otp}
        <Button
          disabled={!canGoNext() || loading}
          isLoading={loading}
          className="bg-atysa-main w-full"
          type="submit"
        >
          ورود/ثبت نام
        </Button>
      </form>
      <span className="text-red-600">{error}</span>
    </>
  );
}
