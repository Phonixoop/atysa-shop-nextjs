import { useContext, useRef, useState } from "react";
// next components
// next auth
// my ui
import IntegerField from "@/ui/froms/integer-field";
import TextField from "@/ui/froms/text-field";

import MainLogo from "@/ui/logo";
import { AuthContext, useAuth } from "features/auth";
import { useRouter } from "next/router";
import { withSessionSsr } from "lib/withSession";
import Cricle from "ui/icons/loadings/cricle";

export default function LoginPage() {
  const auth = useAuth();

  const { user, setUser, requestCode, login } = useContext(AuthContext);
  const [phonenumber, setPhonenumber] = useState("");
  const [error, setError] = useState("");
  const [getCodeLoading, setGetCodeLoading] = useState(false);
  const [hasStartedVerification, setHasStartedVerification] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row h-screen select-none">
        <div className="relative flex justify-center items-center w-full md:w-1/2 h-full">
          <div
            className="flex flex-col justify-center items-center gap-6 text-center w-10/12 h-3/6 bg-white shadow-md shadow-blue-100 rounded-3xl px-10 "
            dir="rtl"
          >
            <MainLogo href="/" />

            {!hasStartedVerification ? (
              <EnterPhonenumberForm
                value={phonenumber}
                loading={getCodeLoading}
                onChange={(value) => setPhonenumber(value)}
                onSubmit={async (phonenumber) => {
                  setGetCodeLoading(true);
                  const result = await requestCode({ phonenumber });
                  if (result.error) {
                    return setError(error);
                  }
                  setGetCodeLoading(false);
                  return setHasStartedVerification(true);
                }}
              />
            ) : (
              <>
                <EnterVerificationCode
                  onSubmit={async (verificationCode) => {
                    const result = await login({
                      phonenumber,
                      verificationCode,
                    });
                    if (result.error) {
                      return setError(result.error);
                    }

                    router.push("/");
                  }}
                />
                <span className="text-red-600">{error}</span>
              </>
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

function EnterPhonenumberForm({
  value,
  loading,
  onChange = () => {},
  onSubmit = () => {},
  ...rest
}) {
  return (
    <>
      <h1 className="text-2xl text-blue-600 pb-2">خوش آمدید</h1>
      <h3>فقط کافیست شماره تلفن همراه خود را وارد نمایید</h3>
      <div className="w-8/12 flex flex-col gap-4">
        <IntegerField
          value={value}
          onChange={(value) => onChange(value)}
          label="شماره تلفن همراه "
          required
        />

        <button
          className={`${
            loading
              ? "bg-gray-400 hover:bg-gray-400"
              : "bg-blue-400 hover:bg-blue-600 "
          } relative w-full flex justify-start items-center p-2  rounded-lg cursor-pointer transition-all duration-200`}
          disabled={loading}
          onClick={() => (value.length > 0 ? onSubmit(value) : "")}
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

function EnterVerificationCode({ onSubmit }) {
  const [verificationCode, setVerificationCode] = useState("");

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
          className="w-full p-2 bg-blue-400 hover:bg-blue-600 rounded-lg"
          onClick={() =>
            verificationCode.length > 0 ? onSubmit(verificationCode) : ""
          }
        >
          ورود/ثبت نام
        </button>
      </div>
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

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    if (user) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  }
);
//  async function startVerification(phonenumber) {
//     if (phonenumber === undefined) return;
//     const result = await fetch("/api/auth/start-verification", {
//       method: "POST",
//       body: JSON.stringify({ phonenumber }),
//       headers: { "Content-Type": "application/json" },
//     });
//     if (result.status !== 200) return;
//     setHasStartedVerification(true);
//   }

//   async function checkVerification({ phonenumber, verificationCode }) {
//     const result = await signIn("email", {
//       email: "ali.hassanzadeh78@gmail.com",
//       callbackUrl: "/",
//       redirect: false,
//     });
//     console.dir({ result });
//     // if (JSON.parse(error)) setError(JSON.parse(error).errors);
//   }
