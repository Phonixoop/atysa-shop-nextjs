import dbPromise from "@/modules/db";
import createHandler from "next-connect";
const handler = createHandler();

export async function getProduct({ _id }) {
  const client = await dbPromise;
  const db = await client.db("atysa-shop-nextjs-db");
  return (await db.collection("products").findOne({ _id })) || undefined;
}

export async function getProducts({ filter }) {
  const client = await dbPromise;
  const db = await client.db("atysashop");
  return (await db.collection("products").find({ filter })) || undefined;
}

export default handler;
