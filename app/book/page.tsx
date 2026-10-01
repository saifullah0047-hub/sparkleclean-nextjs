import type { Metadata } from "next";
import BookingFlow from "@/components/BookingFlow";
import { BOOKING_SERVICES } from "@/lib/booking/config";

export const metadata: Metadata = { title: "Book Your Clean", description: "Choose a service and reserve a cleaning time with SparkleClean." };

export default function BookingPage() {
  return <BookingFlow services={BOOKING_SERVICES} />;
}
