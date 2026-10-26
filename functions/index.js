const { app } = require("./index.cjs");
const { onRequest } = require("firebase-functions/v2/https");

exports.apiServer = onRequest({ region: "europe-west2", memory: "256MiB" }, app);
