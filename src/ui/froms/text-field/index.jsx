import { useEffect, useRef } from "react";

export default function TextField({
  children,
  className = " placeholder:opacity-0 focus:placeholder:opacity-100 selection:text-white selection:bg-blue-900 block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
  value,
  placeholder = " ",
  isRtl = true,
  onChange = () => {},
  focused = false,
  onBlur = () => {},
  ...rest
}) {
  const direction = `${isRtl ? "text-right" : "text-left"}`;
  const ref = useRef(undefined);

  useEffect(() => {
    if (!focused) return;
    ref.current.focus();
  }, [focused]);
  return (
    <>
      <style jsx>
        {`
          @media (max-width: 1000px) {
            .placeholder {
              opacity: 0;
            }
          }
        `}
      </style>

      <input
        ref={ref}
        type="text"
        className={`${direction} ${className}`}
        placeholder=" "
        value={value}
        autoComplete="off"
        onBlur={() => onBlur()}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />

      <label
        onClick={() => ref.current.focus()}
        className="placeholder absolute
       text-sm
    text-gray-500
    dark:text-gray-400
       duration-300
        transform
       -translate-y-4 
        scale-75
        top-9 
        origin-top-right 
        right-2.5
       peer-focus:text-blue-400
       peer-focus:dark:text-blue-200
        peer-placeholder-shown:scale-100  
         
        opacity-0
        mobile:peer-focus:opacity-100"
      >
        {placeholder}
      </label>
    </>
  );
}
