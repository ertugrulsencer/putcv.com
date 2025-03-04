const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, and, desc, sql } = require("drizzle-orm");
const { resumes, references } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");

class ReferencesService {
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

      const new_reference = await db
        .insert(references)
        .values({
          resume_id: resume.id,
          company: data.company,
          person: data?.person,
          contact_email: data?.contact_email,
          contact_phone: data?.contact_phone,
          description: data?.description,
          is_active: data?.is_active,
          sort_order: sql`(
            SELECT COALESCE(MAX(${references.sort_order}), 0) + 1
            FROM ${references}
            WHERE ${references.resume_id} = ${resume.id})`,
        })
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          new_reference: new_reference[0],
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
      const list = await db.query.references.findMany({
        where: eq(references.resume_id, resume_id),
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

  static async detail(resume_id, reference_id, account, config) {
    try {
      const detail = await db.query.references.findFirst({
        where: and(
          eq(references.resume_id, resume_id),
          eq(references.id, reference_id)
        ),
      });

      if (!detail)
        return {
          code: 404,
          severity: "error",
          message: "referenceNotFound",
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

  static async update(resume_id, reference_id, data, account, config) {
    try {
      const reference = await db.query.references.findFirst({
        where: and(
          eq(references.resume_id, resume_id),
          eq(references.id, reference_id)
        ),
      });

      if (!reference)
        return {
          code: 404,
          severity: "error",
          message: "referenceNotFound",
        };

      const update_reference = await db
        .update(references)
        .set({
          company: data.company,
          person: data?.person,
          contact_email: data?.contact_email,
          contact_phone: data?.contact_phone,
          description: data?.description,
          is_active: data?.is_active,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(references.id, reference.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_reference: update_reference[0],
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
      const [first_reference, second_reference] = await Promise.all([
        db.query.references.findFirst({
          where: and(
            eq(references.resume_id, resume_id),
            eq(references.id, data.first_reference_id)
          ),
        }),
        db.query.references.findFirst({
          where: and(
            eq(references.resume_id, resume_id),
            eq(references.id, data.second_reference_id)
          ),
        }),
      ]);

      if (!first_reference || !second_reference)
        return {
          code: 404,
          severity: "error",
          message: "referenceNotFound",
        };

      const swap_references = await db.transaction(async (tx) => {
        const swapped_first_reference = await tx
          .update(references)
          .set({
            sort_order: second_reference.sort_order,
          })
          .where(eq(references.id, first_reference.id))
          .returning();
        const swapped_second_reference = await tx
          .update(references)
          .set({
            sort_order: first_reference.sort_order,
          })
          .where(eq(references.id, second_reference.id))
          .returning();
        return {
          swapped_second_reference,
          swapped_first_reference,
        };
      });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          swapped_references: swap_references,
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

  static async delete(resume_id, reference_id, account, config) {
    try {
      const reference = await db.query.references.findFirst({
        where: and(
          eq(references.resume_id, resume_id),
          eq(references.id, reference_id)
        ),
      });

      if (!reference)
        return {
          code: 404,
          severity: "error",
          message: "referenceNotFound",
        };

      const delete_reference = await db
        .delete(references)
        .where(eq(references.id, reference.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          deleted_reference: delete_reference[0],
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

module.exports = ReferencesService;
