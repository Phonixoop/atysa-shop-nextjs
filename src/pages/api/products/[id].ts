import createHandler from "next-connect";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
const handler = createHandler();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id }: any = req.query;
  const product = await prisma.product.findMany({ where: { id } });
  res.json(product);
});

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const productId: any = req.query.id;
  const category_ids = body.category_ids?.map((id: string) => ({ id }));

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      ...body,

      categories: {
        set: category_ids,
      },
    },
    include: {
      categories: true,
    },
  });
  res.json(product);
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id }: any = req.query;
  const product = await prisma.product.delete({ where: { id } });
  res.json(product);
});

export default handler;
