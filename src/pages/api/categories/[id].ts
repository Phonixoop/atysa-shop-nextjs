import createHandler from "next-connect";

const handler = createHandler();
import { prisma } from "modules/prisma";

handler.get(async (req, res) => {
  const { id } = req.query;
  const category = await prisma.category.findMany({ where: { id } });
  res.json(category);
});

handler.put(async (req, res) => {
  const body = req.body;
  const category = await prisma.category.update({
    where: { id: req.query.id },
    data: body,
  });
  res.json(category);
});

handler.delete(async (req, res) => {
  const { id } = req.query;
  const category = await prisma.category.delete({ where: { id } });
  res.json(category);
});

export default handler;
