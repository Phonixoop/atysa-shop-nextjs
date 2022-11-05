import { NextApiRequest, NextApiResponse } from "next";
// import dbPromise from "modules/db";
import createHandler from "next-connect";

const handler = createHandler();
import { prisma } from "lib/prisma";

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug }: any = req.query;
  const category = await prisma.product.findFirst({
    where: { slug },
    include: {
      categories: true,
    },
  });
  res.json(category);
});

export default handler;
