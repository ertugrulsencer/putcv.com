const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, and, desc, sql } = require("drizzle-orm");
const { resumes, personal_informations } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");

class ResumeService {
  static async create(data, account, config) {
    try {
      if (account.status === "NEW")
        return {
          code: 403,
          severity: "warning",
          message: "verifyAccount",
        };

      const { new_resume, new_personal_informations } = await db.transaction(
        async (tx) => {
          const new_resume = await tx
            .insert(resumes)
            .values({
              account_id: account.id,
              template_id: data?.template_id,
              title: data.title,
              objective: data?.objective,
              job_title: data?.job_title,
              job_description: data?.job_description,
              status: data.status,
            })
            .returning();
          const new_personal_informations = await tx
            .insert(personal_informations)
            .values({
              resume_id: new_resume[0].id,
              first_name: account.first_name,
              last_name: account.last_name,
              email: account.email,
            })
            .returning();
          return {
            new_resume: new_resume[0],
            new_personal_informations: new_personal_informations[0],
          };
        }
      );

      const mail_content = await ejs.renderFile(
        "./src/templates/new_resume.ejs",
        {
          BASE: process.env.BASE,
          resume: new_resume,
          account,
          subject: i18nGeneral.newResumeSubject[config.lang],
          content: i18nGeneral.newResumeContent[config.lang],
        }
      );

      sendEmailMessage({
        from: "teknoertugrul@gmail.com",
        to: account.email,
        subject: i18nGeneral.newResumeSubject[config.lang],
        html: mail_content,
      });

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          new_resume: {
            ...new_resume,
            personal_informations: new_personal_informations,
          },
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
      const list = await db.query.resumes.findMany({
        columns: {
          id: true,
          title: true,
          status: true,
          created_at: true,
        },
        with: {
          template: true,
        },
        where: eq(resumes.account_id, account.id),
        orderBy: desc(resumes.created_at),
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

  static async detail(resume_id, account, config) {
    try {
      const detail = await db.query.resumes.findFirst({
        where: and(
          eq(resumes.account_id, account.id),
          eq(resumes.id, resume_id)
        ),
        with: {
          template: true,
          personal_informations: true,
          experiences: true,
          educations: true,
          projects: true,
          references: true,
          certificates: true,
          skills: true,
          langs: true,
        },
      });

      if (!detail)
        return {
          code: 404,
          severity: "error",
          message: "resumeNotFound",
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

  static async update(resume_id, data, account, config) {
    try {
      const resume = await db.query.resumes.findFirst({
        columns: { id: true },
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

      const update_resume = await db
        .update(resumes)
        .set({
          template_id: data?.template_id,
          title: data.title,
          objective: data?.objective,
          job_title: data?.job_title,
          job_description: data?.job_description,
          status: data.status,
          custom_url: data?.custom_url,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(resumes.id, resume.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_resume: update_resume[0],
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

  static async delete(resume_id, account, config) {
    try {
      const resume = await db.query.resumes.findFirst({
        columns: { id: true },
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

      const delete_resume = await db
        .delete(resumes)
        .where(eq(resumes.id, resume.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          deleted_resume: delete_resume[0],
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

module.exports = ResumeService;
