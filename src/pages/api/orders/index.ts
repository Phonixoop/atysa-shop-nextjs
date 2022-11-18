import createHandler from "next-connect";
import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = createHandler();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  if (!token) return;
  const orders = await prisma.order.findMany({
    where: {
      user: {
        phonenumber: token.phonenumber,
      },
    },
  });
  return res.json(orders);
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, basket_items } = req.body;
  if (!user) return res.status(401).json({ message: "unauthorized" });

  const order = await prisma.order.create({
    data: {
      basket_items,
      user: {
        connect: {
          phonenumber: user.phonenumber,
        },
      },
      ...{ status: "PURCHASED_AND_PENDING" },
    },
  });
  return res.json(req.body);
});

export default handler;
