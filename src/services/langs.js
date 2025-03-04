const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, and, desc, sql } = require("drizzle-orm");
const { resumes, langs } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");

class LangsService {
  static async create(resume_id, data, account, config) {
    try {
      const resume = await db.query.resumes.findFirst({
        where: and(
          eq(resumes.account_id, account.id),
          eq(resumes.id, resume_id)
        ),
      });
      if (!resume)
        return {
          code: 404,
          severity: "error",
          message: "resumeNotFound",
        };

      const new_lang = await db
        .insert(langs)
        .values({
          resume_id: resume.id,
          lang_name: data.lang_name,
          degree: data?.degree,
          is_active: data?.is_active,
          sort_order: sql`(
            SELECT COALESCE(MAX(${langs.sort_order}), 0) + 1
            FROM ${langs}
            WHERE ${langs.resume_id} = ${resume.id})`,
        })
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          new_lang: new_lang[0],
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

  static async list(resume_id, account, config) {
    try {
      const list = await db.query.langs.findMany({
        where: eq(langs.resume_id, resume_id),
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

  static async detail(resume_id, lang_id, account, config) {
    try {
      const detail = await db.query.langs.findFirst({
        where: and(eq(langs.resume_id, resume_id), eq(langs.id, lang_id)),
      });

      if (!detail)
        return {
          code: 404,
          severity: "error",
          message: "langNotFound",
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
      return {
        code: 500,
        severity: "error",
        message: "error",
        error,
      };
    }
  }

  static async update(resume_id, lang_id, data, account, config) {
    try {
      const lang = await db.query.langs.findFirst({
        where: and(eq(langs.resume_id, resume_id), eq(langs.id, lang_id)),
      });

      if (!lang)
        return {
          code: 404,
          severity: "error",
          message: "langNotFound",
        };

      const update_lang = await db
        .update(langs)
        .set({
          lang_name: data.lang_name,
          degree: data?.degree,
          is_active: data?.is_active,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(langs.id, lang.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_lang: update_lang[0],
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

  static async swap(resume_id, data, account, config) {
    try {
      const [first_lang, second_lang] = await Promise.all([
        db.query.langs.findFirst({
          where: and(
            eq(langs.resume_id, resume_id),
            eq(langs.id, data.first_lang_id)
          ),
        }),
        db.query.langs.findFirst({
          where: and(
            eq(langs.resume_id, resume_id),
            eq(langs.id, data.second_lang_id)
          ),
        }),
      ]);

      if (!first_lang || !second_lang)
        return {
          code: 404,
          severity: "error",
          message: "langNotFound",
        };

      const swap_langs = await db.transaction(async (tx) => {
        const swapped_first_lang = await tx
          .update(langs)
          .set({
            sort_order: second_lang.sort_order,
          })
          .where(eq(langs.id, first_lang.id))
          .returning();
        const swapped_second_lang = await tx
          .update(langs)
          .set({
            sort_order: first_lang.sort_order,
          })
          .where(eq(langs.id, second_lang.id))
          .returning();
        return {
          swapped_second_lang,
          swapped_first_lang,
        };
      });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          swapped_langs: swap_langs,
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

  static async delete(resume_id, lang_id, account, config) {
    try {
      const lang = await db.query.langs.findFirst({
        where: and(eq(langs.resume_id, resume_id), eq(langs.id, lang_id)),
      });

      if (!lang)
        return {
          code: 404,
          severity: "error",
          message: "langNotFound",
        };

      const delete_lang = await db
        .delete(langs)
        .where(eq(langs.id, lang.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          deleted_lang: delete_lang[0],
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

module.exports = LangsService;
