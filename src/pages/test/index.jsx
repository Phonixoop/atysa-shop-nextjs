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
      availableDaysOfWeek: ["شنبه", "سه شنبه", "جمعه", "یک شنبه"],
      delay: 0,
      timePeriod: {
        startHour: 12,
        endHour: 16,
      },
    },
  },
  {
    id: 1,
    name: "potato",
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
        startHour: 8,
        endHour: 21,
      },
    },
  },
  {
    id: 2,
    name: "meat",
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
        startHour: 18,
        endHour: 21,
      },
    },
  },
];

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
  const [selectedDateTime, setSelectedDateTime] = useState("");
  return (
    <>
      <div
        dir="rtl"
        className="flex flex-col gap-2 justify-center items-center w-full mx-auto select-none"
      >
        <button onClick={() => console.log(weekRange)}>get range</button>

        <div className="">
          <ul className="flex gap-2 ">
            {weekRange.map((item) => (
              <DayCol
                key={item.id}
                timePeriods={item.timePeriods}
                isDayAvailable={item.isDayAvailable}
                onChange={(value) => setSelectedDateTime(value)}
              >
                <div className="flex flex-col ">
                  <span className="text-xs  bg-inherit text-inherit text-center rounded-full ">
                    {item.date}
                  </span>
                  <span>{item.dayName}</span>
                </div>
              </DayCol>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function DayCol({
  children,
  dayTimesPeriod = [],
  timePeriods = [],
  isDayAvailable = false,
  onChange = () => {},
}) {
  const [deliver_period, setDeliver_period] = useState(
    products[0].deliver_period
  );
  return (
    <div className="relative flex flex-col gap-5 ">
      {!isDayAvailable && (
        <div className="absolute inset-0 bg-gray-200/70 z-50 rounded-lg"></div>
      )}

      <li
        className={`min-w-[70px] relative  py-2 text-center ${
          isDayAvailable ? "font-bold" : ""
        }`}
      >
        {children}
      </li>

      {isDayAvailable && (
        <div
          dir="rtl"
          className="flex flex-row-reverse justify-center items-center gap-2 "
          onClick={() => onChange()}
        >
          <span className="flex flex-col w-16 gap-2 text-center justify-center items-center  p-1 rounded-lg cursor-pointer">
            {timePeriods.map((hour) => {
              return (
                <span className="w-16 rounded-md bg-gray-300">{hour}</span>
              );
            })}
          </span>
        </div>
      )}
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
  const arraysOfFilterArrays = [
    ...products.map((a) => a.deliver_period.availableDaysOfWeek),
  ];

  const beforeReady = arraysOfFilterArrays.reduce((a, b) =>
    a.filter((a) => b.some((second) => a === second))
  );

  const productTimePeriods = products.map((a) => a.deliver_period.timePeriod);
  const rangeNumbers = productTimePeriods.map((a) => {
    return getRangeNumbers(a.startHour, a.endHour);
  });
  console.log({ rangeNumbers });
  const timePeriodRange = rangeNumbers.reduce(
    (prevArr, currArr) => {
      const res = intersection(prevArr, currArr);
      if (res.length > 0) return res;
      return prevArr;
    },
    rangeNumbers.length > 1 ? rangeNumbers[1] : rangeNumbers[0]
  );

  const timePeriod = {
    startHour: Math.min(...timePeriodRange),
    endHour: Math.max(...timePeriodRange),
  };

  const timePeriods = getRangeWithGap(
    timePeriod.startHour,
    timePeriod.endHour,
    1
  );

  console.log({ timePeriod });

  let id = 0;
  while (start < end) {
    const value = moment(start).locale("fa");

    const dayNumber = value.format("D");
    const dayName = removeHalfSpace(value.format("dddd"));
    const dateWithDayAndMonth = value.format("DD MMMM");

    const isDayAvailable = beforeReady.some((a) => a === dayName);

    const result = {
      id,
      dayNumber,
      dayName,
      date: dateWithDayAndMonth,
      isDayAvailable,
      timePeriods,
    };

    date.dateArr.push(result);

    var newDate = start.setDate(start.getDate() + 1);
    id++;
    // start = newDate;
  }
  return date.dateArr;
}

const getRangeWithGap = (start, end, step = 1) => {
  let output = [];
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  for (let i = start; i <= end; i += step) {
    output.push(i);
  }
  return output;
};

const getRangeNumbers = (start, end) =>
  Array.from({ length: end + 1 - start }, (v, k) => k + start);

function intersection(x, y) {
  x.sort();
  y.sort();
  let i = 0;
  let j = 0;
  let ret = [];
  while (i < x.length && j < y.length) {
    if (x[i] < y[j]) i++;
    else if (y[j] < x[i]) j++;
    else {
      ret.push(x[i]);
      i++, j++;
    }
  }
  return ret;
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
