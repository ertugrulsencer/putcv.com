CREATE TABLE IF NOT EXISTS "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_product_id" varchar(100) NOT NULL,
	"plan_name" varchar(30) NOT NULL,
	"prices" numeric(10, 2) NOT NULL,
	"billing_cycle" varchar(30) NOT NULL,
	"description" varchar(250) NOT NULL,
	"features" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
