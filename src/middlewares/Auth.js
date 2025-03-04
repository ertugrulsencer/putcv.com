const jwt = require("jsonwebtoken");
const db = require("../drizzle");
const { eq, sql } = require("drizzle-orm");
const { accounts, subscriptions } = require("../drizzle/schema");
const { getLocalizedMessage } = require("../utils/Helper");

module.exports = async (req, res, next) => {
  const auth_header = req.headers["authorization"];

  if (!auth_header)
    return res.status(403).json({
      code: 403,
      severity: "warning",
      message: getLocalizedMessage("warning", "headerRequired", req.lang_key),
    });

  const access_token = auth_header.split(" ")?.[1];
  if (!access_token)
    return res.status(400).json({
      code: 400,
      severity: "warning",
      message: getLocalizedMessage(
        "warning",
        "accessTokenRequired",
        req.lang_key
      ),
    });

  let resolved_token;
  try {
    resolved_token = await jwt.verify(access_token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        code: 403,
        severity: "warning",
        message: getLocalizedMessage("warning", "expired", req.lang_key),
      });
    }
    return res.status(400).json({
      code: 400,
      severity: "error",
      message: getLocalizedMessage("warning", "tokenError", req.lang_key),
    });
  }

  if (!resolved_token?.account_id)
    return res.status(400).json({
      code: 400,
      severity: "error",
      message: getLocalizedMessage(
        "warning",
        "tokenAccountIdNotFound",
        req.lang_key
      ),
    });

  const account = await db.query.accounts.findFirst({
    columns: {
      id: true,
      stripe_customer_id: true,
      photo_url: true,
      first_name: true,
      last_name: true,
      email: true,
      password_hash: true,
      status: true,
    },
    with: {
      subscription: {
        where: eq(subscriptions.status, "active"),
        with: {
          plan: true,
        },
      },
    },
    where: eq(accounts.id, resolved_token.account_id),
  });

  if (!account)
    return res.status(404).json({
      code: 404,
      severity: "error",
      message: getLocalizedMessage("error", "accountNotFound", req.lang_key),
    });
  if (account.status === "BANNED")
    return res.status(403).json({
      code: 403,
      severity: "error",
      message: getLocalizedMessage("warning", "bannedAccount", req.lang_key),
    });

  req.account = account;
  next();
};
