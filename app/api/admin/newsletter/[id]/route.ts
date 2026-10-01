import { NextRequest, NextResponse } from "next/server";
import { updateNewsletterSubscription, deleteNewsletterSubscription } from "@/lib/db/queries";
import { verifyToken, getTokenFromHeaders } from "@/lib/auth";
import { z } from "zod";

async function verifyAuth(request: NextRequest) {
  const token = getTokenFromHeaders(request.headers);
  if (!token) return null;
  return verifyToken(token);
}

const updateSchema = z.object({
  status: z.enum(["active", "unsubscribed"]).optional(),
  email: z.string().email().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = updateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const subscription = await updateNewsletterSubscription(parseInt(id), result.data);
    if (!subscription) {
      return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: subscription, message: "Subscription updated successfully" });
  } catch (error) {
    console.error("Update newsletter error:", error);
    return NextResponse.json({ success: false, message: "Failed to update subscription" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteNewsletterSubscription(parseInt(id));

    return NextResponse.json({ success: true, message: "Subscription deleted successfully" });
  } catch (error) {
    console.error("Delete newsletter error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete subscription" }, { status: 500 });
  }
}