import request from "api";

export async function createOrder({
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

export function getOrdersByUserId({ id }) {
  console.log("sadasd");
  return request({
    url: `orders/user/${id}`,
  });
}

export function getOrdersByStatus({ status }) {
  return request({
    url: `orders/status/${status}`,
  });
}
