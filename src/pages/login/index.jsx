import { useEffect, useRef, useState } from "react";
// next components
// next auth
// my ui

import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import LoginForm from "features/login/login-form";

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
