import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "lib/prisma";
import { User } from "@prisma/client";
export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phonenumber: { label: "phonenumber", type: "text" },
        verificationCode: { label: "verificationCode", type: "text" },
      },
      authorize: async ({ phonenumber, verificationCode }: any) => {
        const user = await prisma.user.findFirst({ where: { phonenumber } });

        if (user?.code === verificationCode) {
          return user;
        }
        throw new Error(JSON.stringify("کد صحیح نیست"));
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      delete token.user.code;
      return token;
    },
    session: async ({ session, token }) => {
      const user: any = await prisma.user.findUnique({
        where: { phonenumber: token.user.phonenumber },
      });
      if (!user) return undefined;
      if (user.code) delete user?.code;
      session.user = user;
      return session;
    },
  },
  pages: {
    signIn: "/login", // this will allow us to use our own login page
  },
};

export default NextAuth(authOptions);
