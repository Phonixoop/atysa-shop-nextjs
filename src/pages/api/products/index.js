import dbPromise, { DB } from "@/modules/db";
import createHandler from "next-connect";

import { jsonify } from "@/utils";

import { prisma } from "modules/prisma";

const handler = createHandler();

export async function getProduct(filter) {
  const client = await dbPromise;
  const db = client.db("atysashop");
  return (await db.collection("products").find(filter)) || undefined;
}

export async function getProducts(filter) {
  const client = await dbPromise;
  const db = client.db("atysashop");
  return await db.collection("products").find(filter).toArray();
}

handler.get(async (req, res) => {
  const query = jsonify(req.query);

  const products = await prisma.product.findMany({
    where: {
      categories: {
        every: {},
      },
    },
  });
  return res.json(products);
});

handler.post(async (req, res) => {
  const products = await prisma.product.create({
    data: {
      name: "prisma test",
      slug: "prisma-test",
      price: 10000,
      image: "",
      categories: {
        connect: {
          slug: "diet-pack",
        },
      },
    },
  });
  return res.json(products);
});

export default handler;
