ALTER TABLE "categories" ADD COLUMN "type" varchar(50) DEFAULT 'expense';--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "status" varchar(50) DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "last_used" timestamp;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "updated_at" timestamp DEFAULT now();