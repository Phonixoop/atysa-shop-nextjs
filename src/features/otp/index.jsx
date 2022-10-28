import { useEffect } from "react";

export default function Otp({
  length = 6,
  phone,
  code = "",
  onChange = () => {},
}) {
  return (
    <div className="p-8 w-full mx-auto bg-white rounded-lg border border-gray-700 text-gray-800">
      <div className="flex flex-col gap-8">
        <div>
          <div>Verify the authorisation code</div>
          <div>sent to {phone}</div>
        </div>

        <OtpCodeField
          {...{
            code,
            length,
            onChange: (code) =>
              onChange((prev) => ({
                ...prev,
                code,
              })),
          }}
        />

        <div className="">Resend authorisation code in 0 seconds.</div>

        <div className="flex justify-center">
          <button className="py-2 px-6 text-blue-400 font-bold">Submit</button>
        </div>
      </div>
    </div>
  );
}
function clipboardData(e) {
  return (e.clipboardData || window.clipboardData).getData("text");
}

function OtpCodeField({ code, length, onChange = () => {} }) {
  useEffect(() => {
    const handler = (e) => {
      const pasted = clipboardData(e).split("");

      onChange(
        codeArray.map((char, i) => (pasted[i] ? pasted[i] : char)).join("")
      );
    };

    window.addEventListener("paste", handler);

    return () => window.removeEventListener("paste", handler);
  }, []);

  const codeArray = [...new Array(length)].map((v, i) =>
    code[i] ? code[i] : ""
  );

  function update({ index, value }) {
    onChange(codeArray.map((old, i) => (i === index ? value : old)).join(""));
  }

  return (
    <div className="flex items-center gap-2">
      {codeArray.map((_, i) => (
        <input
          key={i}
          max={1}
          value={code[i]}
          onChange={(e) => {
            const value = e.target.value[0];
            update({ index: i, value: value ? value : "" });
          }}
          type="text"
          className="focus:outline-gray-100 focus:outline-[1px] outline-none w-full border-b-gray-200 border-b-[2px] text-center"
        />
      ))}
    </div>
  );
}
