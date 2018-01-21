"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const node_fetch_1 = require("node-fetch");
exports.get_gdg_group = functions.https.onRequest((req, res) => {
    const urlname = req.path.split("/meetup/")[1];
    if (!urlname) {
        res
            .status(400)
            .send({ errors: [{ message: "Please specify the GDG group name" }] });
    }
    res.set('Cache-Control', 'public, max-age=86400, s-maxage=129600');
    const sig_id = functions.config().meetup.key;
    const getGroup = node_fetch_1.default(`https://api.meetup.com/${urlname}?sig_id=${sig_id}`);
    const getEvent = node_fetch_1.default(`https://api.meetup.com/${urlname}/events?status=upcoming&sig_id=${sig_id}`);
    function getGDGInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const [group, event] = yield Promise.all([
                getGroup.then(response => response.json()),
                getEvent.then(response => response.json())
            ]);
            return [group, event];
        });
    }
    getGDGInfo()
        .then(json => {
        res.status(200).send(json);
    })
        .catch(err => {
        res.status(500).send({ errors: err });
    });
});
//# sourceMappingURL=index.js.map