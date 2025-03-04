const express = require("express");
const router = express.Router();

const Auth = require("../../middlewares/Auth");
const TemplatesCtrl = require("../../controllers/templates");
const TemplatesValidations = require("../../validations/templates");
const Validator = require("../../middlewares/Validator");

router.get(
  "/list",
  [Auth, Validator(TemplatesValidations.list(), "query")],
  TemplatesCtrl.list
);

module.exports = router;
