import createHandler from "next-connect";
import dbPromise from "@/modules/db";
const handler = createHandler();

export async function getUser({ phonenumber }) {
  const db = await dbPromise.db("atysa-shop-nextjs-db");
  return (
    (await db.collection("users").findOne({ phonenumber, code })) || undefined
  );
}

export async function createOrUpdateUserByPhonenumber({ phonenumber, code }) {
  const client = await dbPromise;
  const db = await client.db("atysa-shop-nextjs-db");
  return (
    (await db
      .collection("users")
      .updateOne(
        { phonenumber },
        { $set: { phonenumber, code } },
        { upsert: true }
      )) || undefined
  );
}

export default handler;
