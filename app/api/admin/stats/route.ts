import { NextRequest, NextResponse } from "next/server";
import { getBookingStats, getContactStats, getNewsletterStats } from "@/lib/db/queries";
import { verifyToken, getTokenFromHeaders } from "@/lib/auth";

async function verifyAuth(request: NextRequest) {
  const token = getTokenFromHeaders(request.headers);
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [contactStats, newsletterStats, bookingStats] = await Promise.all([
      getContactStats(),
      getNewsletterStats(),
      getBookingStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        contacts: contactStats,
        newsletter: newsletterStats,
        bookings: bookingStats,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch stats" }, { status: 500 });
  }
}
