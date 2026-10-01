import { NextRequest, NextResponse } from "next/server";
import { getContactSubmissions, getContactStats } from "@/lib/db/queries";
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const result = await getContactSubmissions({ page, limit, search, status, sortBy, sortOrder });
    const stats = await getContactStats();

    return NextResponse.json({ success: true, ...result, stats });
  } catch (error) {
    console.error("Get contacts error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch contacts" }, { status: 500 });
  }
}