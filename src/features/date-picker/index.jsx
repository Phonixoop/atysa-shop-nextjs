import { AnimatePresence, motion } from "framer-motion";
import { useBasket } from "context/basketContext";

// icons
import ClockIcon from "ui/icons/clocks";

import { deliverTimes } from "data";

//ui
import Button from "ui/buttons";

export default function DatePickerView({
  onChange = () => {},
  onSubmit = () => {},
}) {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* {JSON.stringify(
        basketItems.map((a) => a.product.deliver_period),
        null,
        2
      )} */}

      <DatePicker onChange={onChange} />
      <div className="flex w-full items-center justify-center">
        <Button
          className="flex w-11/12 bg-atysa-main text-white md:hidden"
          onClick={onSubmit}
        >
          ثبت
        </Button>
      </div>
    </div>
  );
}

function DatePicker({ onChange = () => {} }) {
  const {
    basketItems,
    getDateTimeRange,
    selectedDateTime,
    setSelectedDateTime,
    isTimePassed,
  } = useBasket();
  const weekRange = getDateTimeRange;

  return (
    <>
      <div
        dir="rtl"
        className="flex w-full flex-grow select-none flex-col items-stretch justify-center gap-[5px] overflow-hidden rounded-2xl"
      >
        <div className="pb-15 flex w-full flex-nowrap items-center gap-5 overflow-hidden overflow-x-auto bg-white p-5 scrollbar-none md:max-w-3xl  md:flex-wrap md:justify-center ">
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
                      day.fullDate
                    )
                      ? {
                          name: "",
                          period: {
                            ...selectedDateTime.time.period,
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
                  className={`flex min-w-[5rem] flex-col items-center  rounded   p-1  text-center
                  transition-all
                  ${
                    selectedDateTime.day && selectedDateTime?.day.id === day.id
                      ? " scale-110 font-bold  text-atysa-main shadow-2xl shadow-gray-400/70 ring-2 ring-atysa-main  "
                      : ""
                  }
                   ${
                     !day.isDayAvailable
                       ? "cursor-not-allowed bg-gray-200 text-gray-500"
                       : "cursor-pointer"
                   }`}
                >
                  {/* weekday box inside button */}
                  <span className="rounded-full bg-inherit text-center text-[7px] text-inherit ">
                    {day.year}
                  </span>
                  <span className="rounded-full bg-inherit text-center text-xs text-inherit ">
                    {day.date}
                  </span>
                  <span>{day.dayName}</span>
                  {/* weekday box end */}
                </button>
              </>
            );
          })}
        </div>
        <div className="flex w-full items-center justify-center  rounded-b-xl bg-gray-50/50 md:block ">
          <AnimatePresence exitBeforeEnter>
            {basketItems.length > 0 ? (
              <div
                key={
                  selectedDateTime.day.id ? selectedDateTime.day.id : "empty"
                }
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <div className="flex w-full flex-grow flex-col items-center  justify-evenly gap-5 rounded-b-xl  p-3  scrollbar-none">
                  {(selectedDateTime.day.times.length <= 0
                    ? deliverTimes
                    : selectedDateTime.day.times
                  ).map((time) => {
                    return (
                      <div
                        key={time.name}
                        className="flex w-full items-center  justify-center gap-12 p-3"
                      >
                        <div
                          className={`relative hidden items-center justify-center gap-2 transition-transform md:flex ${
                            selectedDateTime.time.name === time.name
                              ? "-translate-x-2 fill-atysa-main font-bold  text-atysa-main"
                              : "font-thin"
                          }`}
                        >
                          {selectedDateTime.time.name === time.name && (
                            <div className="absolute left-[70px] h-[1.5px] w-full rounded-full bg-atysa-main"></div>
                          )}

                          <ClockIcon
                            className={`h-4 w-4 fill-inherit ${time.rotate}`}
                          />
                          <span className="flex w-10  text-inherit">
                            {time.name}
                          </span>
                        </div>
                        <div className="flex w-full items-center justify-start gap-5">
                          {time.periods.map((period) => {
                            const timePassed = isTimePassed(
                              selectedDateTime.time.period.value,
                              selectedDateTime.day.fullDate
                            );

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
                                          period,
                                        },
                                      };
                                    });
                                  }}
                                  className={`min-w-[4rem] max-w-[10rem] cursor-pointer rounded p-2 text-center transition-all md:flex-grow
                            ${
                              timePassed
                                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                                : "cursor-pointer"
                            }
                            ${
                              selectedDateTime.time.period.value ===
                              period.value
                                ? "scale-110 font-bold text-atysa-main shadow-lg ring-2 ring-atysa-main"
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
              <div className="flex w-full items-center justify-center py-5">
                <span className="font-bold text-gray-500">
                  محصولی انتخاب نشده است
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {basketItems.length > 0 && <DateTimeInText date={selectedDateTime} />}
    </>
  );
}

function DateTimeInText({ date = {} }) {
  return (
    <div
      dir="rtl"
      className="mx-auto flex w-full select-none flex-col items-stretch justify-center gap-[5px] rounded-2xl p-4 "
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
