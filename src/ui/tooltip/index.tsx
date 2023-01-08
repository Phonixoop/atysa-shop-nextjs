export default function ToolTip({ children, title = "" }) {
  return (
    <div className="relative min-w-fit  flex justify-center items-center group ">
      <span
        className="flex absolute -top-10 left-1/2 -translate-x-1/2
         w-max 
         z-50 bg-atysa-900 rounded-xl text-yellow-500 p-2 scale-[0] opacity-0
         group-hover:scale-100 group-focus:scale-100
         group-hover:opacity-100 group-focus:opacity-100
         transition-all duration-300"
      >
        {title}
      </span>
      {children}
    </div>
  );
}
