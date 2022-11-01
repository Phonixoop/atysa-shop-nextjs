import dbPromise from "modules/db";
import createHandler from "next-connect";

const handler = createHandler();

import { prisma } from "lib/prisma";

// export async function getCategory(filter) {
//   const client = await dbPromise;
//   const db = await client.db("atysashop");
//   return (await db.collection("categories").findOne(filter)) || undefined;
// }

// export async function getCategories(filter) {
//   const client = await dbPromise;
//   const db = client.db("atysashop");
//   return await db.collection("categories").find(filter).toArray();
// }

handler.get(async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

handler.post(async (req, res) => {
  const body = req.body;
  const category = await prisma.category.create({
    data: body,
  });
  res.json(category);
});

export default handler;
