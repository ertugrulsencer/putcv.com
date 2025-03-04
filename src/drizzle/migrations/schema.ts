import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  boolean,
  smallint,
  timestamp,
  smallserial,
  char,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const accountSourceEnum = pgEnum("account_source_enum", [
  "APP",
  "GOOGLE",
  "APPLE",
]);
export const accountStatusEnum = pgEnum("account_status_enum", [
  "NEW",
  "VERIFIED",
  "BANNED",
]);

export const experiences = pgTable("experiences", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  resumeId: uuid("resume_id").notNull(),
  title: varchar({ length: 100 }).notNull(),
  description: text(),
  company: varchar({ length: 150 }),
  location: varchar({ length: 50 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: smallint("sort_order").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const countries = pgTable("countries", {
  id: smallserial().primaryKey().notNull(),
  code: char({ length: 2 }).notNull(),
  countryName: varchar("country_name", { length: 50 }).notNull(),
  phone: varchar({ length: 5 }).notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    photoUrl: varchar("photo_url", { length: 150 }),
    firstName: varchar("first_name", { length: 50 }),
    lastName: varchar("last_name", { length: 30 }).notNull(),
    email: varchar({ length: 100 }).notNull(),
    passwordHash: varchar("password_hash", { length: 150 }),
    status: accountStatusEnum().default("NEW").notNull(),
    source: accountSourceEnum().default("APP").notNull(),
    emailVerificationToken: varchar("email_verification_token").notNull(),
    resetPasswordToken: varchar("reset_password_token"),
    verifiedAt: timestamp("verified_at", { mode: "string" }),
    lastLogin: timestamp("last_login", { mode: "string" })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      accountsEmailUnique: unique("accounts_email_unique").on(table.email),
    };
  }
);

export const educations = pgTable("educations", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  resumeId: uuid("resume_id").notNull(),
  institutionName: varchar("institution_name", { length: 100 }).notNull(),
  degree: varchar({ length: 50 }),
  location: varchar({ length: 50 }),
  description: text(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  currently: boolean().default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: smallint("sort_order").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const personelInformations = pgTable("personel_informations", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  resumeId: uuid("resume_id").notNull(),
  photoUrl: varchar("photo_url", { length: 150 }),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 30 }).notNull(),
  email: varchar({ length: 100 }),
  phone: varchar({ length: 30 }),
  dateForBirth: date("date_of_birth"),
  nationality: varchar({ length: 50 }),
  address: varchar({ length: 150 }),
  city: varchar({ length: 30 }),
  country: smallint(),
  bio: text(),
});
