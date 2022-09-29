import { useRef, useState } from "react";
// next components
import Link from "next/link";
// next auth
import { signIn } from "next-auth/react";
// my ui
import IntegerField from "@/ui/froms/integer-field";
import MainLogo from "@/ui/logo";
export default function LoginPage() {
  const [phonenumber, setPhonenumber] = useState("");
  const [hasStartedVerification, setHasStartedVerification] = useState(false);

  async function startVerification(phonenumber) {
    if (phonenumber === undefined) return;
    alert(phonenumber);
    const result = await fetch("/api/auth/start-verification", {
      method: "POST",
      body: JSON.stringify({ phonenumber }),
      headers: { "Content-Type": "application/json" },
    });
    if (result.status !== 200) return;
    setHasStartedVerification(true);
  }

  async function checkVerification({ phonenumber, verificationCode }) {
    await signIn("credentials", { phonenumber, verificationCode });
  }

  return (
    <>
      <div className="flex flex-row h-screen select-none">
        <div className="relative flex justify-center items-center w-full md:w-1/2 h-full">
          <div
            className="flex flex-col justify-center items-center gap-6 text-center w-10/12 h-3/6 bg-white shadow-xl rounded-3xl px-10 "
            dir="rtl"
          >
            {!hasStartedVerification ? (
              <LoginForm
                value={phonenumber}
                onChange={(value) => setPhonenumber(value)}
                onSubmit={(phonenumber) => startVerification(phonenumber)}
              />
            ) : (
              <EnterVerificationCode
                onSubmit={(verificationCode) =>
                  checkVerification({ phonenumber, verificationCode })
                }
              />
            )}
          </div>
        </div>
        <MiddleLine />
        <video
          className="absolute w-1/2 bottom-0 right-0 hidden md:block"
          loop
          autoPlay
          muted
        >
          <source src="/videos/login-bg-video.mp4" type="video/mp4" />
          <source src="/videos/login-bg-video.mp4" type="video/ogg" />
        </video>
      </div>
    </>
  );
}

function LoginForm({
  value,
  onChange = () => {},
  onSubmit = () => {},
  ...rest
}) {
  return (
    <>
      <MainLogo href="/" />

      <h1 className="text-2xl text-blue-600 pb-2">خوش آمدید</h1>
      <h3>فقط کافیست شماره تلفن همراه خود را وارد نمایید</h3>
      <div className="w-10/12">
        <IntegerField
          value={value}
          onChange={(value) => onChange(value)}
          label="شماره تلفن همراه "
          required
        />
      </div>

      <button
        className="w-10/12 p-2 bg-blue-400 hover:bg-blue-600 rounded-lg"
        onClick={() => (value.length > 0 ? onSubmit(value) : "")}
      >
        گرفتن کد تایید
      </button>
    </>
  );
}

function EnterVerificationCode({ onSubmit }) {
  const [verificationCode, setVerificationCode] = useState("");

  return (
    <>
      کد را وارد کنید
      <IntegerField
        label="کد تایید"
        value={verificationCode}
        onChange={(value) => setVerificationCode(value)}
        name="verificationCode"
        autoComplete="one-time-code"
        type="text"
      />
      <button
        className="w-10/12 p-2 bg-blue-400 hover:bg-blue-600 rounded-lg"
        onClick={() =>
          verificationCode.length > 0 ? onSubmit(verificationCode) : ""
        }
      >
        ورود/ثبت نام
      </button>
    </>
  );
}

function MiddleLine() {
  return (
    <div
      className="absolute hidden md:flex
     w-4 h-12 z-10        
     top-1/2 left-1/2
     transform 
    -translate-x-1/2 
    -translate-y-1/2 
     justify-center items-center"
    >
      <div
        className="relative
     w-[3px] h-full z-10
    bg-blue-200  rounded-tl-2xl rounded-bl-2xl"
      />
      <div
        className="relative
     w-[3px] h-full z-10
    bg-atysa-primary  rounded-tr-2xl rounded-br-2xl
    "
      />
    </div>
  );
}
