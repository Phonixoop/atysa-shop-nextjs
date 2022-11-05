import createHandler from "next-connect";

const handler = createHandler();
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id }: any = req.query;
  const category = await prisma.category.findMany({ where: { id } });
  res.json(category);
});

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const { id }: any = req.query;
  const category = await prisma.category.update({
    where: { id },
    data: body,
  });
  res.json(category);
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id }: any = req.query;
  const category = await prisma.category.delete({ where: { id } });
  res.json(category);
});

export default handler;
