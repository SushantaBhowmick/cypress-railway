CREATE TABLE IF NOT EXISTS "dummy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text
);
