export function withSuccess({ data = {}, message = "" }) {
  return {
    error: false,
    message,
    data: {
      ...data,
    },
  };
}
export function withError({ data = {}, message = "" }) {
  return {
    error: true,
    message,
    data: {
      ...data,
    },
  };
}
