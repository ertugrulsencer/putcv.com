const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, and, desc, sql } = require("drizzle-orm");
const { resumes, projects } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");

class ProjectsService {
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

      const new_project = await db
        .insert(projects)
        .values({
          resume_id: resume.id,
          title: data.title,
          role: data?.role,
          location: data?.location,
          description: data?.description,
          link: data?.link,
          start_date: data?.start_date,
          end_date: data?.end_date,
          currently: data?.currently,
          is_active: data?.is_active,
          sort_order: sql`(
            SELECT COALESCE(MAX(${projects.sort_order}), 0) + 1
            FROM ${projects}
            WHERE ${projects.resume_id} = ${resume.id})`,
        })
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          new_project: new_project[0],
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
      const list = await db.query.projects.findMany({
        where: eq(projects.resume_id, resume_id),
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

  static async detail(resume_id, project_id, account, config) {
    try {
      const detail = await db.query.projects.findFirst({
        where: and(
          eq(projects.resume_id, resume_id),
          eq(projects.id, project_id)
        ),
      });

      if (!detail)
        return {
          code: 404,
          severity: "error",
          message: "projectNotFound",
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

  static async update(resume_id, project_id, data, account, config) {
    try {
      const project = await db.query.projects.findFirst({
        where: and(
          eq(projects.resume_id, resume_id),
          eq(projects.id, project_id)
        ),
      });

      if (!project)
        return {
          code: 404,
          severity: "error",
          message: "projectNotFound",
        };

      const update_project = await db
        .update(projects)
        .set({
          title: data.title,
          role: data?.role,
          location: data?.location,
          description: data?.description,
          link: data?.link,
          start_date: data?.start_date,
          end_date: data?.end_date,
          currently: data?.currently,
          is_active: data?.is_active,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(projects.id, project.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_project: update_project[0],
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
      const [first_project, second_project] = await Promise.all([
        db.query.projects.findFirst({
          where: and(
            eq(projects.resume_id, resume_id),
            eq(projects.id, data.first_project_id)
          ),
        }),
        db.query.projects.findFirst({
          where: and(
            eq(projects.resume_id, resume_id),
            eq(projects.id, data.second_project_id)
          ),
        }),
      ]);

      if (!first_project || !second_project)
        return {
          code: 404,
          severity: "error",
          message: "projectNotFound",
        };

      const swap_projects = await db.transaction(async (tx) => {
        const swapped_first_project = await tx
          .update(projects)
          .set({
            sort_order: second_project.sort_order,
          })
          .where(eq(projects.id, first_project.id))
          .returning();
        const swapped_second_project = await tx
          .update(projects)
          .set({
            sort_order: first_project.sort_order,
          })
          .where(eq(projects.id, second_project.id))
          .returning();
        return {
          swapped_second_project,
          swapped_first_project,
        };
      });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          swapped_projects: swap_projects,
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

  static async delete(resume_id, project_id, account, config) {
    try {
      const project = await db.query.projects.findFirst({
        where: and(
          eq(projects.resume_id, resume_id),
          eq(projects.id, project_id)
        ),
      });

      if (!project)
        return {
          code: 404,
          severity: "error",
          message: "projectNotFound",
        };

      const delete_project = await db
        .delete(projects)
        .where(eq(projects.id, project.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          deleted_project: delete_project[0],
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

module.exports = ProjectsService;
