import request from "api";

export async function createOrder({ data }) {
  return request({
    url: "orders",
    method: "POST",
    body: {
      ...data,
    },
  });
}

export async function getOrders({ pageParam, orderStatuses }) {
  return await request({
    url: `orders?cursor=${pageParam}&orderStatuses=${orderStatuses.join(",")}`,
  });
}

export async function getUserOrders({ pageParam }) {
  return await request({
    url: `users/orders?cursor=${pageParam}`,
  });
}

export function getOrdersByUserId({ id, pageParam }) {
  return request({
    url: `orders/user/${id}?cursor=${pageParam}`,
  });
}

export function getOrdersByStatus({ status }) {
  return request({
    url: `orders/status/${status}`,
  });
}

export function updateOrderStatus({ id, orderStatus }) {
  return request({
    method: "PUT",
    url: `orders/${id}/orderstatus`,
    body: {
      orderStatus,
    },
  });
}
