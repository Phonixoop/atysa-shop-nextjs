export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

export function uploadFile({
  file,
  onProgress = () => {},
}: {
  file: any;
  onProgress: (percentage: number) => void;
}) {
  const url = `${BASE_URL}/api/upload`;

  return new Promise<string>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.onload = (result) => {
      const { response }: any = result.target;
      res(JSON.parse(response));
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

    xhr.send(formData);
  });
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

export async function getUploads() {
  return await request(`upload`);
}

export async function deleteFileById({ id }) {
  return await request(`upload/${id}`, "DELETE");
}
