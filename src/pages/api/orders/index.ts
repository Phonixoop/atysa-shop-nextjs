import createHandler from "next-connect";
import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = createHandler();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { user }: any = await getToken({ req });

  if (!user.phonenumber)
    return res.status(401).json({ message: "unauthorized" });
  const orders = await prisma.order.findMany({
    where: {
      user: {
        phonenumber: user.phonenumber,
      },
    },
  });
  return res.json(orders);
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { user }: any = await getToken({ req });

  if (!user.phonenumber) return res.status(401);
  const {
    basket_items,
    tax,
    has_coupon,
    coupon_code,
    coupon_discount,
    total_price,
  } = req.body;

  const order = await prisma.order.create({
    data: {
      basket_items,
      tax,
      has_coupon,
      coupon_code,
      coupon_discount,
      total_price,
      user: {
        connect: {
          phonenumber: user.phonenumber,
        },
      },
      status: "PURCHASED_AND_PENDING",
    },
  });
  return res.json(order);
});

export default handler;
