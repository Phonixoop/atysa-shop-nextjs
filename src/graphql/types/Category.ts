import { objectType, extendType } from "nexus";
import { Product } from "./Product";
export const Category = objectType({
  name: "Category",
  definition(t) {
    t.string("id"),
      t.string("name"),
      t.string("slug"),
      t.string("description"),
      t.string("image"),
      t.boolean("isActive"),
      t.list.field("products", {
        type: Product,
        resolve: async (parent, _args, ctx) => {
          return await ctx.prisma.product.findMany({
            where: {
              categoryIds: {
                has: parent.id,
              },
            },
          });
        },
      });
  },
});

export const CategoriesQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("categories", {
      type: "Category",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.category.findMany();
      },
    });
  },
});

// t.list.field("products", {
//   type: Product,
//   async resolve(parent, _args, ctx) {
//     return await ctx.prisma.product
//       .findUnique({
//         where: {},
//       })
//       .categories();
//   },
// });
