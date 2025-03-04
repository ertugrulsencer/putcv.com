const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, sql } = require("drizzle-orm");
const { accounts } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");
const { default: axios } = require("axios");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class AccountService {
  static async register(data, config) {
    try {
      const check_account = await db.query.accounts.findFirst({
        where: eq(accounts.email, data.email),
      });
      if (check_account)
        return {
          code: 409,
          severity: "warning",
          message: "emailExists",
        };

      const password_hash = await bcrypt.hash(data.password, 10);
      const email_verification_token = this.createEmailVerificationToken();

      const stripe_customer = await stripe.customers.create({
        name: `${data.first_name} ${data.last_name}`,
        email: data.email,
      });

      const new_account = await db
        .insert(accounts)
        .values({
          stripe_customer_id: stripe_customer.id,
          photo_url: data.photo_url,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password_hash,
          email_verification_token,
        })
        .returning({
          id: accounts.id,
          photo_url: accounts.photo_url,
          first_name: accounts.first_name,
          last_name: accounts.last_name,
          email: accounts.email,
          status: accounts.status,
        });

      const mail_content = await ejs.renderFile(
        "./src/templates/verification.ejs",
        {
          BASE: process.env.BASE,
          account: new_account[0],
          email_verification_token,
          subject: i18nGeneral.emailVerificationSubject[config.lang],
          content: i18nGeneral.emailVerificationContent[config.lang],
        }
      );

      sendEmailMessage({
        from: "teknoertugrul@gmail.com",
        to: data.email,
        subject: i18nGeneral.emailVerificationSubject[config.lang],
        html: mail_content,
      });

      const access_token = this.createAccessToken(new_account[0].id);

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          new_account: new_account[0],
          access_token,
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

  static async verify(token, config) {
    try {
      try {
        await jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        if (error.name === "TokenExpiredError")
          return {
            code: 410,
            severity: "warning",
            message: "expired",
          };
        return {
          code: 400,
          severity: "error",
          message: "tokenError",
        };
      }

      const account = await db
        .select()
        .from(accounts)
        .where(eq(accounts.email_verification_token, token));

      if (!account[0])
        return {
          code: 404,
          severity: "warning",
          message: "accountNotFound",
        };

      const updated_account = await db
        .update(accounts)
        .set({
          status: "VERIFIED",
          verified_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(accounts.email_verification_token, token))
        .returning({
          id: accounts.id,
          photo_url: accounts.photo_url,
          first_name: accounts.first_name,
          last_name: accounts.last_name,
          email: accounts.email,
          status: accounts.status,
        });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_account: updated_account[0],
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

  static async login(data, config) {
    try {
      const account = await db.query.accounts.findFirst({
        columns: {
          id: true,
          photo_url: true,
          first_name: true,
          last_name: true,
          email: true,
          password_hash: true,
          status: true,
        },
        with: { subscription: { with: { plan: true } } },
        where: eq(accounts.email, data.email),
      });

      if (!account)
        return {
          code: 400,
          severity: "warning",
          message: "invalidEmail",
        };

      if (!account.password_hash)
        return {
          code: 400,
          severity: "warning",
          message: "tryGoogleAuth",
        };

      const check_password = await bcrypt.compare(
        data.password,
        account.password_hash
      );

      if (!check_password)
        return {
          code: 400,
          severity: "warning",
          message: "invalidPassword",
        };

      if (account.status === "BANNED")
        return {
          code: 403,
          severity: "warning",
          message: "bannedAccount",
        };

      db.update(accounts)
        .set({ last_login: sql`CURRENT_TIMESTAMP` })
        .where(eq(accounts.id, account.id))
        .execute();

      const access_token = this.createAccessToken(account.id);

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          account: account,
          access_token,
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

  static async googleAuth(data, config) {
    try {
      let google_account_informations;
      try {
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${data.google_access_token}`
        );
        google_account_informations = response.data;
      } catch (error) {
        return {
          code: 400,
          severity: "error",
          message: "invalidToken",
          error,
        };
      }
      const check_account = await db.query.accounts.findFirst({
        columns: {
          id: true,
          photo_url: true,
          first_name: true,
          last_name: true,
          email: true,
          status: true,
        },
        with: { subscription: { with: { plan: true } } },
        where: eq(accounts.email, google_account_informations.email),
      });
      if (check_account) {
        if (check_account.status === "BANNED")
          return {
            code: 403,
            severity: "warning",
            message: "bannedAccount",
          };

        db.update(accounts)
          .set({ last_login: sql`CURRENT_TIMESTAMP` })
          .where(eq(accounts.id, check_account.id))
          .execute();

        const access_token = this.createAccessToken(check_account.id);
        return {
          code: 201,
          severity: "success",
          message: "success_login",
          data: {
            account: check_account,
            access_token,
          },
        };
      }

      const stripe_customer = await stripe.customers.create({
        name: `${google_account_informations.given_name} ${google_account_informations.family_name}`,
        email: google_account_informations.email,
      });

      const new_account = await db
        .insert(accounts)
        .values({
          stripe_customer_id: stripe_customer.id,
          photo_url: google_account_informations.picture,
          first_name: google_account_informations.given_name,
          last_name: google_account_informations.family_name,
          email: google_account_informations.email,
          status: "VERIFIED",
          source: "GOOGLE",
          verified_at: sql`CURRENT_TIMESTAMP`,
        })
        .returning({
          id: accounts.id,
          photo_url: accounts.photo_url,
          first_name: accounts.first_name,
          last_name: accounts.last_name,
          email: accounts.email,
          status: accounts.status,
        });

      const access_token = this.createAccessToken(new_account[0].id);

      return {
        code: 201,
        severity: "success",
        message: "success_register",
        data: {
          new_account: new_account[0],
          access_token,
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

  static async forgetPassword(data, config) {
    try {
      const account = await db
        .select()
        .from(accounts)
        .where(eq(accounts.email, data.email));

      if (!account[0])
        return {
          code: 404,
          severity: "warning",
          message: "notFound",
        };

      if (account[0].status === "BANNED")
        return {
          code: 403,
          severity: "warning",
          message: "bannedAccount",
        };

      const reset_password_token = this.createResetPasswordToken();

      await db
        .update(accounts)
        .set({ reset_password_token })
        .where(eq(accounts.id, account[0].id));

      const mail_content = await ejs.renderFile(
        "./src/templates/forget_password.ejs",
        {
          BASE: process.env.BASE,
          reset_password_token,
          subject: i18nGeneral.resetPasswordSubject[config.lang],
          content: i18nGeneral.resetPasswordContent[config.lang],
        }
      );

      sendEmailMessage({
        from: "teknoertugrul@gmail.com",
        to: data.email,
        subject: i18nGeneral.resetPasswordSubject[config.lang],
        html: mail_content,
      });

      return {
        code: 201,
        severity: "success",
        message: "success",
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

  static async resetPassword(token, data, config) {
    try {
      try {
        await jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        if (error.name === "TokenExpiredError")
          return {
            code: 410,
            severity: "warning",
            message: "expired",
          };
        return {
          code: 400,
          severity: "error",
          message: "tokenError",
        };
      }

      const account = await db
        .select()
        .from(accounts)
        .where(eq(accounts.reset_password_token, token));

      if (!account[0]) {
        return {
          code: 404,
          severity: "warning",
          message: "accountNotFound",
        };
      }

      const password_hash = await bcrypt.hash(data.password, 10);

      const updated_account = await db
        .update(accounts)
        .set({ password_hash, reset_password_token: null })
        .where(eq(accounts.reset_password_token, token))
        .returning({
          id: accounts.id,
          first_name: accounts.first_name,
          last_name: accounts.last_name,
          email: accounts.email,
          status: accounts.status,
        });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_account: updated_account[0],
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

  static async update(data, account, config) {
    try {
      const updated_account = await db
        .update(accounts)
        .set({
          first_name: data.first_name,
          last_name: data.last_name,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(accounts.id, account.id))
        .returning({
          id: accounts.id,
          first_name: accounts.first_name,
          last_name: accounts.last_name,
          email: accounts.email,
          status: accounts.status,
        });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_account: updated_account[0],
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

  static async changePassword(data, account, config) {
    try {
      const check_password = await bcrypt.compare(
        data.password,
        account.password_hash
      );
      if (!check_password)
        return {
          code: 400,
          severity: "warning",
          message: "invalidPassword",
        };

      const password_hash = await bcrypt.hash(data.new_password, 10);
      const updated_account = await db
        .update(accounts)
        .set({
          password_hash,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(accounts.id, account.id))
        .returning({
          id: accounts.id,
          first_name: accounts.first_name,
          last_name: accounts.last_name,
          email: accounts.email,
          status: accounts.status,
        });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_account: updated_account[0],
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

  static createEmailVerificationToken() {
    return jwt.sign(
      {
        token: CryptoJS.lib.WordArray.random(32).toString(),
        type: "email_verification",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  }

  static createResetPasswordToken() {
    return jwt.sign(
      {
        token: CryptoJS.lib.WordArray.random(32).toString(),
        type: "reset_password",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  }

  static createAccessToken(account_id) {
    return jwt.sign(
      {
        account_id,
        type: "access",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "6h",
      }
    );
  }
}

module.exports = AccountService;
