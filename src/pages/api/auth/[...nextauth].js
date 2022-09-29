import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getUser } from "../users";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phonenumber: { label: "phonenumber", type: "text" },
        verificationCode: { label: "verificationCode", type: "text" },
      },
      authorize: async ({ phonenumber, verificationCode }) => {
        console.log("authorizing");

        const user = await getUser({ phonenumber });

        return user.code === verificationCode ? user : undefined;
      },
    }),
  ],
  pages: {
    signIn: "/login", // this will allow us to use our own login page
  },
});
