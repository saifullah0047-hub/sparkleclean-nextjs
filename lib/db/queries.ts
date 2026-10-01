import { db, schema } from "@/lib/db";
import { eq, desc, and, or, ilike, count, sql, asc, gte } from "drizzle-orm";
import type { AnyColumn } from "drizzle-orm";

const { contactSubmissions, newsletterSubscriptions, admins, bookings } = schema;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type NewNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

const contactSortColumns: Record<string, AnyColumn> = {
  id: contactSubmissions.id,
  name: contactSubmissions.name,
  email: contactSubmissions.email,
  phone: contactSubmissions.phone,
  serviceType: contactSubmissions.serviceType,
  message: contactSubmissions.message,
  variant: contactSubmissions.variant,
  status: contactSubmissions.status,
  notes: contactSubmissions.notes,
  createdAt: contactSubmissions.createdAt,
  updatedAt: contactSubmissions.updatedAt,
};

const newsletterSortColumns: Record<string, AnyColumn> = {
  id: newsletterSubscriptions.id,
  email: newsletterSubscriptions.email,
  status: newsletterSubscriptions.status,
  source: newsletterSubscriptions.source,
  createdAt: newsletterSubscriptions.createdAt,
  updatedAt: newsletterSubscriptions.updatedAt,
};

export async function createContactSubmission(data: NewContactSubmission) {
  const [submission] = await db.insert(contactSubmissions).values(data).returning();
  return submission;
}

export async function getContactSubmissions({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} = {}) {
  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(contactSubmissions.name, `%${search}%`),
        ilike(contactSubmissions.email, `%${search}%`),
        ilike(contactSubmissions.message, `%${search}%`),
        ilike(contactSubmissions.serviceType, `%${search}%`)
      )
    );
  }

  if (status) {
    conditions.push(eq(contactSubmissions.status, status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByColumn = contactSortColumns[sortBy] || contactSubmissions.createdAt;
  const orderBy = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

  const [results, totalResult] = await Promise.all([
    db
      .select()
      .from(contactSubmissions)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(contactSubmissions)
      .where(whereClause),
  ]);

  const total = totalResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: results,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function getContactSubmissionById(id: number) {
  const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id)).limit(1);
  return submission;
}

export async function updateContactSubmission(id: number, data: Partial<NewContactSubmission>) {
  const [submission] = await db
    .update(contactSubmissions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(contactSubmissions.id, id))
    .returning();
  return submission;
}

export async function deleteContactSubmission(id: number) {
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  return true;
}

export async function getContactStats() {
  const [total, newCount, inProgress, resolved, spam] = await Promise.all([
    db.select({ count: count() }).from(contactSubmissions),
    db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, "new")),
    db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, "in_progress")),
    db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, "resolved")),
    db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, "spam")),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCountResult = await db
    .select({ count: count() })
    .from(contactSubmissions)
    .where(sql`${contactSubmissions.createdAt} >= ${today}`);
  const todayCount = todayCountResult[0]?.count ?? 0;

  return {
    total: total[0]?.count ?? 0,
    new: newCount[0]?.count ?? 0,
    inProgress: inProgress[0]?.count ?? 0,
    resolved: resolved[0]?.count ?? 0,
    spam: spam[0]?.count ?? 0,
    today: todayCount,
  };
}

export async function createNewsletterSubscription(data: NewNewsletterSubscription) {
  const [subscription] = await db
    .insert(newsletterSubscriptions)
    .values(data)
    .onConflictDoUpdate({
      target: newsletterSubscriptions.email,
      set: { status: "active", updatedAt: new Date() },
    })
    .returning();
  return subscription;
}

export async function getNewsletterSubscriptions({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} = {}) {
  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(ilike(newsletterSubscriptions.email, `%${search}%`));
  }

  if (status) {
    conditions.push(eq(newsletterSubscriptions.status, status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByColumn = newsletterSortColumns[sortBy] || newsletterSubscriptions.createdAt;
  const orderBy = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

  const [results, totalResult] = await Promise.all([
    db
      .select()
      .from(newsletterSubscriptions)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(newsletterSubscriptions)
      .where(whereClause),
  ]);

  const total = totalResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: results,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function getNewsletterStats() {
  const [total, active, unsubscribed] = await Promise.all([
    db.select({ count: count() }).from(newsletterSubscriptions),
    db.select({ count: count() }).from(newsletterSubscriptions).where(eq(newsletterSubscriptions.status, "active")),
    db.select({ count: count() }).from(newsletterSubscriptions).where(eq(newsletterSubscriptions.status, "unsubscribed")),
  ]);

  return {
    total: total[0]?.count ?? 0,
    active: active[0]?.count ?? 0,
    unsubscribed: unsubscribed[0]?.count ?? 0,
  };
}

export async function updateNewsletterSubscription(id: number, data: Partial<NewNewsletterSubscription>) {
  const [subscription] = await db
    .update(newsletterSubscriptions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(newsletterSubscriptions.id, id))
    .returning();
  return subscription;
}

export async function deleteNewsletterSubscription(id: number) {
  await db.delete(newsletterSubscriptions).where(eq(newsletterSubscriptions.id, id));
  return true;
}

export async function getAdminByEmail(email: string) {
  const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  return admin;
}

export async function getAdminById(id: number) {
  const [admin] = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
  return admin;
}

export async function createAdmin(data: { email: string; passwordHash: string; name?: string; role?: string }) {
  const [admin] = await db.insert(admins).values(data).returning();
  return admin;
}

export async function updateAdminLastLogin(id: number) {
  await db.update(admins).set({ lastLoginAt: new Date() }).where(eq(admins.id, id));
}

export async function getBookings({ page = 1, limit = 20, search = "", status = "", fromDate = "" } = {}) {
  const offset = Math.max(0, page - 1) * limit;
  const conditions = [];
  if (search) {
    conditions.push(or(
      ilike(bookings.reference, `%${search}%`),
      ilike(bookings.customerName, `%${search}%`),
      ilike(bookings.customerEmail, `%${search}%`),
      ilike(bookings.serviceName, `%${search}%`)
    ));
  }
  if (status) conditions.push(eq(bookings.status, status));
  if (fromDate) conditions.push(gte(bookings.bookingDate, fromDate));
  const whereClause = conditions.length ? and(...conditions) : undefined;
  const [data, totalResult] = await Promise.all([
    db.select().from(bookings).where(whereClause).orderBy(asc(bookings.bookingDate), asc(bookings.startMinute)).limit(limit).offset(offset),
    db.select({ count: count() }).from(bookings).where(whereClause),
  ]);
  const total = totalResult[0]?.count ?? 0;
  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getBookingById(id: number) {
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return booking;
}

export async function getBookingsForDate(date: string) {
  return db.select({ startMinute: bookings.startMinute, endMinute: bookings.endMinute, status: bookings.status })
    .from(bookings).where(and(eq(bookings.bookingDate, date), or(eq(bookings.status, "PENDING"), eq(bookings.status, "CONFIRMED"))));
}

export async function createBooking(data: NewBooking) {
  const [booking] = await db.insert(bookings).values(data).returning();
  return booking;
}

export async function updateBookingStatus(id: number, status: string) {
  const [booking] = await db.update(bookings).set({ status, updatedAt: new Date() }).where(eq(bookings.id, id)).returning();
  return booking;
}

export async function getBookingStats() {
  const [total, pending, confirmed, completed, cancelled] = await Promise.all([
    db.select({ count: count() }).from(bookings),
    db.select({ count: count() }).from(bookings).where(eq(bookings.status, "PENDING")),
    db.select({ count: count() }).from(bookings).where(eq(bookings.status, "CONFIRMED")),
    db.select({ count: count() }).from(bookings).where(eq(bookings.status, "COMPLETED")),
    db.select({ count: count() }).from(bookings).where(eq(bookings.status, "CANCELLED")),
  ]);
  return { total: total[0]?.count ?? 0, pending: pending[0]?.count ?? 0, confirmed: confirmed[0]?.count ?? 0, completed: completed[0]?.count ?? 0, cancelled: cancelled[0]?.count ?? 0 };
}
