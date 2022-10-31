import createHandler from "next-connect";

const handler = createHandler();
import { prisma } from "modules/prisma";

handler.get(async (req, res) => {
  const { id } = req.query;
  const product = await prisma.product.findMany({ where: { id } });
  res.json(product);
});

handler.put(async (req, res) => {
  const body = req.body;
  const product = await prisma.product.update({
    where: { id: req.query.id },
    data: body,
  });
  res.json(product);
});

handler.delete(async (req, res) => {
  const { id } = req.query;
  const product = await prisma.product.delete({ where: { id } });
  res.json(product);
});

export default handler;
