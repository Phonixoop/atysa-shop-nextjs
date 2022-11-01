import dbPromise from "modules/db";
import createHandler from "next-connect";

const handler = createHandler();
import { prisma } from "lib/prisma";

handler.get(async (req, res) => {
  const { slug } = req.query;
  const category = await prisma.category.findFirst({ where: { slug } });
  res.json(category);
});

export default handler;
