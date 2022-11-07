import type { NextApiRequest } from "next";
import mime from "mime";
import path, { join } from "path";
import * as dateFn from "date-fns";
import formidable from "formidable";
import { mkdir, stat } from "fs/promises";
export const FormidableError = formidable.errors.FormidableError;

export const parseForm = async (
  req: NextApiRequest
): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
  uploadDir: string;
}> => {
  return await new Promise(async (resolve, reject) => {
    const readUploadDir = `${process.env.UPLOAD_DIR}/${dateFn.format(
      Date.now(),
      "dd-MM-Y"
    )}`;
    const uploadDir = join(process.cwd(), "public", readUploadDir);
    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(e);
        reject(e);
        return;
      }
    }

    let filename = ""; //  To avoid duplicate upload
    const form = formidable({
      maxFiles: 2,
      maxFileSize: 1024 * 1024, // 1mb
      uploadDir,
      filename: (name, _ext, part) => {
        if (filename !== "") {
          return filename;
        }

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        filename = `${name || part.name || "unknown"}-${uniqueSuffix}.${
          mime.getExtension(part.mimetype || "") || "unknown"
        }`;

        return filename;
      },
    });
    //const fileName = ;
    form.parse(req, function (err, fields, files: formidable.Files) {
      if (err) reject(err);

      resolve({
        fields,
        files,
        uploadDir: readUploadDir,
      });
    });
  });
};
