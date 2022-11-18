import dbPromise from "modules/db";
import createHandler from "next-connect";
import { jsonify } from "utils";

import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = createHandler();

// export async function getProduct(filter) {
//   const client = await dbPromise;
//   const db = client.db("atysashop");
//   return (await db.collection("products").find(filter)) || undefined;
// }

export async function getProducts(filter) {
  const client = await dbPromise;
  const db = client.db("atysashop");
  return await db
    .collection("products")
    .find({
      where: {},
    })
    .toArray();
}

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const products = await prisma.product.findMany({
    where: {
      categories: {
        every: {},
      },
    },
    include: {
      categories: true,
    },
  });
  return res.json(products);
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const category_ids = body.category_ids.map((id: string) => ({ id }));
  const product = await prisma.product.create({
    data: {
      ...body,
      categories: {
        connect: category_ids,
      },
    },
  });
  return res.json(product);
});

export default handler;
