import * as functions from "firebase-functions";
import fetch from "node-fetch";

export const get_gdg_group = functions.https.onRequest((req, res) => {
  const urlname = req.path.split("/meetup/")[1];
  if (!urlname) {
    res
      .status(400)
      .send({ errors: [{ message: "Please specify the GDG group name" }] });
  }

  res.set("Cache-Control", "public, max-age=86400, s-maxage=129600");

  const sig_id = functions.config().meetup.key;
  const getGroup = fetch(`https://api.meetup.com/${urlname}?sig_id=${sig_id}`);
  const getEvent = fetch(
    `https://api.meetup.com/${urlname}/events?status=upcoming&sig_id=${sig_id}`
  );

  async function getGDGInfo() {
    const [group, event] = await Promise.all([
      getGroup.then(response => response.json()),
      getEvent.then(response => response.json())
    ]);
    return {
      name: group.name,
      nextEvent: event[0]
    };
  }

  getGDGInfo()
    .then(json => {
      res.status(200).send(json);
    })
    .catch(err => {
      res.status(500).send({ errors: err });
    });
});
