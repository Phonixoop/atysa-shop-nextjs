export const isEmpty = (text: string) =>
  text?.length > 0 ? "" : "این فیلد نباید خالی رها شود";
export const isEnglish = (text: string) =>
  !(text.match(/^[a-zA-Z0-9-]+$/) === null)
    ? ""
    : "فقط عدد و حروف انگلیسی مجاز است";
