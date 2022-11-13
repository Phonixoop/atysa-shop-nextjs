import type { NextApiRequest, NextApiResponse } from "next";
import { parseForm, FormidableError } from "lib/parse-form";
import createHandler from "next-connect";
import { prisma } from "lib/prisma";
import fs from "fs";
import path, { join } from "path";
const handler = createHandler();

handler.delete(async (req: any, res: any) => {
  const { id }: any = req.query;
  const file = await prisma.file.findUnique({
    where: {
      id,
    },
  });
  await prisma.file.delete({ where: { id } });
  const path = join(process.cwd(), "public", file.uploadPath);
  fs.unlink(path, async (error) => {
    if (error) return res.json({ error, message: "file not exists", id });
    return res.json({ message: "file deleted", id });
  });
});

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

export default handler;
