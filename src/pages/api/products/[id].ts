import createHandler from "next-connect";
import { prisma } from "lib/prisma";

const handler = createHandler();

handler.get(async (req, res) => {
  const { id } = req.query;
  const product = await prisma.product.findMany({ where: { id } });
  res.json(product);
});

handler.put(async (req, res) => {
  const body = req.body;
  const productId = req.query.id;
  const category_ids = body.category_ids.map((id: string) => ({ id }));
  const categories: {
    id: string;
  }[] = await prisma.category.findMany({
    select: {
      id: true,
    },
  });

  // it just returns us all the categories that did not sent to us,
  // so we can disconnect them from the requested product in the categories collection
  // rename this later, its stupid name
  const disconnectByFilter: any = categories.filter((category) => {
    return !body.category_ids.includes(category.id);
  });

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      ...body,
      categories: {
        connect: category_ids,
        disconnect: disconnectByFilter,
      },
    },
    include: {
      categories: true,
    },
  });
  res.json(product);
});

handler.delete(async (req, res) => {
  const { id } = req.query;
  const product = await prisma.product.delete({ where: { id } });
  res.json(product);
});

export default handler;
