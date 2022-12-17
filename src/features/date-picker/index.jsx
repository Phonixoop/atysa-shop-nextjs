import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import moment from "jalali-moment";

import { intersection } from "utils";

import ClockIcon from "ui/icons/clocks";

import { useBasket } from "context/basketContext";

import { deliverTimes } from "data";

export default function DatePickerView({ onChange = () => {} }) {
  return (
    <div className="flex flex-col">
      {/* {JSON.stringify(
        basketItems.map((a) => a.product.deliver_period),
        null,
        2
      )} */}

      <DatePicker onChange={onChange} />
    </div>
  );
}

function DatePicker({ onChange = () => {} }) {
  const {
    getDateTimeRange,
    selectedDateTime,
    setSelectedDateTime,
    isTimePassed,
    reCalculateDateTime,
  } = useBasket();
  const weekRange = getDateTimeRange();

  console.log({ selectedDateTime });
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
                    selectedDateTime.day && selectedDateTime?.day.id === day.id
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
            {true ? (
              <div
                key={
                  selectedDateTime.day.id ? selectedDateTime.day.id : "empty"
                }
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <div className="flex flex-col gap-5 justify-evenly items-center  p-3 w-full  rounded-b-xl overflow-x-auto scrollbar-none">
                  {deliverTimes.map((time) => {
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
            ) : (
              <div className="w-full flex justify-center items-center py-5">
                <span className="text-gray-500 font-bold">
                  محصولی انتخاب نشده است
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <DateTimeInText date={selectedDateTime} />
    </>
  );
}

function DateTimeInText({ date = {} }) {
  return (
    <div
      dir="rtl"
      className="flex flex-col gap-[5px] justify-center rounded-2xl items-stretch w-full mx-auto select-none p-4 "
    >
      <p className="min-h-[2rem]">
        {date.day.dayName && date.time.period.value && (
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
