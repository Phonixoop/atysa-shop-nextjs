import dbPromise from "@/modules/db";
import createHandler from "next-connect";
import { jsonify } from "@/utils";
const handler = createHandler();

export async function getProduct(filter) {
  const client = await dbPromise;
  const db = await client.db("atysa-shop-nextjs-db");
  return (await db.collection("products").findOne(filter)) || undefined;
}

export async function getProducts(filter) {
  const client = await dbPromise;
  const db = client.db("atysashop");
  return await db.collection("products").find(filter).toArray();
}

handler.get(async (req, res) => {
  const query = jsonify(req.query);
  const products = await getProducts(query);
  res.send(products);
});

export default handler;
