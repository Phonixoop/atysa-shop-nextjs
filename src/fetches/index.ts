export const BASE_URL = "http://localhost:3000";
export const getProducts = async () =>
  await (await fetch(`${BASE_URL}/api/products`)).json();

export const getProductsByCategorySlug = async (key, { slug }) =>
  await (await fetch(`${BASE_URL}/api/products?category=${slug}`)).json();

export const getCategoryBySlug = async (key, slug) =>
  await (await fetch(`${BASE_URL}/api/categories?slug=${key}`)).json();

export const getCategories = async () =>
  await (await fetch(`${BASE_URL}/api/categories`)).json();
