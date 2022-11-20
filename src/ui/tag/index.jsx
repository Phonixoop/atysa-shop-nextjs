export default function Tag({
  children,
  className = "text-center flex justify-center items-center  leading-[14px] text-white bg-green-700 rounded-full px-2 ",
  extraClass = "",
}) {
  return <span className={`${className} ${extraClass}`}>{children}</span>;
}
