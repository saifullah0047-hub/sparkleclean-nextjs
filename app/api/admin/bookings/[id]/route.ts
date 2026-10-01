import { NextRequest, NextResponse } from "next/server";
import { getBookingById, updateBookingStatus } from "@/lib/db/queries";
import { verifyToken, getTokenFromHeaders } from "@/lib/auth";
import { updateBookingSchema } from "@/lib/booking/validation";
import { sendBookingNotification } from "@/lib/booking/notifications";

async function isAdmin(request: NextRequest) { const token = getTokenFromHeaders(request.headers); return token ? verifyToken(token) : null; }

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(request))) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const booking = await getBookingById(Number((await params).id));
  return booking ? NextResponse.json({ success: true, data: booking }) : NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(request))) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const parsed = updateBookingSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  const booking = await updateBookingStatus(Number((await params).id), parsed.data.status);
  if (!booking) return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
  if (parsed.data.status === "CANCELLED") await sendBookingNotification(booking, "cancelled");
  return NextResponse.json({ success: true, data: booking });
}
