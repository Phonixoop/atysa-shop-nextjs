export default function Tag({
  children,
  bg = "bg-atysa-primary ",
  text = "text-atysa-main",
  className = "text-center flex justify-center items-center  leading-[14px] font-bold  rounded-full px-2 ",
  extraClass = "",
}) {
  return (
    <span className={`${className} ${bg} ${text} ${extraClass}`}>
      {children}
    </span>
  );
}
