const rateLimit = require("express-rate-limit");
const { getLocalizedMessage } = require("../utils/Helper");

module.exports = (limit = 50, time = 1) =>
  rateLimit.rateLimit({
    limit,
    windowMs: time * 60 * 1000,
    message: (req, res) => {
      const retry_after = Math.ceil(
        (req.rateLimit.resetTime - Date.now()) / 1000
      );
      return {
        code: 429,
        severity: "error",
        message: getLocalizedMessage("error", "rateLimit", req.lang_key, {
          retry_after,
        }),
      };
    },
  });
