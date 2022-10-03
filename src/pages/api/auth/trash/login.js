import { withSessionRoute } from "@/lib/withSession";
import { getUser } from "@/api/users";

async function login(req, res) {
  if (req.session.user) return;
  const { phonenumber, verificationCode } = req.body;

  const user = await getUser({ phonenumber });
  if (user.code !== verificationCode)
    return res.status(401).json({ error: "کد مطابقت ندارد" });

  delete user.code;
  req.session.user = user;
  await req.session.save();
  return res.status(200).json(user);
}

export default withSessionRoute(login);
