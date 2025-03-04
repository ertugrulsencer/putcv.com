const SubscriptionsService = require("../services/subscriptions");
const { getLocalizedMessage } = require("../utils/Helper");

class SubscriptionsCtrl {
  static async subscribe(req, res) {
    try {
      const subscribe = await SubscriptionsService.subscribe(
        req.body,
        req.account,
        {
          lang: req.lang_key,
        }
      );
      return res.status(subscribe.code).json({
        ...subscribe,
        message: getLocalizedMessage(
          "subscriptions.subscribe",
          subscribe.message,
          req.lang_key
        ),
      });
    } catch (error) {
      return res.status(500).json({
        error,
        severity: "error",
        message: getLocalizedMessage("error", "general", req.lang_key),
      });
    }
  }

  static async upgradeSubscription(req, res) {
    try {
      const upgrade_subscription =
        await SubscriptionsService.upgradeSubscription(req.body, req.account, {
          lang: req.lang_key,
        });
      return res.status(upgrade_subscription.code).json({
        ...upgrade_subscription,
        message: getLocalizedMessage(
          "subscriptions.upgrade_subscription",
          upgrade_subscription.message,
          req.lang_key
        ),
      });
    } catch (error) {
      return res.status(500).json({
        error,
        severity: "error",
        message: getLocalizedMessage("error", "general", req.lang_key),
      });
    }
  }

  static async manage(req, res) {
    try {
      const manage = await SubscriptionsService.manage(req.body, req.account, {
        lang: req.lang_key,
      });
      return res.status(manage.code).json({
        ...manage,
        message: getLocalizedMessage(
          "subscriptions.manage",
          manage.message,
          req.lang_key
        ),
      });
    } catch (error) {
      return res.status(500).json({
        error,
        severity: "error",
        message: getLocalizedMessage("error", "general", req.lang_key),
      });
    }
  }

  static async plans(req, res) {
    try {
      const plans = await SubscriptionsService.plans({
        lang: req.lang_key,
      });
      return res.status(plans.code).json({
        ...plans,
        message: getLocalizedMessage(
          "subscriptions.plans",
          plans.message,
          req.lang_key
        ),
      });
    } catch (error) {
      return res.status(500).json({
        error,
        severity: "error",
        message: getLocalizedMessage("error", "general", req.lang_key),
      });
    }
  }

  static async webhook(req, res) {
    try {
      const signature = req.headers["stripe-signature"];
      if (!signature)
        return res.status(400).json({
          code: 400,
          severity: "error",
        });

      const webhook = await SubscriptionsService.webhook(req.body, signature);
      return res.json({ received: true, webhook });
    } catch (error) {
      return res.status(500).json({
        error,
        severity: "error",
        received: false,
      });
    }
  }
}

module.exports = SubscriptionsCtrl;
