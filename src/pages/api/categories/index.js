import dbPromise from "@/modules/db";
import createHandler from "next-connect";
import { jsonify } from "@/utils";
const handler = createHandler();

import { prisma } from "modules/prisma";

export async function getCategory(filter) {
  const client = await dbPromise;
  const db = await client.db("atysashop");
  return (await db.collection("categories").findOne(filter)) || undefined;
}

export async function getCategories(filter) {
  const client = await dbPromise;
  const db = client.db("atysashop");
  return await db.collection("categories").find(filter).toArray();
}

// handler.get(async (req, res) => {
//   const { categoryId } = jsonify(req.query);
//   const categories = await getCategories({ category: categoryId });
//   res.send(categories);
// });

handler.get(async (req, res) => {
  const categories = await prisma.category.findMany();
  res.send(categories);
});

export default handler;
