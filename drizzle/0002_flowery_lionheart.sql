ALTER TABLE "accounts" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "type" varchar(50) DEFAULT 'savings';--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "balance" varchar(100) DEFAULT '0';