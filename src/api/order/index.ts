import request from "api";

export async function createOrder({ user, basket_items }) {
  return request({
    url: "orders",
    method: "POST",
    body: {
      user,
      basket_items,
    },
  });
}

export function getOrders() {
  return request({
    url: "orders",
  });
}
