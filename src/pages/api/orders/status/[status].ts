import createHandler from "next-connect";
import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = createHandler();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const token: any = (await getToken({ req })) || undefined;
  if (!token) return res.status(401).json({ message: "unauthorized" });
  if (token && token.user.role !== "ADMIN")
    return res.status(401).json({ message: "unauthorized" });

  const { status }: any = req.query;
  const orders = await prisma.order.findMany({
    where: {
      status,
    },
    include: {
      user: true,
    },
  });

  return res.json(orders);
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {});

export default handler;
