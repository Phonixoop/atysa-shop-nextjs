import request from "api";

export async function createOrder({
  user,
  basket_items,
  tax,
  has_coupon = false,
  coupon_code = undefined,
  coupon_discount = undefined,
  total_price,
}) {
  return request({
    url: "orders",
    method: "POST",
    body: {
      user,
      basket_items,
      tax,
      has_coupon,
      coupon_code,
      coupon_discount,
      total_price,
    },
  });
}

export function getOrders() {
  return request({
    url: "orders",
  });
}
