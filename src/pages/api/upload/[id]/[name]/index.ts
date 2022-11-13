import type { NextApiRequest, NextApiResponse } from "next";
import { parseForm, FormidableError } from "lib/parse-form";
import createHandler from "next-connect";
import { prisma } from "lib/prisma";
import fs from "fs";
import path, { join } from "path";
import { createReadStream } from "fs";
import { pipeline } from "stream";
const handler = createHandler();

handler.get(async (req: any, res: any) => {
  res.setHeader("Content-Type", "image/png");
  const filePath = join(
    process.cwd(),
    "public",
    "uploads",
    req.query.id,
    req.query.name
  );
  const imageStream = createReadStream(filePath);
  pipeline(imageStream, res, (error) => {
    if (error) console.error(error);
  });
});

export default handler;
