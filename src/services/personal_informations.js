const i18nGeneral = require("../i18n/General.json");
const { sendEmailMessage } = require("../mq/queues/email");
const db = require("../drizzle");
const { eq, and, desc, sql } = require("drizzle-orm");
const { resumes, personal_informations } = require("../drizzle/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const CryptoJS = require("crypto-js");

class PersonalInformationsService {
  static async detail(personal_informations_id, account, config) {
    try {
      const detail = await db.query.personal_informations.findFirst({
        where: and(eq(resumes.id, personal_informations_id)),
      });

      if (!detail)
        return {
          code: 404,
          severity: "error",
          message: "personalInformationsNotFound",
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

  static async update(personal_informations_id, data, account, config) {
    try {
      const _personal_informations =
        await db.query.personal_informations.findFirst({
          columns: { id: true },
          where: and(eq(personal_informations.id, personal_informations_id)),
        });
      if (!_personal_informations)
        return {
          code: 404,
          severity: "error",
          message: "personalInformationsNotFound",
        };

      const update_personal_informations = await db
        .update(personal_informations)
        .set({
          photo_url: data?.photo_url,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data?.email,
          phone: data?.phone,
          date_of_birth: data?.date_of_birth,
          nationality: data?.nationality,
          address: data?.address,
          city: data?.city,
          country: data?.country,
          bio: data?.bio,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(personal_informations.id, _personal_informations.id))
        .returning();

      return {
        code: 201,
        severity: "success",
        message: "success",
        data: {
          updated_personal_informations: update_personal_informations[0],
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

module.exports = PersonalInformationsService;
