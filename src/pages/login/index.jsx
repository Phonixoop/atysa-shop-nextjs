import { useEffect, useRef, useState } from "react";
// next components
// next auth
// my ui

import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]";
import LoginForm from "@/features/login/login-form";

//const PhoneFormWithStep = withStep(PhonenumberForm);

export default function LoginPage() {
  return (
    <div className="flex  flex-row h-screen select-none">
      <div className="relative flex justify-center items-center w-full md:w-1/2  h-full ">
        <div className="md:w-10/12  w-11/12 md:h-4/6 h-5/6 ">
          <LoginForm />
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

// export function withStep(Component) {
//   return function WrappedStep({ step = 0, onNext = () => {}, ...rest }) {
//     useEffect(() => {}, [step]);

//     return <Component {...rest} />;
//   };
// }
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

/*<section class="py-10 bg-gray-100 sm:py-16 lg:py-24">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">How do we create success</h2>
            <p class="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis.</p>
        </div>

        <ul class="max-w-md mx-auto mt-16 space-y-12">
            <li class="relative flex items-start">
                <div class="-ml-0.5 absolute mt-0.5 top-14 left-8 w-px border-l-4 border-dotted border-gray-300 h-full" aria-hidden="true"></div>

                <div class="relative flex items-center justify-center flex-shrink-0 w-16 h-16 bg-white rounded-full shadow">
                    <svg class="w-10 h-10 text-fuchsia-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div class="ml-6">
                    <h3 class="text-lg font-semibold text-black">Create a free account</h3>
                    <p class="mt-4 text-base text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                </div>
            </li>

            <li class="relative flex items-start">
                <div class="-ml-0.5 absolute mt-0.5 top-14 left-8 w-px border-l-4 border-dotted border-gray-300 h-full" aria-hidden="true"></div>

                <div class="relative flex items-center justify-center flex-shrink-0 w-16 h-16 bg-white rounded-full shadow">
                    <svg class="w-10 h-10 text-fuchsia-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                </div>
                <div class="ml-6">
                    <h3 class="text-lg font-semibold text-black">Build your website</h3>
                    <p class="mt-4 text-base text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                </div>
            </li>

            <li class="relative flex items-start">
                <div class="relative flex items-center justify-center flex-shrink-0 w-16 h-16 bg-white rounded-full shadow">
                    <svg class="w-10 h-10 text-fuchsia-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div class="ml-6">
                    <h3 class="text-lg font-semibold text-black">Release & launch</h3>
                    <p class="mt-4 text-base text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                </div>
            </li>
        </ul>
    </div>
</section>
*/
