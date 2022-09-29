import { useState } from "react";
import { signIn } from "next-auth/react";
import TextField from "../../ui/froms/text-field";
export default function LoginPage() {
  const [hasStartedVerification, setHasStartedVerification] = useState(false);
  const [credentials, setCredentials] = useState(undefined);

  async function startVerification({ phonenumber }) {
    const result = await fetch("/api/auth/start-verification", {
      method: "POST",
      body: JSON.stringify({ phonenumber }),
      headers: { "Content-Type": "application/json" },
    });
    if (result.status !== 200) return;
    setCredentials({ phonenumber });
    setHasStartedVerification(true);
    console.dir({ result });
  }

  async function checkVerification({ verificationCode }) {
    await signIn("credentials", { phonenumber, verificationCode });
  }

  return (
    <>
      <div className="flex flex-row h-screen">
        <div className="relative flex justify-center items-center w-full md:w-1/2 h-full">
          <div
            className="flex flex-col justify-center items-center gap-8 text-center w-10/12 h-3/6 bg-white shadow-xl rounded-3xl p-10"
            dir="rtl"
          >
            <h1 className="text-2xl text-blue-600 pb-2">خوش آمدید</h1>
            <h3>فقط کافیست شماره تلفن همراه خود را وارد نمایید</h3>
            <div className="w-10/12">
              <TextField label="شماره تلفن همراه " />
            </div>
          </div>
        </div>
        <div
          className="absolute hidden md:flex
             w-4 h-40 z-10        
             top-1/2 left-1/2
             transform 
            -translate-x-1/2 
            -translate-y-1/2 
             justify-center items-center"
        >
          <div
            className="relative
             w-[3px] h-40 z-10
            bg-blue-400  rounded-tl-2xl rounded-bl-2xl"
          />
          <div
            className="relative
             w-[3px] h-40 z-10
            bg-atysa-primary  rounded-tr-2xl rounded-br-2xl
            "
          />
        </div>
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

function PhonenumberForm({ onSubmit }) {
  const [phonenumber, setPhonenumber] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ phonenumber });
      }}
    >
      <label>
        Phonenumber
        <input
          value={phonenumber}
          onChange={(event) => setPhonenumber(event.target.value)}
          type="text"
        />
      </label>
      <button type="submit">Continue</button>
    </form>
  );
}

function EnterVerificationCode({ onSubmit }) {
  const [verificationCode, setVerificationCode] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ verificationCode });
      }}
    >
      <label>
        Verification Code
        <input
          value={verificationCode}
          onChange={(event) => setVerificationCode(event.target.value)}
          name="verificationCode"
          autoComplete="one-time-code"
          type="text"
        />
      </label>
      <button type="submit">Log in</button>
    </form>
  );
}
