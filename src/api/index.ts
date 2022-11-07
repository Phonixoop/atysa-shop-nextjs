export const BASE_URL = "http://localhost:3000";

async function request(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body = undefined
) {
  const response = await fetch(`${BASE_URL}/api/${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}

//#region product
export async function getProducts() {
  return await request("products");
}
export async function getProductBySlug(slug: string) {
  return await request(`products/slug/${slug}`);
}
export async function getProductById(id: string) {
  return await request(`products/${id}`);
}

export async function updateProduct({ id, product }) {
  return await request(`products/${id}`, "PUT", product);
}

export async function createProduct({ id, product }) {
  return await request(`products`, "POST", product);
}

export async function deleteProduct({ id }) {
  return await request(`products/${id}`, "DELETE");
}

export async function getProductsByCategorySlug(slug: string) {
  return await request(`products/category/${slug}`);
}
//#endregion

//#region cateory
export async function getCategories() {
  return await request("categories");
}

export async function getCategoryBySlug(slug: string) {
  return await request(`categories/slug/${slug}`);
}

export async function getCategoryById(id: string) {
  return await request(`categories/${id}`);
}

export async function updateCategory({ id, category }) {
  return await request(`categories/${id}`, "PUT", category);
}

export async function createCategory({ category }) {
  return await request(`categories`, "POST", category);
}

export async function deleteCategory({ id }) {
  return await request(`categories/${id}`, "DELETE");
}
//#endregion

export function uploadFile(file, onProgress: (percentage: number) => void) {
  const url = `${BASE_URL}/api/upload`;
  const key = "docs_upload_example_us_preset";

  return new Promise<string>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.onload = () => {
      const resp = JSON.parse(xhr.responseText);
      res(resp);
    };
    xhr.onerror = (evt) => rej(evt);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        onProgress(Math.round(percentage));
      }
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", key);

    xhr.send(formData);
  });
}
