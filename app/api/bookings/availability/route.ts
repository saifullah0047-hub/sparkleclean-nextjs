import { NextRequest, NextResponse } from "next/server";
import { getBookingsForDate } from "@/lib/db/queries";
import { availabilitySchema } from "@/lib/booking/validation";
import { getBookingService, getBusinessDay, formatMinutes, SLOT_INTERVAL_MINUTES } from "@/lib/booking/config";

function isPastDate(date: string) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: process.env.BOOKING_TIME_ZONE || "UTC" }).format(new Date());
  return date < today;
}

export async function GET(request: NextRequest) {
  const parsed = availabilitySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid service or date" }, { status: 400 });
  const service = getBookingService(parsed.data.serviceId);
  const hours = getBusinessDay(parsed.data.date);
  if (!service || !hours || isPastDate(parsed.data.date)) return NextResponse.json({ success: true, slots: [] });

  const existing = await getBookingsForDate(parsed.data.date);
  const slots = [];
  for (let start = hours.open; start + service.durationMinutes <= hours.close; start += SLOT_INTERVAL_MINUTES) {
    const end = start + service.durationMinutes;
    const blocked = existing.some((booking) => start < booking.endMinute && end > booking.startMinute);
    if (!blocked) slots.push({ startMinute: start, endMinute: end, label: `${formatMinutes(start)} - ${formatMinutes(end)}` });
  }
  return NextResponse.json({ success: true, slots });
}
