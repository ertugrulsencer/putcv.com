const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, and, desc, sql } = require("drizzle-orm");
const { cover_letters } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");

class CoverLettersService {
  static async create(data, account, config) {
    try {
      if (account.status === "NEW")
        return {
          code: 403,
          severity: "warning",
          message: "verifyAccount",
        };

      const new_cover_letter = await db
        .insert(cover_letters)
        .values({
          account_id: account.id,
          template_id: data?.template_id,
          title: data.title,
          personal_informations: data?.personal_informations,
          company_informations: data?.company_informations,
          content: data?.content,
          date: data?.date,
        })
        .returning();

      const mail_content = await ejs.renderFile(
        "./src/templates/new_cover_letter.ejs",
        {
          BASE: process.env.BASE,
          cover_letter: new_cover_letter[0],
          account,
          subject: i18nGeneral.newCoverLetterSubject[config.lang],
          content: i18nGeneral.newCoverLetterContent[config.lang],
        }
      );

      sendEmailMessage({
        from: "teknoertugrul@gmail.com",
        to: account.email,
        subject: i18nGeneral.newCoverLetterSubject[config.lang],
        html: mail_content,
      });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          new_cover_letter: new_cover_letter[0],
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

  static async list(account, config) {
    try {
      const list = await db.query.cover_letters.findMany({
        columns: {
          id: true,
          title: true,
          created_at: true,
        },
        with: {
          template: true,
        },
        where: eq(cover_letters.account_id, account.id),
        orderBy: desc(cover_letters.created_at),
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

  static async detail(cover_letter_id, account, config) {
    try {
      const detail = await db.query.cover_letters.findFirst({
        where: and(
          eq(cover_letters.account_id, account.id),
          eq(cover_letters.id, cover_letter_id)
        ),
        with: {
          template: true,
        },
      });

      if (!detail)
        return {
          code: 404,
          severity: "error",
          message: "coverLetterNotFound",
        };

      return {
        code: 200,
        severity: "success",
        message: "success",
        data: {
          detail,
        },
      };
    } catch (error) {
      console.log(error);

      return {
        code: 500,
        severity: "error",
        message: "error",
        error,
      };
    }
  }

  static async update(cover_letter_id, data, account, config) {
    try {
      const cover_letter = await db.query.cover_letters.findFirst({
        columns: { id: true },
        where: and(
          eq(cover_letters.account_id, account.id),
          eq(cover_letters.id, cover_letter_id)
        ),
      });
      if (!cover_letter)
        return {
          code: 404,
          severity: "error",
          message: "coverLetterNotFound",
        };

      const update_cover_letter = await db
        .update(cover_letters)
        .set({
          template_id: data?.template_id,
          title: data.title,
          personal_informations: data?.personal_informations,
          company_informations: data?.company_informations,
          content: data?.content,
          date: data?.date,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(cover_letters.id, cover_letter.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_cover_letter: update_cover_letter[0],
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

  static async delete(cover_letter_id, account, config) {
    try {
      const cover_letter = await db.query.cover_letters.findFirst({
        columns: { id: true },
        where: and(
          eq(cover_letters.account_id, account.id),
          eq(cover_letters.id, cover_letter_id)
        ),
      });
      if (!cover_letter)
        return {
          code: 404,
          severity: "error",
          message: "coverLetterNotFound",
        };

      const delete_cover_letter = await db
        .delete(cover_letters)
        .where(eq(cover_letters.id, cover_letter.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          deleted_cover_letter: delete_cover_letter[0],
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
}

module.exports = CoverLettersService;
