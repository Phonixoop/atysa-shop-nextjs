import type { Material } from "@prisma/client";
import request from "api";

export async function upsertMaterial(material: Material) {
  return await request({ url: "material", method: "PUT", body: material });
}

export async function getMaterials() {
  return await request({ url: "material" });
}

export async function getMaterialById(id) {
  return await request({ url: `material/${id}` });
}

export async function deleteMaterialById(id) {
  return await request({ url: `material/${id}`, method: "DELETE" });
}
