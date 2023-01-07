import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import moment from "jalali-moment";
import { intersection, fixPersianWeekDayName } from "utils";
import { deliverTimes, DAYS } from "data";
// import { ShoppingBasket } from "../components/ShoppingBasket"
// import useLocalStorage from "src/hooks/useLocalStorage";

type BasketProviderProps = {
  children: ReactNode;
};

type BasketItem = {
  id: number;
  quantity: number;
  product: any;
};

type BasketContext = {
  getItemQuantity: (id: number) => number;
  increaseBasketQuantity: (id: number, product: any) => void;
  decreaseBasketQuantity: (id: number) => void;
  removeFromBasket: (id: number) => void;
  clearBasket: () => void;
  basketQuantity: number;
  basketItems: BasketItem[];
  getDateTimeRange: any;
  setSelectedDateTime: any;
  selectedDateTime: any;
  fastestDateTime: any;
  currentSelectedDateTime: any;
  selectedDateTimeRadioBox: any;
  setSelectedDateTimeRadioBox: any;
  selectedDateTimeStringFormat: string;
  selectedDateStringFormat: string;
  selectedWindowDateTime: string | undefined;
  setToFastestDateTime: () => void;
  isTimePassed(periodValue: string, dayName: string): boolean;
};

const BasketContext = createContext({} as BasketContext);

const defualtDay = {
  id: -1,
  dayNumber: -1,
  dayName: "",
  isDayAvailable: true,
  times: [],
};

export function useBasket() {
  return useContext(BasketContext);
}
export function BasketProvider({ children }: BasketProviderProps) {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);

  const getDateTimeRange = getRange(basketItems.map((a) => a.product));

  const isTimePassed = (periodValue: any, dayName: string) =>
    new Date().getHours() >= parseInt(periodValue?.split("-")[1]) &&
    getDateTimeRange.today.dayName === dayName;

  const getFirstDateTimeAvailable = () =>
    getDateTimeRange.dates.map((date: any) => {
      if (!date.isDayAvailable) return;

      const peroids = date.times.flatMap((time: any) => time.periods);

      const latestAvailableTime = peroids.find((period: any) => {
        if (!isTimePassed(period.value, date.dayName)) return period;
      });
      return latestAvailableTime
        ? {
            time: latestAvailableTime,
            date,
          }
        : undefined;
    });

  const soonestDateTime = getFirstDateTimeAvailable();

  const getInitialDateTime = ({ withSoonest = true }) => {
    const soonestDate =
      soonestDateTime.find((a: any) => a !== undefined)?.date || defualtDay;
    const soonestTime =
      soonestDateTime.find((a: any) => a !== undefined)?.time?.value ||
      undefined;
    return {
      day: withSoonest ? soonestDate : defualtDay,
      time: {
        name: "",
        period: {
          key: "",
          value: withSoonest ? soonestTime : undefined,
          passed: false,
        },
      },
    };
  };
  const [selectedDateTime, setSelectedDateTime] = useState(() =>
    getInitialDateTime({ withSoonest: true })
  );
  const [fastestDateTime, setFastestDateTime] = useState(() =>
    getInitialDateTime({ withSoonest: true })
  );
  const [selectedDateTimeRadioBox, setSelectedDateTimeRadioBox] = useState({
    id: 0,
  });

  const currentSelectedDateTime =
    selectedDateTimeRadioBox.id === 0 ? fastestDateTime : selectedDateTime;

  const isSelected =
    currentSelectedDateTime.day.dayName &&
    currentSelectedDateTime.time.period.value;

  const selectedWindowDateTime = isSelected
    ? currentSelectedDateTime.time.period.key
    : undefined;

  const selectedDateTimeStringFormat = isSelected
    ? `${currentSelectedDateTime.day.dayName} ${
        currentSelectedDateTime.day.date
      }
       ${currentSelectedDateTime.time.period.value.split("-")[0]}
       ${" تا "}
       ${currentSelectedDateTime.time.period.value.split("-")[1]}`
    : "";

  const selectedDateStringFormat = isSelected
    ? `${currentSelectedDateTime.day.year} ${currentSelectedDateTime.day.dayName} ${currentSelectedDateTime.day.date}`
    : "";

  const basketQuantity = basketItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  function setToFastestDateTime() {
    setSelectedDateTime(fastestDateTime);
  }

  useEffect(() => {
    if (basketItems.length > 0) {
      setFastestDateTime(() => getInitialDateTime({ withSoonest: true }));
    } else {
      setSelectedDateTime(() => getInitialDateTime({ withSoonest: false }));
      setSelectedDateTimeRadioBox({ id: 0 });
    }
  }, [basketItems]);

  function getItemQuantity(id: number) {
    return basketItems.find((item) => item.id === id)?.quantity || 0;
  }

  function increaseBasketQuantity(id: number, product: any) {
    const newItems = () => {
      if (basketItems.find((item) => item.id === id) == null) {
        return [...basketItems, { id, product, quantity: 1 }];
      } else {
        return basketItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    };
    const newBasketItems = newItems();
    setBasketItems(newBasketItems);
    if (product?.deliver_period)
      if (
        !product.deliver_period.availableDaysOfWeek.includes(
          selectedDateTime.day.dayName
        )
      ) {
        setSelectedDateTime(() => getInitialDateTime({ withSoonest: false }));
      }
  }
  function decreaseBasketQuantity(id: number) {
    setBasketItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function removeFromBasket(id: number) {
    setBasketItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  function clearBasket() {
    setBasketItems([]);
    setSelectedDateTime(() => getInitialDateTime({ withSoonest: false }));
  }
  function getRange(products: any) {
    const date: any = {};
    date.dateArr = [];

    date.prevDate = moment().subtract(0, "days");

    date.nextDate = moment().add(7, "days");

    //extracting date from objects in MM-DD-YYYY format
    date.prevDate = moment(date.prevDate._d).format("MM-DD-YYYY");
    date.nextDate = moment(date.nextDate._d).format("MM-DD-YYYY");

    //creating JS date objects
    var start = new Date(date.prevDate);
    var end = new Date(date.nextDate);

    //Logic for getting rest of the dates between two dates("FromDate" to "EndDate")
    const deliver_periods = [
      ...products.map((product: any) => product.deliver_period),
    ];

    const newDeliver_periods = deliver_periods.map((period) => {
      // convert english day name to persian
      const newPeriod = {
        ...period,
        availableDaysOfWeek: period.availableDaysOfWeek.map(
          (dayEnglishName: any) =>
            fixPersianWeekDayName(
              moment().day(dayEnglishName).locale("fa").format("dddd")
            )
        ),
      };

      const delay = newPeriod.delay;
      if (delay <= 0) return newPeriod;

      const dayNameWithDelay = moment().add(delay, "hours").format("dddd");

      const daysBefore = getBeforeDay(dayNameWithDelay).map(
        (dayEnglishName) => {
          return fixPersianWeekDayName(
            moment().day(dayEnglishName).locale("fa").format("dddd")
          );
        }
      );

      const availableDaysOfWeek = newPeriod.availableDaysOfWeek.filter(
        (day: any) => !daysBefore.includes(day)
      );
      console.log({ availableDaysOfWeek });

      return {
        ...newPeriod,
        availableDaysOfWeek,
      };
    });

    // console.log(JSON.stringify(newDeliver_periods, null, 2));
    const beforeReady = intersection(
      newDeliver_periods.map((a) => a.availableDaysOfWeek)
    );

    // console.log({ beforeReady });

    let id = 0;
    while (start < end) {
      const value = moment(start).locale("fa");

      const year = value.format("YYYY");
      const dayNumber = value.format("D");
      const dayName = fixPersianWeekDayName(value.format("dddd"));
      const dateWithDayAndMonth = value.format("D MMMM");

      const isDayAvailable = beforeReady.some((a) => a === dayName);
      const dateKey = value.format("YYYY-MM-DD");
      const result = {
        id,
        key: dateKey,
        dayNumber,
        dayName,
        year,
        date: dateWithDayAndMonth,
        isDayAvailable,
        times: deliverTimes.map((time) => {
          const periods = time.periods.map((period) => {
            return {
              ...period,
              key: {
                start: `${dateKey} ${period.value.split("-")[0]}:00:00`, // YYYY_MM_DD HH:00:00
                end: `${dateKey} ${period.value.split("-")[1]}:00:00`, // YYYY_MM_DD HH:00:00
              },
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
    const dayName = fixPersianWeekDayName(value.format("dddd"));
    const dateWithDayAndMonth = value.format("DD MMMM");

    return {
      dates: date.dateArr,
      today: {
        dayNumber,
        dayName,
        dateWithDayAndMonth,
      },
    };
  }

  return (
    <BasketContext.Provider
      value={{
        getItemQuantity,
        increaseBasketQuantity,
        decreaseBasketQuantity,
        removeFromBasket,
        clearBasket,
        basketItems,
        basketQuantity,
        getDateTimeRange,
        setSelectedDateTime,
        selectedDateTime,
        isTimePassed,
        fastestDateTime,
        setToFastestDateTime,
        currentSelectedDateTime,
        selectedDateTimeRadioBox,
        setSelectedDateTimeRadioBox,
        selectedDateTimeStringFormat,
        selectedDateStringFormat,
        selectedWindowDateTime,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

function getBeforeDay(day) {
  const dayNumber = DaysWithNumber[day];
  const befores = Object.entries(DaysWithNumber).filter(([key, value]) => {
    return value <= dayNumber;
  });

  return befores.map((a) => a[0]);
}

const DaysWithNumber = {
  Saturday: 0,
  Sunday: 1,
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
};
