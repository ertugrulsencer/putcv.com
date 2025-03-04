const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, and, desc, sql } = require("drizzle-orm");
const { resumes, educations } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");

class EducationsService {
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

      const new_education = await db
        .insert(educations)
        .values({
          resume_id: resume.id,
          title: data.title,
          institution_name: data?.institution_name,
          degree: data?.degree,
          location: data?.location,
          description: data?.description,
          start_date: data?.start_date,
          end_date: data?.end_date,
          currently: data?.currently,
          is_active: data?.is_active,
          sort_order: sql`(
            SELECT COALESCE(MAX(${educations.sort_order}), 0) + 1
            FROM ${educations}
            WHERE ${educations.resume_id} = ${resume.id})`,
        })
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          new_education: new_education[0],
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
      const list = await db.query.educations.findMany({
        where: eq(educations.resume_id, resume_id),
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

  static async detail(resume_id, education_id, account, config) {
    try {
      const detail = await db.query.educations.findFirst({
        where: and(
          eq(educations.resume_id, resume_id),
          eq(educations.id, education_id)
        ),
      });

      if (!detail)
        return {
          code: 404,
          severity: "error",
          message: "educationNotFound",
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

  static async update(resume_id, education_id, data, account, config) {
    try {
      const education = await db.query.educations.findFirst({
        where: and(
          eq(educations.resume_id, resume_id),
          eq(educations.id, education_id)
        ),
      });

      if (!education)
        return {
          code: 404,
          severity: "error",
          message: "educationNotFound",
        };

      const update_education = await db
        .update(educations)
        .set({
          title: data.title,
          institution_name: data?.institution_name,
          degree: data?.degree,
          location: data?.location,
          description: data?.description,
          start_date: data?.start_date,
          end_date: data?.end_date,
          currently: data?.currently,
          is_active: data?.is_active,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(educations.id, education.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_education: update_education[0],
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
      const [first_education, second_education] = await Promise.all([
        db.query.educations.findFirst({
          where: and(
            eq(educations.resume_id, resume_id),
            eq(educations.id, data.first_education_id)
          ),
        }),
        db.query.educations.findFirst({
          where: and(
            eq(educations.resume_id, resume_id),
            eq(educations.id, data.second_education_id)
          ),
        }),
      ]);

      if (!first_education || !second_education)
        return {
          code: 404,
          severity: "error",
          message: "educationNotFound",
        };

      const swap_educations = await db.transaction(async (tx) => {
        const swapped_first_education = await tx
          .update(educations)
          .set({
            sort_order: second_education.sort_order,
          })
          .where(eq(educations.id, first_education.id))
          .returning();
        const swapped_second_education = await tx
          .update(educations)
          .set({
            sort_order: first_education.sort_order,
          })
          .where(eq(educations.id, second_education.id))
          .returning();
        return {
          swapped_second_education,
          swapped_first_education,
        };
      });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          swapped_educations: swap_educations,
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

  static async delete(resume_id, education_id, account, config) {
    try {
      const education = await db.query.educations.findFirst({
        where: and(
          eq(educations.resume_id, resume_id),
          eq(educations.id, education_id)
        ),
      });

      if (!education)
        return {
          code: 404,
          severity: "error",
          message: "educationNotFound",
        };

      const delete_education = await db
        .delete(educations)
        .where(eq(educations.id, education.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          deleted_education: delete_education[0],
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

module.exports = EducationsService;
