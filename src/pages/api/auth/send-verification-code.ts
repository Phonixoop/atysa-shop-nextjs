import createHandler from "next-connect";
import { getRandomInt } from "pages/api/auth/utils";
import { prisma } from "lib/prisma";
// import { jsonify } from "modules/db";

const handler = createHandler();

handler.post(async (req: any, res: any) => {
  const { phonenumber } = req.body;
  if (!phonenumber.startsWith("09"))
    return res.status(400).json({ error: "شماره موبایل صحیح نمی باشد" });

  const code: string = getRandomInt().toString();

  await prisma.user.upsert({
    where: {
      phonenumber,
    },
    create: {
      code,
      addresses: [],
      phonenumber,
    },
    update: {
      code,
    },
  });

  // send code to the users phonenumber here
  const token = await getToken();
  await sendCodeToMobilenumber({ token, code, phonenumber });

  return res.status(201).json({ ok: true, code });
});

async function getToken() {
  return new Promise(async (resolve, reject) => {
    const apiKeys = {
      UserApiKey: process.env.SMS_USER_API_KEY,
      SecretKey: process.env.SMS_SECRET_KEY,
    };

    const response = await fetch("https://ws.sms.ir/api/Token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...apiKeys }),
    });
    const responseJson = await response.json();

    return resolve(responseJson.TokenKey);
  });
}

async function sendCodeToMobilenumber({ token, code, phonenumber }) {
  return new Promise(async (resolve, reject) => {
    const data = {
      Code: code,
      MobileNumber: phonenumber,
    };

    const response = await fetch(
      "https://restfulsms.com/api/VerificationCode",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-sms-ir-secure-token": token,
        },
        body: JSON.stringify({ ...data }),
      }
    );
    const responseJson = await response.json();

    return resolve(responseJson);
  });
}
export default handler;
