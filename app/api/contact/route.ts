import { NextRequest, NextResponse } from "next/server";
import { createContactSubmission } from "@/lib/db/queries";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  "service-type": z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  variant: z.enum(["panel", "page"]).default("panel"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;
    const submission = await createContactSubmission({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      serviceType: data["service-type"] || null,
      message: data.message,
      variant: data.variant,
    });

    return NextResponse.json(
      { success: true, data: submission, message: "Your message has been sent successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit form. Please try again." },
      { status: 500 }
    );
  }
}