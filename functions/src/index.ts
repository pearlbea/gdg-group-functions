import * as functions from "firebase-functions";
import fetch from "node-fetch";

export const get_gdg_group = functions.https.onRequest((req, res) => {
  if (!req.query.urlname) {
    res
      .status(400)
      .send({ errors: [{ message: "Please specify the GDG group name" }] });
  }
  const urlname = req.query.urlname;
  const sig_id = functions.config().meetup.key;
  const url = `https://api.meetup.com/${urlname}?sig_id=${sig_id}`;

  async function getGDGInfo() {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  }

  getGDGInfo()
    .then(json => {
      res.status(200).send(json);
    })
    .catch(err => {
      res.status(500).send({ errors: err });
    });
});
