import dbPromise from "modules/db";
import createHandler from "next-connect";
import { jsonify } from "utils";
const handler = createHandler();

import { prisma } from "modules/prisma";

handler.get(async (req, res) => {
  console.log("hi");
  const { slug } = req.query;
  const category = await prisma.category.findMany({ where: { slug } });
  res.json(category);
});

export default handler;
