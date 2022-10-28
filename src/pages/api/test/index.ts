import createHandler from "next-connect";
const handler = createHandler();

import { prisma } from "modules/prisma";

handler.get(async (req, res: any) => {
  res.json(undefined);
});

export default handler;

/*



 "name": "میان وعده",
  "description": null,
  "updated_at": {
    "$date": "2022-10-04T11:08:52.329Z"
  },
  "created_at": {
    "$date": "2022-09-27T09:42:40.109Z"
  },
  "image": "2JbmMlXttQewW4HkuZ8atC3MKp8wRBKlbTOG32KM_10_39_47am.png",
  "slug": "snacks"

  */
