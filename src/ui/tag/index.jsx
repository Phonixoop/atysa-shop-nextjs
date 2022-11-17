export default function Tag({ children }) {
  return (
    <span className="text-center flex justify-center items-center  leading-[14px] text-white bg-green-700 rounded-full px-[5px] py-[1px] text-[0.7rem]">
      {children}
    </span>
  );
}
