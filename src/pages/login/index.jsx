import { useEffect, useRef, useState } from "react";
// next components
// next auth
// my ui

import { useRouter } from "next/router";

import MainLogo from "@/ui/logo";

import PhonenumberForm from "@/features/login/forms/enterPhoneForm";
import VerificationCodeForm from "@/features/login/forms/enterCodeForm";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

import List from "ui/list";

//const PhoneFormWithStep = withStep(PhonenumberForm);

export default function LoginPage() {
  const [step, setStep] = useState(0);
  const [phonenumber, setPhonenumber] = useState("");
  const [hasStartedVerification, setHasStartedVerification] = useState(false);

  return (
    <>
      {/* <div className="flex flex-row h-screen select-none">
        <div className="relative flex justify-center items-center w-full md:w-1/2 h-full">
          <div
            className="flex flex-col justify-center items-center gap-6 text-center w-10/12 h-3/6 bg-white shadow-md shadow-blue-100 rounded-3xl px-10 "
            dir="rtl"
          >
            {hasStartedVerification && (
              <div className="flex justify-start w-full">
                <button
                  className=""
                  onClick={() => setHasStartedVerification(false)}
                >
                  بازگشت{" "}
                </button>
              </div>
            )}

            <MainLogo href="/" />

            {!hasStartedVerification ? (
              <EnterPhonenumberForm
                phonenumber={phonenumber}
                onChange={(value) => setPhonenumber(value)}
                onSubmit={() => setHasStartedVerification(true)}
              />
            ) : (
              <>
                <EnterVerificationCodeForm
                  phonenumber={phonenumber}
                  onSuccess={(value) => router.push(value.url)}
                />
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
      </div> */}

      <div className="flex flex-row h-screen select-none">
        <div className="relative flex justify-center items-center w-full md:w-1/2 h-full">
          <div
            className="flex flex-col justify-center items-center gap-6 text-center w-10/12 h-3/6 bg-white shadow-md shadow-blue-100 rounded-3xl px-10 "
            dir="rtl"
          >
            {hasStartedVerification && (
              <div className="flex justify-start w-full">
                <button onClick={() => setHasStartedVerification(false)}>
                  بازگشت
                </button>
              </div>
            )}

            <MainLogo href="/" />
            <MultiStep
              step={step}
              forms={[
                <PhonenumberForm
                  phonenumber={phonenumber}
                  onChange={(value) => setPhonenumber(value)}
                  onSubmit={() => setStep((prev) => prev + 1)}
                />,
                <VerificationCodeForm
                  phonenumber={phonenumber}
                  onSubmit={(value) => setStep((prev) => prev + 1)}
                />,
                <LoginSuccessFull />,
              ]}
            />
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

export function LoginSuccessFull() {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);

  return <div>با موفقیت انجام شد</div>;
}

export function withStep(Component) {
  return function WrappedStep({ step = 0, onNext = () => {}, ...rest }) {
    useEffect(() => {}, [step]);

    return <Component {...rest} />;
  };
}

export function MultiStep({ step, forms = [] }) {
  return forms[step];
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
export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
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
