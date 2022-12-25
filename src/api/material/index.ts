import type { Material } from "@prisma/client";
import request from "api";
export async function upsertMaterial(material: Material) {
  return await request({ url: "material", method: "PUT", body: material });
}
