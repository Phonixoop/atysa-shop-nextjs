import dbPromise from "modules/db";
import createHandler from "next-connect";

const handler = createHandler();
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug }: any = req.query;
  const category = await prisma.product.findMany({
    where: { categories: { some: { slug } } },
    include: {
      categories: true,
    },
  });
  res.json(category);
});

export default handler;
