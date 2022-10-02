import createHandler from "next-connect";
import { getUser } from "@/api/users";
import { getRandomInt } from "@/api/auth/utils";
import { createOrUpdateUserByPhonenumber } from "@/api/users";
// import { jsonify } from "modules/db";

const handler = createHandler();

handler.post(async (req, res) => {
  const { phonenumber } = req.body;

  if (!phonenumber.startsWith("0"))
    return res.status(400).json({ error: "شماره موبایل صحیح نمی باشد" });
  const code = getRandomInt().toString();
  await createOrUpdateUserByPhonenumber({ phonenumber, code });
  // send code to the users phonenumber here
  return res.status(201).json({ ok: true });
});

export default handler;
