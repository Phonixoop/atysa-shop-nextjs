import { withSessionRoute } from "@/lib/withSession";

export default withSessionRoute(logout);

async function logout(req, res) {
  req.session.destroy();
  return res.json({ ok: true });
}
