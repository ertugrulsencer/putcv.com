CREATE TYPE "public"."template_type_enum" AS ENUM('RESUME', 'COVER', 'RESIGNATION');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(50) NOT NULL,
	"tpye" "template_type_enum" NOT NULL,
	"topic" varchar(30),
	"preview_image_url" varchar(150) NOT NULL,
	"is_pro" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resumes" ADD COLUMN "template_id" uuid;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_template_topic" ON "templates" USING btree ("topic");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resumes" ADD CONSTRAINT "resumes_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
