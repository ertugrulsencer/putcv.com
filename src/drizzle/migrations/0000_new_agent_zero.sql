CREATE TYPE "public"."account_source_enum" AS ENUM('APP', 'GOOGLE', 'APPLE');--> statement-breakpoint
CREATE TYPE "public"."account_status_enum" AS ENUM('NEW', 'VERIFIED', 'BANNED');--> statement-breakpoint
CREATE TYPE "public"."resume_status_enum" AS ENUM('PRIVATE', 'PUBLIC', 'ARCHIVE');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"photo_url" varchar(150),
	"first_name" varchar(50),
	"last_name" varchar(30) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" varchar(150),
	"status" "account_status_enum" DEFAULT 'NEW' NOT NULL,
	"source" "account_source_enum" DEFAULT 'APP' NOT NULL,
	"email_verification_token" varchar NOT NULL,
	"reset_password_token" varchar,
	"verified_at" timestamp,
	"last_login" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "countries" (
	"id" "smallserial" PRIMARY KEY NOT NULL,
	"code" char(2) NOT NULL,
	"country_name" varchar(50) NOT NULL,
	"phone" varchar(5) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text,
	"company" varchar(150),
	"location" varchar(50),
	"start_date" date,
	"end_date" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" smallint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "educations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"institution_name" varchar(100) NOT NULL,
	"degree" varchar(50),
	"location" varchar(50),
	"description" text,
	"start_date" date,
	"end_date" date,
	"currently" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" smallint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personel_informations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"photo_url" varchar(150),
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(30) NOT NULL,
	"email" varchar(100),
	"phone" varchar(30),
	"date_of_birth" date,
	"nationality" varchar(50),
	"address" varchar(150),
	"city" varchar(30),
	"country" smallint,
	"bio" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"title" varchar(50) NOT NULL,
	"objective" varchar(250),
	"job_title" varchar(50),
	"job_description" varchar(350),
	"ats_score" smallint DEFAULT 0 NOT NULL,
	"status" "resume_status_enum" NOT NULL,
	"custom_url" varchar(50),
	"view" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "resumes_custom_url_unique" UNIQUE("custom_url")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "experiences" ADD CONSTRAINT "experiences_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "educations" ADD CONSTRAINT "educations_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personel_informations" ADD CONSTRAINT "personel_informations_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personel_informations" ADD CONSTRAINT "personel_informations_country_countries_id_fk" FOREIGN KEY ("country") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resumes" ADD CONSTRAINT "resumes_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_accounts_email" ON "accounts" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_resumes_custom_url" ON "resumes" USING btree ("custom_url");