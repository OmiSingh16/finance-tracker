ALTER TABLE "categories" ALTER COLUMN "last_used" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "created_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "created_at" SET DEFAULT 'CURRENT_DATE';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "updated_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "updated_at" SET DEFAULT 'CURRENT_DATE';--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "date" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "created_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "created_at" SET DEFAULT 'CURRENT_DATE';