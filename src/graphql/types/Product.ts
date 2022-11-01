import { objectType, extendType } from "nexus";
import { Category } from "./Category";
export const Product = objectType({
  name: "Product",
  definition(t) {
    t.string("id"),
      t.string("name"),
      t.string("slug"),
      t.string("description"),
      t.int("calory"),
      t.int("price"),
      t.boolean("isPromoted"),
      t.boolean("isActive"),
      t.list.field("categories", {
        type: Category,
        resolve: async (parent, _args, ctx) => {
          return await ctx.prisma.category.findMany({
            where: {
              product_ids: {
                has: parent.id,
              },
            },
          });
        },
      });
  },
});

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("products", {
      type: "Product",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.product.findMany();
      },
    });
  },
});
