import { NextRequest, NextResponse } from "next/server";
import { getBookings, getBookingStats } from "@/lib/db/queries";
import { verifyToken, getTokenFromHeaders } from "@/lib/auth";

async function isAdmin(request: NextRequest) {
  const token = getTokenFromHeaders(request.headers);
  return token ? verifyToken(token) : null;
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { page = "1", limit = "20", search = "", status = "", upcoming = "false" } = Object.fromEntries(request.nextUrl.searchParams);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: process.env.BOOKING_TIME_ZONE || "UTC" }).format(new Date());
  return NextResponse.json({ success: true, ...(await getBookings({ page: Number(page), limit: Number(limit), search, status, fromDate: upcoming === "true" ? today : "" })), stats: await getBookingStats() });
}
