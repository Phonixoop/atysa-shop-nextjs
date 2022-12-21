import {
  createOrder,
  getOrders,
  getUserOrders,
  getOrdersByUserId,
  getOrdersByStatus,
  updateOrderStatus,
} from "./order";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  getProductsByCategorySlug,
  updateProduct,
} from "./product";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
} from "./category";

import {
  getUser,
  updateUser,
  createAddress,
  updateSingleAddress,
  deleteSingleAddress,
} from "./user";

import { deleteFileById, getUploads, uploadFile } from "./file";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Request {
  fullUrl?: string;
  headers?: {};
  url?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
}
export default async function request({
  fullUrl = "",
  url = "",
  headers = {},
  method = "GET",
  body = undefined,
}: Request) {
  const finalUrl = fullUrl.length > 0 ? fullUrl : `${BASE_URL}/api/${url}`;

  const response = await fetch(finalUrl, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();
  return result;
}

export {
  // product
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  getProductsByCategorySlug,
  updateProduct,
  // category
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  // file
  deleteFileById,
  getUploads,
  uploadFile,
  // order
  createOrder,
  getOrders,
  getUserOrders,
  getOrdersByUserId,
  getOrdersByStatus,
  updateOrderStatus,
  // user
  getUser,
  updateUser,
  createAddress,
  updateSingleAddress,
  deleteSingleAddress,
};
