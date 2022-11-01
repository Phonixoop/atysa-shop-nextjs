export const resolvers = {
  Query: {
    categories: async (_parent, args, ctx) =>
      await ctx.prisma.category.findMany(),
  },
};
