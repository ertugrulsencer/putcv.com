const { sql, relations } = require("drizzle-orm");
const {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  timestamp,
  index,
  smallint,
  smallserial,
  numeric,
  char,
  bigint,
  date,
  text,
  boolean,
  jsonb,
} = require("drizzle-orm/pg-core");

const account_status_enum = pgEnum("account_status_enum", [
  "NEW",
  "VERIFIED",
  "BANNED",
]);

const account_source_enum = pgEnum("account_source_enum", [
  "APP",
  "GOOGLE",
  "APPLE",
]);

const template_type_enum = pgEnum("template_type_enum", [
  "RESUME",
  "COVER",
  "RESIGNATION",
]);

const resume_status_enum = pgEnum("resume_status_enum", [
  "PRIVATE",
  "PUBLIC",
  "ARCHIVE",
]);

const countries = pgTable("countries", {
  id: smallserial().primaryKey().notNull(),
  code: char({ length: 2 }).notNull(),
  country_name: varchar({ length: 50 }).notNull(),
  phone: varchar({ length: 5 }).notNull(),
});

const plans = pgTable("plans", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  stripe_price_id: varchar({ length: 100 }).notNull(),
  plan_name: varchar({ length: 30 }).notNull(),
  prices: numeric({ precision: 10, scale: 2 }).notNull(),
  billing_cycle: varchar({ length: 30 }).notNull(),
  description: varchar({ length: 250 }).notNull(),
  features: jsonb(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

const accounts = pgTable(
  "accounts",
  {
    id: uuid()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    stripe_customer_id: varchar({ length: 100 }),
    photo_url: varchar({ length: 150 }),
    first_name: varchar({ length: 50 }),
    last_name: varchar({ length: 30 }).notNull(),
    email: varchar({ length: 100 }).notNull().unique(),
    password_hash: varchar({ length: 150 }),
    status: account_status_enum().notNull().default("NEW"),
    source: account_source_enum().notNull().default("APP"),
    email_verification_token: varchar(200),
    reset_password_token: varchar(200),
    verified_at: timestamp(),
    last_login: timestamp().notNull().defaultNow(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => ({
    idxAccountsEmail: index("idx_accounts_email").on(table.email),
  })
);

const subscriptions = pgTable("subscriptions", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  account_id: uuid()
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  plan_id: uuid()
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  stripe_subscription_id: varchar({ length: 100 }).notNull(),
  start_date: timestamp().notNull(),
  end_date: timestamp(),
  cancel_at_period_end: boolean().default(false),
  ended_at: timestamp(),
  status: varchar("status", { length: 20 }).default("active"),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

const templates = pgTable(
  "templates",
  {
    id: uuid()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    title: varchar({ length: 50 }).notNull(),
    type: template_type_enum().notNull(),
    topic: varchar({ length: 30 }),
    preview_image_url: varchar({ length: 150 }).notNull(),
    is_pro: boolean().notNull().default(false),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => ({
    idxTemplateTopic: index("idx_template_topic").on(table.topic),
  })
);

const resumes = pgTable(
  "resumes",
  {
    id: uuid()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    account_id: uuid()
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    template_id: uuid().references(() => templates.id, {
      onDelete: "set null",
    }),
    title: varchar({ length: 50 }).notNull(),
    objective: varchar({ length: 250 }),
    job_title: varchar({ length: 50 }),
    job_description: varchar({ length: 350 }),
    ats_score: smallint().notNull().default(0),
    status: resume_status_enum().notNull(),
    custom_url: varchar({ length: 50 }).unique(),
    view: bigint({ mode: "number" }).notNull().default(0),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => ({
    idxResumesCustomUrl: index("idx_resumes_custom_url").on(table.custom_url),
  })
);

const personal_informations = pgTable("personel_informations", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  resume_id: uuid()
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),
  photo_url: varchar({ length: 150 }),
  first_name: varchar({ length: 50 }).notNull(),
  last_name: varchar({ length: 30 }).notNull(),
  email: varchar({ length: 100 }),
  phone: varchar({ length: 30 }),
  date_of_birth: date(),
  nationality: varchar({ length: 50 }),
  address: varchar({ length: 150 }),
  city: varchar({ length: 30 }),
  country: smallint().references(() => countries.id, {
    onDelete: "set null",
  }),
  bio: text(),
});

const experiences = pgTable("experiences", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  resume_id: uuid()
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),
  title: varchar({ length: 100 }).notNull(),
  description: text(),
  company: varchar({ length: 150 }),
  location: varchar({ length: 50 }),
  start_date: date(),
  end_date: date(),
  is_active: boolean().notNull().default(true),
  sort_order: smallint().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

const educations = pgTable("educations", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  resume_id: uuid()
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),
  institution_name: varchar({ length: 100 }).notNull(),
  degree: varchar({ length: 50 }),
  location: varchar({ length: 50 }),
  description: text(),
  start_date: date(),
  end_date: date(),
  currently: boolean().notNull().default(false),
  is_active: boolean().notNull().default(true),
  sort_order: smallint().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

const projects = pgTable("projects", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  resume_id: uuid()
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),
  title: varchar({ length: 50 }).notNull(),
  role: varchar({ length: 50 }),
  location: varchar({ length: 50 }),
  description: text(),
  link: varchar({ length: 250 }),
  start_date: date(),
  end_date: date(),
  currently: boolean().notNull().default(false),
  is_active: boolean().notNull().default(true),
  sort_order: smallint().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

const references = pgTable("references", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  resume_id: uuid()
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),
  company: varchar({ length: 150 }).notNull(),
  person: varchar({ length: 50 }),
  contact_email: varchar({ length: 100 }),
  contact_phone: varchar({ length: 30 }),
  description: text(),
  is_active: boolean().notNull().default(true),
  sort_order: smallint().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

const certificates = pgTable("certificates", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  resume_id: uuid()
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),
  certificate_name: varchar({ length: 100 }).notNull(),
  authority: varchar({ length: 100 }),
  link: varchar({ length: 250 }),
  date: date(),
  is_active: boolean().notNull().default(true),
  sort_order: smallint().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

const skills = pgTable("skills", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  resume_id: uuid()
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),
  skill_name: varchar({ length: 50 }).notNull(),
  tags: text().array(),
  is_active: boolean().notNull().default(true),
  sort_order: smallint().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

const langs = pgTable("langs", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  resume_id: uuid()
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),
  lang_name: varchar({ length: 50 }).notNull(),
  degree: smallint(),
  is_active: boolean().notNull().default(true),
  sort_order: smallint().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

const cover_letters = pgTable("cover_letters", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  account_id: uuid()
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  template_id: uuid().references(() => templates.id, { onDelete: "set null" }),
  title: varchar(50).notNull(),
  personal_informations: jsonb(),
  company_informations: jsonb(),
  content: text(),
  date: date(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

const subscriptions_relations = relations(subscriptions, ({ one }) => ({
  account: one(accounts, {
    fields: [subscriptions.account_id],
    references: [accounts.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.plan_id],
    references: [plans.id],
  }),
}));

const account_relations = relations(accounts, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [accounts.id],
    references: [subscriptions.account_id],
  }),
}));

const personal_informations_relations = relations(resumes, ({ one }) => ({
  personal_informations: one(personal_informations, {
    fields: [resumes.id],
    references: [personal_informations.resume_id],
  }),
}));

const experiences_relations = relations(experiences, ({ one }) => ({
  resume: one(resumes, {
    fields: [experiences.resume_id],
    references: [resumes.id],
  }),
}));

const educations_relations = relations(educations, ({ one }) => ({
  resume: one(resumes, {
    fields: [educations.resume_id],
    references: [resumes.id],
  }),
}));

const projects_relations = relations(projects, ({ one }) => ({
  resume: one(resumes, {
    fields: [projects.resume_id],
    references: [resumes.id],
  }),
}));

const references_relations = relations(references, ({ one }) => ({
  resume: one(resumes, {
    fields: [references.resume_id],
    references: [resumes.id],
  }),
}));

const certificates_relations = relations(certificates, ({ one }) => ({
  resume: one(resumes, {
    fields: [certificates.resume_id],
    references: [resumes.id],
  }),
}));

const skills_relations = relations(skills, ({ one }) => ({
  resume: one(resumes, {
    fields: [skills.resume_id],
    references: [resumes.id],
  }),
}));

const langs_relations = relations(langs, ({ one }) => ({
  resume: one(resumes, {
    fields: [langs.resume_id],
    references: [resumes.id],
  }),
}));

const resume_relations = relations(resumes, ({ one, many }) => ({
  account: one(accounts, {
    fields: [resumes.account_id],
    references: [accounts.id],
  }),
  template: one(templates, {
    fields: [resumes.template_id],
    references: [templates.id],
  }),
  experiences: many(experiences),
  educations: many(educations),
  projects: many(projects),
  references: many(references),
  certificates: many(certificates),
  skills: many(skills),
  langs: many(langs),
}));

const cover_letters_relations = relations(cover_letters, ({ one }) => ({
  account: one(accounts, {
    fields: [cover_letters.account_id],
    references: [accounts.id],
  }),
  template: one(templates, {
    fields: [cover_letters.template_id],
    references: [templates.id],
  }),
}));

module.exports = {
  plans,
  accounts,
  subscriptions,
  countries,
  account_source_enum,
  account_status_enum,
  personal_informations,
  experiences,
  educations,
  projects,
  references,
  certificates,
  skills,
  langs,
  resumes,
  resume_status_enum,
  templates,
  template_type_enum,
  cover_letters,
  // * Relations
  account_relations,
  subscriptions_relations,
  personal_informations_relations,
  experiences_relations,
  educations_relations,
  projects_relations,
  references_relations,
  certificates_relations,
  skills_relations,
  langs_relations,
  resume_relations,
  cover_letters_relations,
};
