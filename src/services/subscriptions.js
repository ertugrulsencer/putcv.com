const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, and, sql, asc } = require("drizzle-orm");
const { accounts, plans, subscriptions } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class SubscriptionsService {
  static async subscribe(data, account, config) {
    try {
      if (account.subscription)
        return {
          code: 404,
          severity: "error",
          message: "existsPlan",
        };
      const plan = await db.query.plans.findFirst({
        where: eq(plans.id, data.plan_id),
      });
      if (!plan)
        return {
          code: 404,
          severity: "error",
          message: "planNotFound",
        };

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        allow_promotion_codes: true,
        automatic_tax: {
          enabled: true,
        },
        customer_update: {
          address: "auto",
        },
        customer: account.stripe_customer_id,
        line_items: [
          {
            price: plan.stripe_price_id,
            quantity: 1,
          },
        ],
        success_url: `${process.env.BASE}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE}/cancel`,
      });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          session,
        },
      };
    } catch (error) {
      return {
        code: 500,
        severity: "error",
        message: "error",
        error,
      };
    }
  }

  static async manage(data, account) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: account.stripe_customer_id,
        return_url: `${process.env.BASE}/account`,
      });
      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          session,
        },
      };
    } catch (error) {
      return {
        code: 500,
        severity: "error",
        message: "error",
        error,
      };
    }
  }

  static async plans(config) {
    try {
      const list = await db.query.plans.findMany({
        orderBy: asc(plans.prices),
      });
      return {
        code: 200,
        severity: "success",
        message: "success",
        data: {
          list,
        },
      };
    } catch (error) {
      return {
        code: 500,
        severity: "error",
        message: "error",
        error,
      };
    }
  }

  static async webhook(data, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        data,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET_KEY
      );

      switch (event.type) {
        case "customer.subscription.created":
          await this.handleCreated(event.data.object);
          break;

        case "customer.subscription.updated":
          await this.handleUpdated(event.data.object);
          break;

        case "customer.subscription.deleted":
          await this.handleDeleted(event.data.object);
          break;
      }

      return {
        code: 201,
        severity: "success",
        message: "Completed!",
      };
    } catch (error) {
      console.log(error?.message);

      return {
        code: 500,
        severity: "error",
        message: "Server error!",
        error,
      };
    }
  }

  static async handleCreated(data) {
    try {
      const [account, plan] = await Promise.all([
        db.query.accounts.findFirst({
          where: eq(accounts.stripe_customer_id, data.customer),
        }),
        db.query.plans.findFirst({
          where: eq(plans.stripe_price_id, data.plan.id),
        }),
      ]);

      if (!account || !plan) return;

      const subscription = await stripe.subscriptions.retrieve(data.id);

      await db.insert(subscriptions).values({
        account_id: account.id,
        plan_id: plan.id,
        stripe_subscription_id: data.id,
        start_date: new Date(data.current_period_start * 1000),
        end_date: new Date(
          data.current_period_end ? data.current_period_end * 1000 : null
        ),
        status: subscription.status,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async handleUpdated(data) {
    try {
      const [account, plan] = await Promise.all([
        db.query.accounts.findFirst({
          where: eq(accounts.stripe_customer_id, data.customer),
        }),
        db.query.plans.findFirst({
          where: eq(plans.stripe_price_id, data.plan.id),
        }),
      ]);

      if (!account || !plan) return;

      await db
        .update(subscriptions)
        .set({
          plan_id: plan.id,
          start_date: new Date(data.current_period_start * 1000),
          end_date: new Date(
            data.current_period_end ? data.current_period_end * 1000 : null
          ),
          status: data.status,
          cancel_at_period_end: data.cancel_at_period_end,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(subscriptions.stripe_subscription_id, data.id));
    } catch (error) {
      console.log(error);
    }
  }

  static async handleDeleted(data) {
    try {
      const [account, plan] = await Promise.all([
        db.query.accounts.findFirst({
          where: eq(accounts.stripe_customer_id, data.customer),
        }),
        db.query.plans.findFirst({
          where: eq(plans.stripe_price_id, data.plan.id),
        }),
      ]);

      if (!account || !plan) return;

      await db
        .update(subscriptions)
        .set({
          plan_id: plan.id,
          start_date: new Date(data.current_period_start * 1000),
          end_date: new Date(
            data.current_period_end ? data.current_period_end * 1000 : null
          ),
          ended_at: new Date(data.ended_at ? data.ended_at * 1000 : null),
          status: data.status,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(subscriptions.stripe_subscription_id, data.id));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = SubscriptionsService;
