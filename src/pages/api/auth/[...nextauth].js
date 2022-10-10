import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUser } from "@/api/users";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phonenumber: { label: "phonenumber", type: "text" },
        verificationCode: { label: "verificationCode", type: "text" },
      },
      authorize: async ({ phonenumber, verificationCode }) => {
        const user = await getUser({ phonenumber });
        if (user.code === verificationCode) {
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
      return token;
    },
    session: async ({ session, token, user }) => {
      delete session.user.code;
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login", // this will allow us to use our own login page
  },
};

export default NextAuth(authOptions);
