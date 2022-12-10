import Image from "next/image";
export default function Tag({
  children,
  iconUrl = "",

  text = "text-atysa-main",
  className = "text-center flex gap-2  flex-col justify-center items-center  leading-[14px] font-bold  px-2 ",
  extraClass = "",
}) {
  return (
    <>
      <div className={`${className} ${text} ${extraClass}`}>
        {iconUrl.length > 0 && (
          <Image
            src={iconUrl || `https://atysa.ir/icons/ingredients/${"کاهو"}.png`}
            objectFit="contain"
            width={25}
            height={25}
          />
        )}
        {children}
      </div>
    </>
  );
}
