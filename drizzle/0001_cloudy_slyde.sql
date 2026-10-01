CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" varchar(20) NOT NULL,
	"service_id" varchar(100) NOT NULL,
	"service_name" varchar(255) NOT NULL,
	"service_price_cents" integer NOT NULL,
	"duration_minutes" integer NOT NULL,
	"booking_date" varchar(10) NOT NULL,
	"start_minute" integer NOT NULL,
	"end_minute" integer NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(50) NOT NULL,
	"address" text NOT NULL,
	"notes" text,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE INDEX "bookings_date_idx" ON "bookings" USING btree ("booking_date");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bookings_email_idx" ON "bookings" USING btree ("customer_email");--> statement-breakpoint
CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_no_overlapping_active" EXCLUDE USING gist ("booking_date" WITH =, int4range("start_minute", "end_minute", '[)') WITH &&) WHERE ("status" IN ('PENDING', 'CONFIRMED'));
