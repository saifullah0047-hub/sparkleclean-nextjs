import dataRaw from "@/data/data.json";

type CatalogItem = { title: string; price: string };

const homeServices = (dataRaw.home as { services: { items: CatalogItem[] } }).services.items;
const durationByService: Record<string, number> = {
  "Residential Cleaning": 120,
  "Commercial Cleaning": 180,
  "Deep Cleaning": 240,
  "Move-Out Cleaning": 210,
  "Carpet & Upholstery": 90,
};

function parsePrice(price: string) {
  const value = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

export const BOOKING_SERVICES = homeServices.map((service) => ({
  id: service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name: service.title,
  priceCents: parsePrice(service.price),
  durationMinutes: durationByService[service.title] ?? 120,
}));

export const BUSINESS_HOURS: Record<number, { open: number; close: number } | null> = {
  0: null,
  1: { open: 8 * 60, close: 18 * 60 },
  2: { open: 8 * 60, close: 18 * 60 },
  3: { open: 8 * 60, close: 18 * 60 },
  4: { open: 8 * 60, close: 18 * 60 },
  5: { open: 8 * 60, close: 18 * 60 },
  6: { open: 9 * 60, close: 14 * 60 },
};

export const SLOT_INTERVAL_MINUTES = 30;
export const BOOKING_TIME_ZONE = process.env.BOOKING_TIME_ZONE || "UTC";
export const ACTIVE_BOOKING_STATUSES = ["PENDING", "CONFIRMED"] as const;

export function getBookingService(id: string) {
  return BOOKING_SERVICES.find((service) => service.id === id);
}

export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(mins).padStart(2, "0")} ${suffix}`;
}

export function getBusinessDay(date: string) {
  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null;
  return BUSINESS_HOURS[parsed.getUTCDay()];
}
