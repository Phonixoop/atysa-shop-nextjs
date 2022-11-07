import type { NextApiRequest, NextApiResponse } from "next";
import { parseForm, FormidableError } from "lib/parse-form";
import createHandler from "next-connect";
import { prisma } from "lib/prisma";
import path from "path";
const handler = createHandler();

handler.post(async (req: NextApiRequest, res: any) => {
  // Just after the "Method Not Allowed" code
  try {
    const { files, uploadDir } = await parseForm(req);
    // console.log(files.file);

    const filePath = (
      process.env.BASE_URL +
      "/" +
      path.join(uploadDir, files.file.newFilename)
    )
      .replace("\\", "/")
      .replace("\\", "/");

    const file = await prisma.file.create({
      data: {
        mimetype: files.file.mimetype,
        size: files.file.size,
        url: filePath,
        originalFilename: files.file.originalFilename,
        newFilename: files.file.newFilename,
      },
    });
    res.status(200).json({
      data: {
        file,
      },
      error: null,
    });
  } catch (e) {
    if (e instanceof FormidableError) {
      res.status(e.httpCode || 400).json({ data: null, error: e.message });
    } else {
      console.error(e);
      res.status(500).json({ data: null, error: "Internal Server Error" });
    }
  }
});

handler.get(async (req: NextApiRequest, res: any) => {
  const files = await prisma.file.findMany();

  res.json(files);
});

/* Don't miss that! */
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
