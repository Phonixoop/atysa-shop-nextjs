import createHandler from "next-connect";
import { getUser } from "@/api/users";
import { jsonify } from "modules/db";

const handler = createHandler();

handler.post(async (req, res) => {
  const user = await getUser({ phonenumber });
  if (code === verificationCode) {
    return res.json(user);
  }

  return res.json({ error: ":کد نا معتبر" });
});
