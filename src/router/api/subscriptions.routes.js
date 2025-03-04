const express = require("express");
const router = express.Router();
const main_router = require("../index");

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const SubscriptionsCtrl = require("../../controllers/subscriptions");
const SubscriptionsValidations = require("../../validations/subscriptions");
const Validator = require("../../middlewares/Validator");

router.post(
  "/subscribe",
  [RateLimit(5), Auth, Validator(SubscriptionsValidations.subscribe())],
  SubscriptionsCtrl.subscribe
);
router.get("/manage", [RateLimit(25), Auth], SubscriptionsCtrl.manage);
router.get("/plans", SubscriptionsCtrl.plans);

module.exports = router;
