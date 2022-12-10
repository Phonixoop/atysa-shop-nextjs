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

import { getUser, updateUser, updateSingleAddress } from "./user";

import { deleteFileById, getUploads, uploadFile } from "./file";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Request {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
}
export default async function request({
  url = "",
  method = "GET",
  body = undefined,
}: Request) {
  const response = await fetch(`${BASE_URL}/api/${url}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
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
  updateSingleAddress,
};
