const { getLocalizedMessage } = require("../utils/Helper");

module.exports =
  (schema, source = "body") =>
  (req, res, next) => {
    const validation = schema.validate(req[source], {
      abortEarly: false,
    });
    if (validation.error)
      return res.status(500).json({
        severity: "warning",
        validation_errors: validation.error.details,
        message: getLocalizedMessage("warning", "validation", req.lang_key),
      });
    else req[source] = validation.value;
    next();
  };
