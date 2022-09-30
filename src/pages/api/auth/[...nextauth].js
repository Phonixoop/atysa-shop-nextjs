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
        console.log("generating");
        return "ABC123";
      },
      sendVerificationRequest: ({ url }) => {
        console.log("hi");
        return "ABC123 ";
      },
    }),
  ],
  async session({ session, token, user }) {
    // Send properties to the client, like an access_token from a provider.
    console.log({ session });
    return session;
  },
  pages: {
    signIn: "/login", // this will allow us to use our own login page
  },
};

export default (req, res) => NextAuth(req, res, options);
