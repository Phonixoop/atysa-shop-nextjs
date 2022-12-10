import request from "api";
//#region product

export async function getUser() {
  return await request({ url: `users/me` });
}
export async function updateUser({ user }) {
  return await request({ method: "PUT", url: `users/me`, body: user });
}

export async function updateSingleAddress({ address }) {
  return await request({
    method: "PUT",
    url: `users/me/address`,
    body: {
      address,
    },
  });
}

//#endregion
