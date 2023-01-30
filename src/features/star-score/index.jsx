import StarIcon from "ui/icons/star";
export default function StarScore({ score }) {
  return (
    <div className="flex justify-center items-center gap-1 border-[1px] border-amber-100 rounded-md  px-[6px]">
      <StarIcon />
      <span className="text-[0.7rem] text-atysa-800 font-bold text-center pt-1">
        {score}
      </span>
    </div>
  );
}
