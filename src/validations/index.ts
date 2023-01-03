export const isEmpty = (text: string) =>
  text?.length > 0 ? "" : "این فیلد نباید خالی رها شود";

export const isEnglish = (text: string) =>
  !(text?.match(/^[a-zA-Z0-9-]+$/) === null)
    ? ""
    : "فقط عدد و حروف انگلیسی مجاز است";

export const isPhoneNumber = (text) =>
  text?.startsWith("09") ? "" : "شماره باید با 09 آغاز شود";

export const isPhoneNumberOrEmpty = (text) =>
  text?.startsWith("09") || text?.length <= 0
    ? ""
    : "شماره باید با 09 آغاز شود";

export const isElevenNumber = (text) =>
  text?.length === 11 ? "" : "شماره باید 11 رقم باشد";

export const isElevenNumberOrEmpty = (text) =>
  text.length === 0 || text.length === 11 ? "" : "شماره باید 11 رقم باشد";
