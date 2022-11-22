import createHandler from "next-connect";
import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
const handler = createHandler();

handler.get(async (req: any, res: any) => {
  // const token: any = (await getToken({ req })) || undefined;
  // if (!token) return res.status(401).json({ message: "unauthorized" });
  const { id }: any = req.query;

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
