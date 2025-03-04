const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, and, desc, sql } = require("drizzle-orm");
const { resumes, experiences } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");

class ExperiencesService {
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

      const new_experience = await db
        .insert(experiences)
        .values({
          resume_id: resume.id,
          title: data.title,
          description: data?.description,
          company: data?.company,
          location: data?.location,
          start_date: data?.start_date,
          end_date: data?.end_date,
          is_active: data?.is_active,
          sort_order: sql`(
            SELECT COALESCE(MAX(${experiences.sort_order}), 0) + 1
            FROM ${experiences}
            WHERE ${experiences.resume_id} = ${resume.id})`,
        })
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          new_experience: new_experience[0],
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
      const list = await db.query.experiences.findMany({
        where: eq(experiences.resume_id, resume_id),
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

  static async detail(resume_id, experience_id, account, config) {
    try {
      const detail = await db.query.experiences.findFirst({
        where: and(
          eq(experiences.resume_id, resume_id),
          eq(experiences.id, experience_id)
        ),
      });

      if (!detail)
        return {
          code: 404,
          severity: "error",
          message: "experienceNotFound",
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

  static async update(resume_id, experience_id, data, account, config) {
    try {
      const experience = await db.query.experiences.findFirst({
        where: and(
          eq(experiences.resume_id, resume_id),
          eq(experiences.id, experience_id)
        ),
      });

      if (!experience)
        return {
          code: 404,
          severity: "error",
          message: "experienceNotFound",
        };

      const update_experience = await db
        .update(experiences)
        .set({
          title: data.title,
          description: data?.description,
          company: data?.company,
          location: data?.location,
          start_date: data?.start_date,
          end_date: data?.end_date,
          is_active: data?.is_active,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(experiences.id, experience.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_experience: update_experience[0],
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
      const [first_experience, second_experience] = await Promise.all([
        db.query.experiences.findFirst({
          where: and(
            eq(experiences.resume_id, resume_id),
            eq(experiences.id, data.first_experience_id)
          ),
        }),
        db.query.experiences.findFirst({
          where: and(
            eq(experiences.resume_id, resume_id),
            eq(experiences.id, data.second_experience_id)
          ),
        }),
      ]);

      if (!first_experience || !second_experience)
        return {
          code: 404,
          severity: "error",
          message: "experienceNotFound",
        };

      const swap_experiences = await db.transaction(async (tx) => {
        const swapped_first_experience = await tx
          .update(experiences)
          .set({
            sort_order: second_experience.sort_order,
          })
          .where(eq(experiences.id, first_experience.id))
          .returning();
        const swapped_second_experience = await tx
          .update(experiences)
          .set({
            sort_order: first_experience.sort_order,
          })
          .where(eq(experiences.id, second_experience.id))
          .returning();
        return {
          swapped_second_experience,
          swapped_first_experience,
        };
      });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          swapped_experiences: swap_experiences,
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

  static async delete(resume_id, experience_id, account, config) {
    try {
      const experience = await db.query.experiences.findFirst({
        where: and(
          eq(experiences.resume_id, resume_id),
          eq(experiences.id, experience_id)
        ),
      });

      if (!experience)
        return {
          code: 404,
          severity: "error",
          message: "experienceNotFound",
        };

      const delete_experience = await db
        .delete(experiences)
        .where(eq(experiences.id, experience.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          deleted_experience: delete_experience[0],
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

module.exports = ExperiencesService;
