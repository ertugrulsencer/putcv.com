const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, and, desc, sql } = require("drizzle-orm");
const { resumes, certificates } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");

class CertificatesService {
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

      const new_certificate = await db
        .insert(certificates)
        .values({
          resume_id: resume.id,
          certificate_name: data.certificate_name,
          authority: data?.authority,
          link: data?.link,
          date: data?.date,
          is_active: data?.is_active,
          sort_order: sql`(
            SELECT COALESCE(MAX(${certificates.sort_order}), 0) + 1
            FROM ${certificates}
            WHERE ${certificates.resume_id} = ${resume.id})`,
        })
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          new_certificate: new_certificate[0],
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
      const list = await db.query.certificates.findMany({
        where: eq(certificates.resume_id, resume_id),
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

  static async detail(resume_id, certificate_id, account, config) {
    try {
      const detail = await db.query.certificates.findFirst({
        where: and(
          eq(certificates.resume_id, resume_id),
          eq(certificates.id, certificate_id)
        ),
      });

      if (!detail)
        return {
          code: 404,
          severity: "error",
          message: "certificateNotFound",
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

  static async update(resume_id, certificate_id, data, account, config) {
    try {
      const certificate = await db.query.certificates.findFirst({
        where: and(
          eq(certificates.resume_id, resume_id),
          eq(certificates.id, certificate_id)
        ),
      });

      if (!certificate)
        return {
          code: 404,
          severity: "error",
          message: "certificateNotFound",
        };

      const update_certificate = await db
        .update(certificates)
        .set({
          certificate_name: data.certificate_name,
          authority: data?.authority,
          link: data?.link,
          date: data?.date,
          is_active: data?.is_active,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(certificates.id, certificate.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_certificate: update_certificate[0],
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
      const [first_certificate, second_certificate] = await Promise.all([
        db.query.certificates.findFirst({
          where: and(
            eq(certificates.resume_id, resume_id),
            eq(certificates.id, data.first_certificate_id)
          ),
        }),
        db.query.certificates.findFirst({
          where: and(
            eq(certificates.resume_id, resume_id),
            eq(certificates.id, data.second_certificate_id)
          ),
        }),
      ]);

      if (!first_certificate || !second_certificate)
        return {
          code: 404,
          severity: "error",
          message: "certificateNotFound",
        };

      const swap_certificates = await db.transaction(async (tx) => {
        const swapped_first_certificate = await tx
          .update(certificates)
          .set({
            sort_order: second_certificate.sort_order,
          })
          .where(eq(certificates.id, first_certificate.id))
          .returning();
        const swapped_second_certificate = await tx
          .update(certificates)
          .set({
            sort_order: first_certificate.sort_order,
          })
          .where(eq(certificates.id, second_certificate.id))
          .returning();
        return {
          swapped_second_certificate,
          swapped_first_certificate,
        };
      });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          swapped_certificates: swap_certificates,
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

  static async delete(resume_id, certificate_id, account, config) {
    try {
      const certificate = await db.query.certificates.findFirst({
        where: and(
          eq(certificates.resume_id, resume_id),
          eq(certificates.id, certificate_id)
        ),
      });

      if (!certificate)
        return {
          code: 404,
          severity: "error",
          message: "certificateNotFound",
        };

      const delete_certificate = await db
        .delete(certificates)
        .where(eq(certificates.id, certificate.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          deleted_certificate: delete_certificate[0],
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

module.exports = CertificatesService;
