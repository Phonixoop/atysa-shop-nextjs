export const ORDER_STATUS = {
  PURCHASED_AND_PENDING: "در انتظار تایید",
  PURCHAS_ROLLED_BACK: "بازگشت وجه",
  ACCEPTED: "سفارش تایید شده",
  ADMIN_REJECTED: "لغو شده توسط ادمین",
  USER_REJECTED: "لغو شده توسط کاربر",
  COOKING: "در حال طبخ",
  SENDING: "در حال ارسال",
  RECIVED: "تحویل داده شده",
};

export const DAYS = {
  Saturday: "شنبه",
  Sunday: "یک شنبه",
  Monday: "دو شنبه",
  Tuesday: "سه شنبه",
  Wednesday: "چهار شنبه",
  Thursday: "پنج شنبه",
  Friday: "جمعه",
};

export const GENDERS = [
  {
    id: "MALE",
    value: "مرد",
  },
  {
    id: "FEMALE",
    value: "زن",
  },
  {
    id: "OTHER",
    value: "دیگر",
  },
];

// const array = [
//   {
//     id: 0,
//     status: {
//       key: "ALL",
//       value: "همه",
//     },
//   },
//   {
//     id: 1,
//     status: {
//       key: "PURCHAS_ROLLED_BACK",
//       value: "خریده شده و منتظر",
//     },
//   },
//   {
//     id: 1,
//     status: {
//       key: "PURCHAS_ROLLED_BACK",
//       value: "خریده شده و منتظر",
//     },
//   },
//   {
//     id: 2,
//     status: {
//       key: "ACCEPTED",
//       value: "خریده شده و منتظر",
//     },
//   },
//   {
//     id: 3,
//     status: {
//       key: "ADMIN_REJECTED",
//       value: "قبول سفارش",
//     },
//   },
//   {
//     id: 4,
//     status: {
//       key: "ADMIN_REJECTED",
//       value: "لغو سفارش توسط ادمین",
//     },
//   },
//   {
//     id: 5,
//     status: {
//       key: "USER_REJECTED",
//       value: "لغو سفارش توسط کاربر",
//     },
//   },
//   {
//     id: 6,
//     status: {
//       key: "COOKING",
//       value: "در حال پخت",
//     },
//   },
//   {
//     id: 7,
//     status: {
//       key: "SENDING",
//       value: "در حال ارسال",
//     },
//   },
//   {
//     id: 8,
//     status: {
//       key: "RECIVED",
//       value: "تحویل داده شده",
//     },
//   },
// ];
// export const ORDER_STATUS = [
//   { id: 0, ALL: "همه" },
//   { id: 1, PURCHASED_AND_PENDING: "خریده شده و منتظر" },
//   { id: 2, PURCHAS_ROLLED_BACK: "بازگشت وجه" },
//   { id: 3, ACCEPTED: "قبول سفارش" },
//   { id: 4, ADMIN_REJECTED: "لغو سفارش توسط ادمین" },
//   { id: 5, USER_REJECTED: "لغو سفارش توسط کاربر" },
//   { id: 6, COOKING: "در حال پخت" },
//   { id: 7, SENDING: "در حال ارسال" },
//   { id: 8, RECIVED: "تحویل داده شده" },
// ];

// enum OrderStatus {
//   PURCHASED_AND_PENDING,
//   PURCHAS_ROLLED_BACK,
//   ACCEPTED,
//   ADMIN_REJECTED,
//   USER_REJECTED,
//   COOKING,
//   SENDING,
//   RECIVED,
// }

// export const ORDER_STATUS = new Map<string, string>();
// ORDER_STATUS.set("PURCHASED_AND_PENDING", "خریده شده و منتظر");
// ORDER_STATUS.set("PURCHAS_ROLLED_BACK", "بازگشت وجه");
// ORDER_STATUS.set("ACCEPTED", "قبول سفارش");
// ORDER_STATUS.set("ADMIN_REJECTED", "لغو سفارش توسط ادمین");
// ORDER_STATUS.set("USER_REJECTED", "لغو سفارش توسط کاربر");
// ORDER_STATUS.set("COOKING", "در حال پخت");
// ORDER_STATUS.set("SENDING", "در حال ارسال");
// ORDER_STATUS.set("RECIVED", "تحویل داده شده");
// ORDER_STATUS.("RECIVED")
