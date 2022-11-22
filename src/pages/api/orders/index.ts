import createHandler from "next-connect";
import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = createHandler();

function isAllowed(type) {
  switch (type) {
    case "ADMIN":
      return true;
    // remove USER later!!
    case "USER":
      return true;
  }
}
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const token: any = await getToken({ req });

  // if (!token || !isAllowed(token.user.type))
  //   return res.status(401).json({ message: "unauthorized" });
  const limit: number = parseInt(req.query.limit as string) || 2;
  const cursorQuery: any = req.query.cursor;

  const cursor: { id: string } = cursorQuery ? { id: cursorQuery } : undefined;

  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: ["ACCEPTED", "PURCHASED_AND_PENDING"],
      },
    },
    take: limit,
    cursor,
    skip: cursor ? 1 : 0, // if skip is 1 it returns the first value twice, unless we are getting the first value in the db
    include: {
      user: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return res.json({
    orders,
    nextId: orders.length === limit ? orders[orders.length - 1].id : undefined,
  });
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
