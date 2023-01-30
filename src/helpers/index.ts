export function withSuccess({
  data = {},
  message,
}: {
  data?: {};
  message?: any;
}) {
  return {
    error: false,
    message,
    data: {
      ...data,
    },
  };
}
export function withError({ data = {}, message }: { data?: {}; message: any }) {
  return {
    error: true,
    message,
    data: {
      ...data,
    },
  };
}
