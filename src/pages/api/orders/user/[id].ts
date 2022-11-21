import createHandler from "next-connect";
import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = createHandler();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const token: any = (await getToken({ req })) || undefined;
  if (!token) return res.status(401).json({ message: "unauthorized" });
  const { id }: any = req.query;
  if (token && token.user.id !== id)
    return res.status(401).json({ message: "unauthorized" });

  console.log("success");
  const orders = await prisma.order.findMany({
    where: {
      user: {
        id,
      },
    },
    include: {
      user: true,
    },
  });

  return res.json(orders);
});

export default handler;
