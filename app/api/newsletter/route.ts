import { NextRequest, NextResponse } from "next/server";
import { createNewsletterSubscription } from "@/lib/db/queries";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().default("footer"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;
    const subscription = await createNewsletterSubscription({
      email: data.email,
      source: data.source,
    });

    return NextResponse.json(
      { success: true, data: subscription, message: "Successfully subscribed to newsletter!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}