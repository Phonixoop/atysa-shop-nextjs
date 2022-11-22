//icon
import Clock from "ui/icons/clocks";
import Calendar from "ui/icons/calendar";

import moment from "jalali-moment";
export default function DateTime({
  className = "font-bold text-lg",
  value = undefined,
}) {
  if (!value) return "";
  const dayName = moment(value).locale("fa").format("dddd");
  const monthNumber = moment(value).locale("fa").format("D");
  const monthName = moment(value).locale("fa").format("MMMM");
  const time = moment(value).locale("fa").format("HH:mm");
  return (
    <div className="flex gap-2 justify-center items-center text-center">
      <div className="flex justify-center items-center gap-2 ">
        <span className="pb-1">
          <Calendar className="w-[0.9rem] h-[0.9rem] fill-gray-500" />
        </span>
        <span className={className}> {dayName}</span>
        <span className={className}> {monthNumber}</span>
        <span className={className}> {monthName}</span>
      </div>
      |
      <div className="flex justify-center items-center gap-2 ">
        <span className={className}> {time}</span>
        <span className="pb-1">
          <Clock />
        </span>
      </div>
    </div>
  );
}
