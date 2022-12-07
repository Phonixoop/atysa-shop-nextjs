export default function Tag({
  children,
  className = "text-center flex justify-center items-center  leading-[14px] font-bold text-atysa-main bg-atysa-primary rounded-full px-2 ",
  extraClass = "",
}) {
  return <span className={`${className} ${extraClass}`}>{children}</span>;
}
