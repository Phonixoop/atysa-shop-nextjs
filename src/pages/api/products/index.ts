import createHandler from "next-connect";

import { jsonify } from "utils";

import { prisma } from "lib/prisma";

const handler = createHandler();

// export async function getProduct(filter) {
//   const client = await dbPromise;
//   const db = client.db("atysashop");
//   return (await db.collection("products").find(filter)) || undefined;
// }

// export async function getProducts(filter) {
//   const client = await dbPromise;
//   const db = client.db("atysashop");
//   return await db.collection("products").find(filter).toArray();
// }

handler.get(async (req, res) => {
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

handler.post(async (req, res) => {
  const products = await prisma.product.create({
    data: {
      name: "prisma test 2",
      slug: "prisma-test-2",
      price: 10000,
      categories: {
        connect: {
          slug: "salads",
        },
      },
    },
  });
  return res.json(products);
});

export default handler;
