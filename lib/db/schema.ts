import { pgTable, serial, varchar, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";

export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    serviceType: varchar("service_type", { length: 100 }),
    message: text("message").notNull(),
    variant: varchar("variant", { length: 20 }).notNull().default("panel"),
    status: varchar("status", { length: 20 }).notNull().default("new"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("contact_submissions_email_idx").on(table.email),
    statusIdx: index("contact_submissions_status_idx").on(table.status),
    createdAtIdx: index("contact_submissions_created_at_idx").on(table.createdAt),
  })
);

export const newsletterSubscriptions = pgTable(
  "newsletter_subscriptions",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    source: varchar("source", { length: 50 }).default("footer"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("newsletter_subscriptions_email_idx").on(table.email),
    statusIdx: index("newsletter_subscriptions_status_idx").on(table.status),
  })
);

export const admins = pgTable(
  "admins",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    name: varchar("name", { length: 100 }),
    role: varchar("role", { length: 20 }).notNull().default("admin"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("admins_email_idx").on(table.email),
  })
);

export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    reference: varchar("reference", { length: 20 }).notNull().unique(),
    serviceId: varchar("service_id", { length: 100 }).notNull(),
    serviceName: varchar("service_name", { length: 255 }).notNull(),
    servicePrice: integer("service_price_cents").notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    bookingDate: varchar("booking_date", { length: 10 }).notNull(),
    startMinute: integer("start_minute").notNull(),
    endMinute: integer("end_minute").notNull(),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    customerEmail: varchar("customer_email", { length: 255 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
    address: text("address").notNull(),
    notes: text("notes"),
    status: varchar("status", { length: 20 }).notNull().default("PENDING"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    dateIdx: index("bookings_date_idx").on(table.bookingDate),
    statusIdx: index("bookings_status_idx").on(table.status),
    emailIdx: index("bookings_email_idx").on(table.customerEmail),
    createdAtIdx: index("bookings_created_at_idx").on(table.createdAt),
  })
);

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type NewNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
