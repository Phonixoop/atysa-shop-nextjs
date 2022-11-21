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

  if (!token || !isAllowed(token.user.type))
    return res.status(401).json({ message: "unauthorized" });

  const orders = await prisma.order.findMany({
    include: {
      user: true,
    },
  });

  return res.json(orders);
});

export default handler;
