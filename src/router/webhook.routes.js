const express = require("express");
const router = express.Router();

const Cors = require("../middlewares/Cors");
const SubscriptionsCtrl = require("../controllers/subscriptions");

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  Cors,
  SubscriptionsCtrl.webhook
);

module.exports = router;
