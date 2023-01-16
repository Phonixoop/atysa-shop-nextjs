export default function Row({ title, children }) {
  return (
    <div className="flex justify-between items-center w-full bg-atysa-primary shadow-inner p-2  rounded-md">
      <span className="w-full text-right text-atysa-main font-bold">
        {title}
      </span>
      <div className="flex items-center min-w-fit ">{children}</div>
    </div>
  );
}
