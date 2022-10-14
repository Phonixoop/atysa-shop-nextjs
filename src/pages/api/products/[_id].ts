import createHandler from "next-connect";

const handler = createHandler();
handler.get(async (req: any, res: any) => {
  res.send(req.query._id);
});

export default handler;
