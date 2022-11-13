import type { NextApiRequest, NextApiResponse } from "next";
import { parseForm, FormidableError } from "lib/parse-form";
import createHandler from "next-connect";
import { prisma } from "lib/prisma";
import path from "path";
const handler = createHandler();

handler.post(async (req: NextApiRequest, res: any) => {
  try {
    const { files, uploadDir } = await parseForm(req);

    const uploadPath = path.join(uploadDir, files.file.newFilename);

    const filePath = (process.env.BASE_URL + "/api/" + uploadPath)
      .replace("\\", "/")
      .replace("\\", "/");

    const file = await prisma.file.create({
      data: {
        mimetype: files.file.mimetype,
        size: files.file.size,
        url: filePath.replace("uploads", "upload"),
        uploadPath,
        originalFilename: files.file.originalFilename,
        newFilename: files.file.newFilename,
      },
    });
    res.status(200).json({
      file,
    });
  } catch (e) {
    if (e instanceof FormidableError) {
      res.status(e.httpCode || 400).json({ data: null, error: e.message });
    } else {
      res.status(500).json({ data: null, error: "Internal Server Error" });
    }
  }
});

handler.get(async (req: NextApiRequest, res: any) => {
  const files = await prisma.file.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  res.json(files);
});

export const config = {
  api: {
    bodyParser: false,
  },
};

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
