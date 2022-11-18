import request from "api";

//#region cateory
export async function getCategories() {
  return await request({ url: "categories" });
}

export async function getCategoryBySlug(slug: string) {
  return await request({ url: `categories/slug/${slug}` });
}

export async function getCategoryById(id: string) {
  return await request({ url: `categories/${id}` });
}

export async function updateCategory({ id, category }) {
  return await request({
    url: `categories/${id}`,
    method: "PUT",
    body: category,
  });
}

export async function createCategory({ category }) {
  return await request({ url: `categories`, method: "POST", body: category });
}

export async function deleteCategory({ id }) {
  return await request({ url: `categories/${id}`, method: "DELETE" });
}
//#endregion
