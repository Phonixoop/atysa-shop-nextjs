import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import moment from "jalali-moment";
import { DAYS } from "data";
import ClockIcon from "ui/icons/clocks";
import RadioBox from "../../ui/forms/radiobox/index";
import { intersection } from "utils";
import { useBasket } from "context/basketContext";
const Days = Object.values(DAYS).reverse();

const times = [
  {
    name: "صبحانه",
    periods: [
      {
        value: "8-9",
        passed: false,
      },
      {
        value: "9-10",
        passed: false,
      },
      {
        value: "10-11",
        passed: false,
      },
      {
        value: "11-12",
        passed: false,
      },
    ],
    rotate: "-rotate-180",
  },
  {
    name: "ناهار",
    periods: [
      {
        value: "12-13",
        passed: false,
      },
      {
        value: "13-14",
        passed: false,
      },
      {
        value: "14-15",
        passed: false,
      },
      {
        value: "15-16",
        passed: false,
      },
    ],
    rotate: "",
  },
  {
    name: "شام",
    periods: [
      {
        value: "16-17",
        passed: false,
      },
      {
        value: "17-18",
        passed: false,
      },

      {
        value: "19-20",
        passed: false,
      },

      {
        value: "20-21",
        passed: false,
      },
    ],
    rotate: "rotate-[70deg]",
  },
];

export default function DatePickerView() {
  const { basketItems } = useBasket();
  return (
    <div className="flex flex-col">
      {/* {JSON.stringify(
        basketItems.map((a) => a.product.deliver_period),
        null,
        2
      )} */}

      <DatePicker products={basketItems.map((a) => a.product)} />
    </div>
  );
}

function DatePicker({ products }) {
  const [basketProducts, setBasketProducts] = useState(products);
  const [weekRange, setWeekRange] = useState(getRange(basketProducts));

  const isTimePassed = (periodValue, dayName) =>
    new Date().getHours() >= periodValue.split("-")[1] &&
    weekRange.today.dayName === dayName;

  const firstDateTimeAvailable = weekRange.dates.map((date) => {
    if (!date.isDayAvailable) return;

    const peroidsValue = date.times.flatMap((time) =>
      time.periods.map((period) => period.value)
    );
    const latestAvailableTime = peroidsValue.find((value) => {
      if (!isTimePassed(value, date.dayName)) return value;
    });
    return latestAvailableTime
      ? {
          time: latestAvailableTime,
          date: date,
        }
      : undefined;
  });
  const [selectedDateTime, setSelectedDateTime] = useState({
    day: firstDateTimeAvailable[firstDateTimeAvailable.length - 1].date,
    time: {
      name: "",
      period: {
        key: "",
        value: firstDateTimeAvailable[firstDateTimeAvailable.length - 1].time,
        passed: false,
      },
    },
  });

  return (
    <>
      <div
        dir="rtl"
        className="flex flex-col gap-[5px] justify-center rounded-2xl items-stretchselect-none  "
      >
        <div className="flex gap-5 justify-around bg-gray-50/50 p-5 border-b-2 rounded-t-xl w-full overflow-x-auto scrollbar-none">
          {weekRange.dates.map((day) => {
            return (
              <>
                <button
                  key={day.dayName}
                  type="button"
                  onClick={() => {
                    if (!day.isDayAvailable) return;

                    const time = isTimePassed(
                      selectedDateTime.time.period.value,
                      day.dayName
                    )
                      ? {
                          name: "",
                          period: {
                            passed: true,
                            value: "",
                          },
                        }
                      : selectedDateTime.time;

                    setSelectedDateTime((prev) => {
                      return {
                        ...prev,
                        day,
                        time,
                      };
                    });
                  }}
                  className={`flex flex-col p-1 rounded min-w-[5rem] md:first:mr-0 first:mr-[10rem]  text-center items-center  transition-all
                  ${
                    selectedDateTime.day.id === day.id
                      ? " shadow-2xl shadow-gray-400/70  font-bold text-atysa-main scale-110 ring-2 ring-atysa-main  "
                      : ""
                  }
                   ${
                     !day.isDayAvailable
                       ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                       : "cursor-pointer"
                   }`}
                >
                  <span className="text-xs bg-inherit text-inherit text-center rounded-full ">
                    {day.date}
                  </span>
                  <span>{day.dayName}</span>
                </button>
              </>
            );
          })}
        </div>
        <div className=" bg-gray-50/50 rounded-b-xl ">
          <AnimatePresence exitBeforeEnter>
            <div
              key={selectedDateTime.day.id ? selectedDateTime.day.id : "empty"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <div className="flex flex-col gap-5 justify-evenly items-center  p-3 w-full  rounded-b-xl overflow-x-auto scrollbar-none">
                {selectedDateTime.day.times.map((time) => {
                  return (
                    <div
                      key={time.name}
                      className="flex justify-center items-center gap-12 p-3 w-full"
                    >
                      <div
                        className={`relative hidden md:flex justify-center items-center gap-2 transition-transform ${
                          selectedDateTime.time.name === time.name
                            ? "text-atysa-main fill-atysa-main font-bold  -translate-x-2"
                            : "font-thin"
                        }`}
                      >
                        {selectedDateTime.time.name === time.name && (
                          <div className="absolute left-[70px] rounded-full w-full h-[1.5px] bg-atysa-main"></div>
                        )}

                        <ClockIcon
                          className={`w-4 h-4 fill-inherit ${time.rotate}`}
                        />
                        <span className="flex text-inherit  w-10">
                          {time.name}
                        </span>
                      </div>
                      <div className="flex gap-5 justify-start items-center w-full">
                        {time.periods.map((period) => {
                          const timePassed =
                            new Date().getHours() >=
                              period.value.split("-")[1] &&
                            weekRange.today.dayName ===
                              selectedDateTime.day.dayName;

                          return (
                            <>
                              <button
                                key={period.key}
                                type="button"
                                onClick={() => {
                                  if (timePassed) return;

                                  setSelectedDateTime((prev) => {
                                    return {
                                      ...prev,
                                      time: {
                                        ...prev.time,
                                        name: time.name,
                                        period: {
                                          key:
                                            selectedDateTime.day.dayName +
                                            period.value,
                                          value: period.value,

                                          passes: timePassed,
                                        },
                                      },
                                    };
                                  });
                                }}
                                className={`p-2 flex-grow rounded max-w-[10rem] text-center cursor-pointer transition-all
                            ${
                              timePassed
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "cursor-pointer"
                            }
                            ${
                              selectedDateTime.time.period.value ===
                              period.value
                                ? "shadow-lg ring-2 ring-atysa-main font-bold text-atysa-main scale-110"
                                : "shadow-inner  shadow-gray-200"
                            }
                            `}
                              >
                                {period.value}
                              </button>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatePresence>
        </div>
      </div>
      <DateTimeInText date={selectedDateTime} />

      {/* <button onClick={() => console.log(weekRange)}>get range</button> */}
      {/* <div className="">
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
          </div> */}
    </>
  );

  function getRange(products) {
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
    const deliver_periods = [
      ...products.map((product) => product.deliver_period),
    ];
    const newDeliver_periods = deliver_periods.map((period) => {
      // convert english day name to persian
      const newPeriod = {
        ...period,
        availableDaysOfWeek: period.availableDaysOfWeek.map((dayEnglishName) =>
          removeHalfSpace(
            moment().day(dayEnglishName).locale("fa").format("dddd")
          )
        ),
      };
      console.log({ newPeriod });
      const delay = newPeriod.delay;
      if (delay <= 0) return newPeriod;
      const dayNameWithDelay = removeHalfSpace(
        moment().locale("fa").add(delay, "hours").format("dddd")
      );
      const availableDaysOfWeek = newPeriod.availableDaysOfWeek.filter(
        (day) => day !== dayNameWithDelay
      );

      return {
        ...newPeriod,
        availableDaysOfWeek,
      };
    });

    console.log(JSON.stringify(newDeliver_periods, null, 2));
    const beforeReady = intersection(
      newDeliver_periods.map((a) => a.availableDaysOfWeek)
    );

    console.log({ beforeReady });

    // const productTimePeriods = products.map((a) => a.deliver_period.timePeriod);
    // const rangeNumbers = productTimePeriods.map((a) => {
    //   return getRangeNumbers(a.startHour, a.endHour);
    // });
    // console.log({ rangeNumbers });
    // const timePeriodRange = rangeNumbers.reduce(
    //   (prevArr, currArr) => {
    //     const res = intersection(prevArr, currArr);
    //     if (res.length > 0) return res;
    //     return prevArr;
    //   },
    //   rangeNumbers.length > 1 ? rangeNumbers[1] : rangeNumbers[0]
    // );

    // const timePeriod = {
    //   startHour: Math.min(...timePeriodRange),
    //   endHour: Math.max(...timePeriodRange),
    // };

    // const timePeriods = getRangeWithGap(
    //   timePeriod.startHour,
    //   timePeriod.endHour,
    //   1
    // );

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
        times: times.map((time) => {
          const periods = time.periods.map((period) => {
            return {
              ...period,
              key: dayName + " " + period.value,
            };
          });

          return { ...time, periods };
        }),
      };

      date.dateArr.push(result);

      var newDate = start.setDate(start.getDate() + 1);
      id++;
      // start = newDate;
    }

    const value = moment().locale("fa");

    const dayNumber = value.format("D");
    const dayName = removeHalfSpace(value.format("dddd"));
    const dateWithDayAndMonth = value.format("DD MMMM");
    console.log({ times });
    return {
      dates: date.dateArr,
      today: {
        dayNumber,
        dayName,
        dateWithDayAndMonth,
      },
    };
  }
}

function DateTimeInText({ date = {} }) {
  return (
    <div
      dir="rtl"
      className="flex flex-col gap-[5px] justify-center rounded-2xl items-stretch w-full mx-auto select-none p-4 "
    >
      <p className="min-h-[2rem]">
        {date.day && date.time.period.value && (
          <>
            <span> محصول در تاریخ </span>
            <span className="font-bold">{date.day.dayName} </span>
            <span className="font-bold">{date.day.date}</span>
            <span> بین ساعت </span>
            <span className="font-bold">
              {date.time.period.value.split("-")[0]}
            </span>
            <span className="font-bold"> تا </span>
            <span className="font-bold">
              {date.time.period.value.split("-")[1]}
            </span>
            <span> به دست شما می رسد </span>
          </>
        )}
      </p>
    </div>
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

// function intersection(x, y) {
//   x.sort();
//   y.sort();
//   let i = 0;
//   let j = 0;
//   let ret = [];
//   while (i < x.length && j < y.length) {
//     if (x[i] < y[j]) i++;
//     else if (y[j] < x[i]) j++;
//     else {
//       ret.push(x[i]);
//       i++, j++;
//     }
//   }
//   return ret;
// }

function getAvalibaleDay(delay) {
  removeHalfSpace(moment().add(delay, "hours").format("dddd"));
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
  if (value === "چهارشنبه") return "چهار شنبه";
  if (value === "دوشنبه") return "دو شنبه";
  return value;
}
