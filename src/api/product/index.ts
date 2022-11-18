import request from "api";
//#region product
export async function getProducts() {
  return await request({ url: "products" });
}
export async function getProductBySlug(slug: string) {
  return await request({ url: `products/slug/${slug}` });
}
export async function getProductById(id: string) {
  return await request({ url: `products/${id}` });
}

export async function updateProduct({ id, product }) {
  return await request({ url: `products/${id}`, method: "PUT", body: product });
}

export async function createProduct({ id, product }) {
  return await request({ url: `products`, method: "POST", body: product });
}

export async function deleteProduct({ id }) {
  return await request({ url: `products/${id}`, method: "DELETE" });
}

export async function getProductsByCategorySlug(slug: string) {
  return await request({ url: `products/category/${slug}` });
}
//#endregion
