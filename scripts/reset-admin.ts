import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function resetAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@sparkleclean.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  const existing = await db.select().from(admins).where(eq(admins.email, adminEmail)).limit(1);

  if (existing.length === 0) {
    console.error(`No admin found with email: ${adminEmail}`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db
    .update(admins)
    .set({ passwordHash, isActive: true, updatedAt: new Date() })
    .where(eq(admins.email, adminEmail));

  console.log("Admin password reset successfully!");
  console.log(`Email: ${adminEmail}`);
  console.log(`New Password: ${adminPassword}`);
}

resetAdmin().catch((error) => {
  console.error("Error resetting admin password:", error);
  process.exit(1);
});
