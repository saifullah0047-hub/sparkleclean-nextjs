import { z } from "zod";

export const availabilitySchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
});

export const createBookingSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  startMinute: z.number().int().min(0).max(1439),
  customerName: z.string().trim().min(2).max(255),
  customerEmail: z.string().trim().email().max(255),
  customerPhone: z.string().trim().min(7).max(50),
  address: z.string().trim().min(5).max(2000),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const updateBookingSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
