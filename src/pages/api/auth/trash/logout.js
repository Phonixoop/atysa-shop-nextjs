import { withSessionRoute } from "@/lib/withSession";

async function logout(req, res) {
  req.session.destroy();
  return res.json({ ok: true });
}

export default withSessionRoute(logout);
