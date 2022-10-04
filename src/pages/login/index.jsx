import { useState } from "react";
// next components
// next auth
// my ui

import { signIn } from "next-auth/react";
import { useAuth } from "features/auth";
import { useRouter } from "next/router";

import MainLogo from "@/ui/logo";

import EnterPhonenumberForm from "./enterPhoneForm";
import EnterVerificationCodeForm from "./enterCodeForm";

export default function LoginPage() {
  const [phonenumber, setPhonenumber] = useState("");
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
