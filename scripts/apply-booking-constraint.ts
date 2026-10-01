import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function apply() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`CREATE EXTENSION IF NOT EXISTS btree_gist`;
  const existing = await sql`SELECT 1 FROM pg_constraint WHERE conname = 'bookings_no_overlapping_active'`;
  if (!existing.length) {
    await sql.query("ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlapping_active EXCLUDE USING gist (booking_date WITH =, int4range(start_minute, end_minute, '[)') WITH &&) WHERE (status IN ('PENDING', 'CONFIRMED'))");
  }
  console.log("Booking overlap protection is enabled.");
}

apply().catch((error) => { console.error(error); process.exitCode = 1; });
