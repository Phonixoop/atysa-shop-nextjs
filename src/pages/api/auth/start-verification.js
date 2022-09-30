import createHandler from "next-connect";
import { createOrUpdateUserByPhonenumber } from "@/api/users";
import { getRandomInt } from "./utils";

const handler = createHandler();

handler.post(async (req, res) => {
  const { phonenumber } = req.body;
  const code = getRandomInt().toString();
  const user = await createOrUpdateUserByPhonenumber({ phonenumber, code });

  // sms api
  // await everify.startVerification({
  //   phoneNumber: phonenumber,
  //   method: "SMS",
  // });

  return res.status(200).json({ ok: true, code });
});

export default handler;
