import { NextRequest, NextResponse } from "next/server";
import { getContactSubmissionById, updateContactSubmission, deleteContactSubmission } from "@/lib/db/queries";
import { verifyToken, getTokenFromHeaders } from "@/lib/auth";
import { z } from "zod";

async function verifyAuth(request: NextRequest) {
  const token = getTokenFromHeaders(request.headers);
  if (!token) return null;
  return verifyToken(token);
}

const updateSchema = z.object({
  status: z.enum(["new", "in_progress", "resolved", "spam"]).optional(),
  notes: z.string().optional(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  serviceType: z.string().optional(),
  message: z.string().min(10).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const submission = await getContactSubmissionById(parseInt(id));

    if (!submission) {
      return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error("Get contact error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch contact" }, { status: 500 });
  }
}

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

    const submission = await updateContactSubmission(parseInt(id), result.data);
    if (!submission) {
      return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: submission, message: "Contact updated successfully" });
  } catch (error) {
    console.error("Update contact error:", error);
    return NextResponse.json({ success: false, message: "Failed to update contact" }, { status: 500 });
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
    await deleteContactSubmission(parseInt(id));

    return NextResponse.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete contact" }, { status: 500 });
  }
}