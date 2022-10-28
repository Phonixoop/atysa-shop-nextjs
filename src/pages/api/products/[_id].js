import createHandler from "next-connect";
import { getProducts } from "./index.js";
import { getCategory } from "@/api/categories";
import { jsonify } from "@/utils";

const handler = createHandler();
handler.get(async (req, res) => {
  const { slug } = jsonify(req.query);
  console.log("hi" + slug);
  const category = await getCategory({ slug });
  if (category === undefined || category.length <= 0) res.json([]);

  const products = await getProducts({ category: jsonify(category)._id });

  res.json(products);
});

export default handler;
