import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import moment from "jalali-moment";
import { DAYS } from "data";
import RadioBox from "../../ui/forms/radiobox";
const Days = Object.values(DAYS).reverse();

const products = [
  {
    id: 0,
    name: "chicken",
    deliver_period: {
      availableDaysOfWeek: ["شنبه", "سه شنبه", "جمعه"],
      delay: 0,
      timePeriod: {
        startTime: "12",
        endTime: "16",
      },
    },
  },
  {
    id: 0,
    name: "chicken",
    deliver_period: {
      availableDaysOfWeek: [
        "شنبه",
        "یک شنبه",
        "دو شنبه",
        "سه شنبه",
        "چهار شنبه",
        "پنج شنبه",
        "جمعه",
      ],
      delay: 48,
      timePeriod: {
        startTime: "13",
        endTime: "18",
      },
    },
  },
];

var __startTime = moment("2016-06-06T12:00").format();
var __endTime = moment("2016-06-06T18:00").format();

var __duration = moment.duration(moment(__endTime).diff(__startTime));
var __hours = __duration.asHours();
console.log(__hours);

export default function TestPage() {
  return (
    <div className="flex justify-center items-center mx-auto w-full h-[80vh]">
      <DatePicker />
    </div>
  );
}

function DatePicker() {
  const weekRange = getRange();
  const [selectedTab, setSelectedTab] = useState(weekRange[0].id);

  return (
    <>
      <div
        dir="rtl"
        className="flex flex-col gap-2 justify-center items-center w-full mx-auto"
      >
        <button onClick={() => console.log(weekRange)}>get range</button>
        {selectedTab}
        <div className="">
          <ul className="flex gap-5 ">
            {weekRange.map((item) => (
              <WeekButton
                key={item.id}
                isActive={item.id === selectedTab}
                onClick={() => setSelectedTab(item.id)}
              >
                <div className="flex flex-col ">
                  <span className="text-xs  bg-inherit text-inherit text-center rounded-full ">
                    {item.date}
                  </span>
                  <span>{item.dayName}</span>
                </div>
              </WeekButton>
            ))}
          </ul>
        </div>
        <div>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={selectedTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedTab !== undefined ? selectedTab : "😋"}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function WeekButton({
  children,
  dayTimesPeriod = [],
  isActive = false,
  onClick = () => {},
}) {
  const [timePeriod, setTimePeriod] = useState({
    selectedTime: "",
    times: [
      {
        id: "15 آذر 12-16",
        value: "12-16",
      },
      {
        id: "16 آذر 18-22",
        value: "18-22",
      },
    ],
  });
  return (
    <div className="flex flex-col gap-5">
      <li
        className={`min-w-[70px] relative cursor-pointer py-2 text-center  z-10 transition-transform ${
          isActive ? " text-atysa-800 font-[600] " : ""
        }`}
        onClick={onClick}
      >
        {children}
        {isActive ? (
          <motion.div
            className="absolute inset-0 rounded-sm  border-b-atysa-800 border-b-2 rounded-t-lg -z-10 "
            layoutId="underline"
          />
        ) : undefined}
      </li>

      <div>
        {timePeriod.times.map((time, i) => {
          return (
            <div
              dir="rtl"
              className="flex flex-row-reverse justify-center items-center gap-2"
              onClick={() => {
                setTimePeriod((prev) => {
                  return { ...prev, selectedTime: time.value };
                });
              }}
            >
              <label className="w-14">{time.value}</label>
              {/* <input
                type="radio"
                value={time.value}
                checked={time.value === timePeriod.selectedTime}
                name="date"
              /> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function getRange() {
  const date = {};
  date.dateArr = []; //Array where rest of the dates will be stored

  date.prevDate = moment().subtract(0, "days"); //15 days back date from today(This is the from date)

  date.nextDate = moment().add(7, "days"); //Date after 15 days from today (This is the end date)

  //extracting date from objects in MM-DD-YYYY format
  date.prevDate = moment(date.prevDate._d).format("MM-DD-YYYY");
  date.nextDate = moment(date.nextDate._d).format("MM-DD-YYYY");

  //creating JS date objects
  var start = new Date(date.prevDate);
  var end = new Date(date.nextDate);

  //Logic for getting rest of the dates between two dates("FromDate" to "EndDate")
  let id = 0;
  while (start < end) {
    const value = moment(start).locale("fa");
    const result = {
      id,
      dayNumber: value.format("D"),
      dayName: removeHalfSpace(value.format("dddd")),
      date: value.format("DD MMMM"),
    };
    date.dateArr.push(result);

    var newDate = start.setDate(start.getDate() + 1);
    id++;
    // start = newDate;
  }
  return date.dateArr;
}

function removeHalfSpace(value) {
  const str = value.split("");
  str.forEach((item, index) => {
    const charCode = item.charCodeAt(0);
    if (charCode === 32 || charCode === 8204) {
      str[index] = " ";
    }
  });
  value = str.join("");
  return value;
}
