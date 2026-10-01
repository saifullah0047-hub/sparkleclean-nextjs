import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function seedAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@sparkleclean.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Admin";

  console.log(`Creating admin user: ${adminEmail}`);

  const existingAdmin = await db.select().from(admins).where(eq(admins.email, adminEmail)).limit(1);

  if (existingAdmin.length > 0) {
    console.log("Admin user already exists");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db.insert(admins).values({
    email: adminEmail,
    passwordHash,
    name: adminName,
    role: "admin",
    isActive: true,
  });

  console.log("Admin user created successfully!");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
}

seedAdmin().catch((error) => {
  console.error("Error seeding admin:", error);
  process.exit(1);
});