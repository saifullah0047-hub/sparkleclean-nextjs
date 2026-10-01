import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/db/queries";
import { createBookingSchema } from "@/lib/booking/validation";
import { getBookingService, getBusinessDay } from "@/lib/booking/config";
import { sendBookingNotification } from "@/lib/booking/notifications";

function reference() {
  return `SC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function isPastDate(date: string) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: process.env.BOOKING_TIME_ZONE || "UTC" }).format(new Date());
  return date < today;
}

export async function POST(request: NextRequest) {
  try {
    const result = createBookingSchema.safeParse(await request.json());
    if (!result.success) return NextResponse.json({ success: false, errors: result.error.flatten().fieldErrors }, { status: 400 });
    const input = result.data;
    const service = getBookingService(input.serviceId);
    const hours = getBusinessDay(input.date);
    const endMinute = input.startMinute + (service?.durationMinutes ?? 0);
    if (!service || !hours || isPastDate(input.date) || input.startMinute % 30 !== 0 || input.startMinute < hours.open || endMinute > hours.close) {
      return NextResponse.json({ success: false, message: "That date or time is not available." }, { status: 409 });
    }

    const booking = await createBooking({
      reference: reference(), serviceId: service.id, serviceName: service.name, servicePrice: service.priceCents,
      durationMinutes: service.durationMinutes, bookingDate: input.date, startMinute: input.startMinute, endMinute,
      customerName: input.customerName, customerEmail: input.customerEmail, customerPhone: input.customerPhone,
      address: input.address, notes: input.notes || null, status: "PENDING",
    });
    await Promise.allSettled([
      sendBookingNotification(booking, "new"),
      sendBookingNotification(booking, "confirmed"),
    ]);
    return NextResponse.json({ success: true, data: booking, message: "Booking request received." }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "23P01") return NextResponse.json({ success: false, message: "That time was just booked. Please choose another slot." }, { status: 409 });
    console.error("Create booking error:", error);
    return NextResponse.json({ success: false, message: "Unable to create booking. Please try again." }, { status: 500 });
  }
}
