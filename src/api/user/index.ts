import request from "api";
//#region product

export async function getUser() {
  return await request({ url: `users/me` });
}
export async function updateUser({ user }) {
  return await request({ method: "PUT", url: `users/me`, body: user });
}

export async function createAddress({ address }) {
  return await request({
    method: "POST",
    url: `users/me/address`,
    body: {
      address,
    },
  });
}

export async function updateSingleAddress({ id, address }) {
  return await request({
    method: "PUT",
    url: `users/me/address/${id}`,
    body: {
      address,
    },
  });
}

export async function deleteSingleAddress({ id }) {
  return await request({
    method: "DELETE",
    url: `users/me/address/${id}`,
  });
}

//#endregion
