export function TableSkeleton() {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="w-full h-6 bg-gray-400 animate-pulse"></div>
        <div className="w-full h-6 bg-gray-400 animate-pulse"></div>
        <div className="w-full h-6 bg-gray-400 animate-pulse"></div>
        <div className="w-full h-6 bg-gray-400 animate-pulse"></div>
        <div className="w-full h-6 bg-gray-400 animate-pulse"></div>
      </div>
    </>
  );
}
