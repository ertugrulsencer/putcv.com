const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, and, desc, sql } = require("drizzle-orm");
const { resumes, skills } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");

class SkillsService {
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

      const new_skill = await db
        .insert(skills)
        .values({
          resume_id: resume.id,
          skill_name: data.skill_name,
          tags: data?.tags,
          is_active: data?.is_active,
          sort_order: sql`(
            SELECT COALESCE(MAX(${skills.sort_order}), 0) + 1
            FROM ${skills}
            WHERE ${skills.resume_id} = ${resume.id})`,
        })
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          new_skill: new_skill[0],
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
      const list = await db.query.skills.findMany({
        where: eq(skills.resume_id, resume_id),
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

  static async detail(resume_id, skill_id, account, config) {
    try {
      const detail = await db.query.skills.findFirst({
        where: and(eq(skills.resume_id, resume_id), eq(skills.id, skill_id)),
      });

      if (!detail)
        return {
          code: 404,
          severity: "error",
          message: "skillNotFound",
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

  static async update(resume_id, skill_id, data, account, config) {
    try {
      const skill = await db.query.skills.findFirst({
        where: and(eq(skills.resume_id, resume_id), eq(skills.id, skill_id)),
      });

      if (!skill)
        return {
          code: 404,
          severity: "error",
          message: "skillNotFound",
        };

      const update_skill = await db
        .update(skills)
        .set({
          skill_name: data.skill_name,
          tags: data?.tags,
          is_active: data?.is_active,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(skills.id, skill.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_skill: update_skill[0],
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
      const [first_skill, second_skill] = await Promise.all([
        db.query.skills.findFirst({
          where: and(
            eq(skills.resume_id, resume_id),
            eq(skills.id, data.first_skill_id)
          ),
        }),
        db.query.skills.findFirst({
          where: and(
            eq(skills.resume_id, resume_id),
            eq(skills.id, data.second_skill_id)
          ),
        }),
      ]);

      if (!first_skill || !second_skill)
        return {
          code: 404,
          severity: "error",
          message: "skillNotFound",
        };

      const swap_skills = await db.transaction(async (tx) => {
        const swapped_first_skill = await tx
          .update(skills)
          .set({
            sort_order: second_skill.sort_order,
          })
          .where(eq(skills.id, first_skill.id))
          .returning();
        const swapped_second_skill = await tx
          .update(skills)
          .set({
            sort_order: first_skill.sort_order,
          })
          .where(eq(skills.id, second_skill.id))
          .returning();
        return {
          swapped_second_skill,
          swapped_first_skill,
        };
      });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          swapped_skills: swap_skills,
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

  static async delete(resume_id, skill_id, account, config) {
    try {
      const skill = await db.query.skills.findFirst({
        where: and(eq(skills.resume_id, resume_id), eq(skills.id, skill_id)),
      });

      if (!skill)
        return {
          code: 404,
          severity: "error",
          message: "skillNotFound",
        };

      const delete_skill = await db
        .delete(skills)
        .where(eq(skills.id, skill.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          deleted_skill: delete_skill[0],
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

module.exports = SkillsService;
