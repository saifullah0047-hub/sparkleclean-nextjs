import type { Booking } from "@/lib/db/queries";
import { formatMinutes } from "./config";

type NotificationKind = "new" | "confirmed" | "cancelled";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character);
}

export async function sendBookingNotification(booking: Booking, kind: NotificationKind) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  const adminEmail = process.env.BOOKING_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const recipient = kind === "new" ? adminEmail : booking.customerEmail;
  if (!apiKey || !from || !recipient) {
    console.warn("Booking email skipped: email configuration is incomplete.", { kind, bookingId: booking.id });
    return;
  }

  const subject = kind === "cancelled" ? `Booking cancelled: ${booking.reference}` : kind === "confirmed" ? `Booking confirmed: ${booking.reference}` : `New booking: ${booking.reference}`;
  const heading = kind === "cancelled" ? "Your booking has been cancelled" : kind === "confirmed" ? "Your booking is confirmed" : "New booking received";
  const html = `<h2>${escapeHtml(heading)}</h2><p><strong>Booking ID:</strong> ${booking.id}</p><p><strong>Reference:</strong> ${escapeHtml(booking.reference)}</p><p><strong>Service:</strong> ${escapeHtml(booking.serviceName)}</p><p><strong>Date:</strong> ${escapeHtml(booking.bookingDate)}</p><p><strong>Time:</strong> ${formatMinutes(booking.startMinute)} - ${formatMinutes(booking.endMinute)}</p><p><strong>Price:</strong> $${(booking.servicePrice / 100).toFixed(2)}</p><h3>Customer details</h3><p><strong>Name:</strong> ${escapeHtml(booking.customerName)}<br /><strong>Email:</strong> ${escapeHtml(booking.customerEmail)}<br /><strong>Phone:</strong> ${escapeHtml(booking.customerPhone)}<br /><strong>Address:</strong> ${escapeHtml(booking.address)}${booking.notes ? `<br /><strong>Notes:</strong> ${escapeHtml(booking.notes)}` : ""}</p>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [recipient], subject, html }),
    });
    if (!response.ok) {
      const responseBody = (await response.text()).slice(0, 1000);
      let providerMessage = responseBody;
      try {
        const parsed = JSON.parse(responseBody) as { message?: string };
        providerMessage = parsed.message || responseBody;
      } catch {
        // Keep the raw, bounded provider response when it is not JSON.
      }
      console.error("Booking email provider rejected message.", {
        kind,
        bookingId: booking.id,
        status: response.status,
        providerMessage,
      });
    }
  } catch (error) {
    console.error("Booking email delivery failed.", { kind, bookingId: booking.id, error: error instanceof Error ? error.message : "Unknown email error" });
  }
}
