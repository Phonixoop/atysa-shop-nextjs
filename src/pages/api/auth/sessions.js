// import { withIronSession } from "next-iron-session";

// const VALID_EMAIL = "chris@decimal.fm";
// const VALID_PASSWORD = "opensesame";

// export default withIronSession(
//   async (req, res) => {
//     if (req.method === "POST") {
//       const { phonenumber } = req.body;
//       if (phonenumber.startWith("0")) {
//         req.session.set("user", { phonenumber });
//         await req.session.save();
//         return res.status(200).json({ session });
//       }
//       return res.status(403).send("");
//     }
//     return res.status(404).send("");
//   },
//   {
//     cookieName: "MYSITECOOKIE",
//     cookieOptions: {
//       secure: process.env.NODE_ENV === "production" ? true : false,
//     },
//     password: process.env.APPLICATION_SECRET,
//   }
// );
