import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import dbPromise from "modules/db";

const options = {
  adapter: MongoDBAdapter(dbPromise),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      generateVerificationToken: () => {
        return "ABC123";
      },
      sendVerificationRequest: ({ url }) => {
        return "ABC123 ";
      },
    }),
  ],
  async session({ session, token, user }) {
    // Send properties to the client, like an access_token from a provider.
    return session;
  },
  pages: {
    signIn: "/login", // this will allow us to use our own login page
  },
};

export default (req, res) => NextAuth(req, res, options);
