import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import dbPromise, { jsonify } from "modules/db";
import Providers from "next-auth/providers";
import { getUser } from "../../users";
const options = {
  providers: [
    Providers.Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Providers.Email({
      server: {
        host: "",
        port: "",
        auth: {
          user: "",
          pass: "",
        },
      },
      from: "",
    }),
  ],
};
export default NextAuth({
  adapter: MongoDBAdapter(dbPromise),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phonenumber: { label: "phonenumber", type: "text" },
        verificationCode: { label: "verificationCode", type: "text" },
      },
      authorize: async ({ phonenumber, verificationCode }) => {
        console.log("authorizing");

        const { code } = await getUser({ phonenumber });
        if (code === verificationCode) {
          console.dir({ code });
          return {
            name: "John Doe",
            username: "admin1",
            phoneNumber: "+161901234567",
          };
        }
        throw new Error(JSON.stringify({ errors: "کد بد", status: false }));
      },
    }),
  ],

  pages: {
    signIn: "/login", // this will allow us to use our own login page
  },
});
