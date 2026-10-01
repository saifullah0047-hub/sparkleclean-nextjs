"use client";

import { useEffect, useState } from "react";

type Service = { id: string; name: string; priceCents: number; durationMinutes: number };
type Slot = { startMinute: number; endMinute: number; label: string };
type Form = { customerName: string; customerEmail: string; customerPhone: string; address: string; notes: string };
const emptyForm: Form = { customerName: "", customerEmail: "", customerPhone: "", address: "", notes: "" };

function today() {
  return new Intl.DateTimeFormat("en-CA").format(new Date());
}

export default function BookingFlow({ services }: { services: Service[] }) {
  const [serviceId, setServiceId] = useState(services[0]?.id || "");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [startMinute, setStartMinute] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [confirmation, setConfirmation] = useState<{ reference: string; price: number } | null>(null);
  const service = services.find((item) => item.id === serviceId);

  useEffect(() => {
    if (!date || !serviceId) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true); setMessage(null);
      fetch(`/api/bookings/availability?serviceId=${encodeURIComponent(serviceId)}&date=${date}`)
      .then(async (response) => ({ ok: response.ok, body: await response.json() }))
      .then(({ body }) => { if (!cancelled) setSlots(body.slots || []); })
      .catch(() => { if (!cancelled) setMessage("Unable to load availability. Please try again."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    }, 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [date, serviceId]);

  const update = (key: keyof Form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const next = () => { setMessage(null); if (step === 1 && !serviceId) return setMessage("Please choose a service."); if (step === 2 && startMinute === null) return setMessage("Please choose an available time."); setStep((current) => current + 1); };
  const submit = async () => {
    if (!service || startMinute === null) return;
    setLoading(true); setMessage(null); setErrors({});
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serviceId, date, startMinute, ...form }) });
      const body = await response.json();
      if (!response.ok) { setErrors(body.errors || {}); throw new Error(body.message || "Unable to create booking."); }
      setConfirmation({ reference: body.data.reference, price: body.data.servicePrice });
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to create booking."); } finally { setLoading(false); }
  };

  if (confirmation) return <main className="section-py"><div className="container"><div className="booking-shell text-center"><div className="booking-success"><i className="fa-solid fa-circle-check"></i><h1>Booking received</h1><p>We have reserved your request and sent the details to our team.</p><strong>Reference: {confirmation.reference}</strong><p className="mt-3">Estimated price: ${(confirmation.price / 100).toFixed(2)}</p><a className="btn btn-primary mt-3" href="/">Return to home</a></div></div></div></main>;

  return <main className="section-py"><div className="container"><div className="booking-shell">
    <div className="text-center mb-4"><span className="title-tag">Online Booking</span><h1>Schedule your clean</h1><p className="text-muted">Choose a service, time, and tell us where to send our team.</p></div>
    <div className="booking-steps">{["Service", "Date & time", "Details", "Review"].map((label, index) => <span className={step === index + 1 ? "active" : step > index + 1 ? "complete" : ""} key={label}>{index + 1}. {label}</span>)}</div>
    {message && <div className="alert alert-danger" role="alert">{message}</div>}
    {step === 1 && <section><h2>Choose your service</h2><div className="row g-3">{services.map((item) => <div className="col-md-6" key={item.id}><button type="button" className={`booking-option text-start${item.id === serviceId ? " selected" : ""}`} onClick={() => { setServiceId(item.id); setSlots([]); setStartMinute(null); }}><strong>{item.name}</strong><span>${(item.priceCents / 100).toFixed(2)} · {item.durationMinutes / 60} hour{item.durationMinutes === 60 ? "" : "s"}</span></button></div>)}</div><button className="btn btn-primary mt-4" onClick={next}>Continue <i className="fa-solid fa-arrow-right ms-2"></i></button></section>}
    {step === 2 && <section><h2>Select date and time</h2><label className="form-label" htmlFor="booking-date">Date</label><input id="booking-date" className="form-control mb-3" type="date" min={today()} value={date} onChange={(event) => { setDate(event.target.value); setSlots([]); setStartMinute(null); setStep(2); }} />{date && <><h3 className="h5">Available times</h3>{loading ? <p>Checking availability...</p> : slots.length ? <div className="booking-slots">{slots.map((slot) => <button type="button" key={slot.startMinute} className={startMinute === slot.startMinute ? "selected" : ""} onClick={() => setStartMinute(slot.startMinute)}>{slot.label}</button>)}</div> : <p className="text-muted">No times are available on this date. Try another date.</p>}</>}<div className="d-flex gap-2 mt-4"><button className="btn btn-outline-secondary" onClick={() => setStep(1)}>Back</button><button className="btn btn-primary" onClick={next}>Continue</button></div></section>}
    {step === 3 && <section><h2>Your details</h2><div className="row g-3">{([ ["customerName", "Name", "text"], ["customerEmail", "Email", "email"], ["customerPhone", "Phone", "tel"] ] as const).map(([key, label, type]) => <div className="col-md-6" key={key}><label className="form-label" htmlFor={key}>{label}</label><input id={key} className="form-control" type={type} value={form[key]} onChange={(event) => update(key, event.target.value)} required />{errors[key] && <small className="text-danger">{errors[key][0]}</small>}</div>)}<div className="col-12"><label className="form-label" htmlFor="address">Service address</label><textarea id="address" className="form-control" rows={3} value={form.address} onChange={(event) => update("address", event.target.value)} required />{errors.address && <small className="text-danger">{errors.address[0]}</small>}</div><div className="col-12"><label className="form-label" htmlFor="notes">Notes (optional)</label><textarea id="notes" className="form-control" rows={3} value={form.notes} onChange={(event) => update("notes", event.target.value)} /></div></div><div className="d-flex gap-2 mt-4"><button className="btn btn-outline-secondary" onClick={() => setStep(2)}>Back</button><button className="btn btn-primary" onClick={next}>Review booking</button></div></section>}
    {step === 4 && service && <section><h2>Review and confirm</h2><dl className="booking-review"><dt>Service</dt><dd>{service.name}</dd><dt>Date and time</dt><dd>{date} · {slots.find((slot) => slot.startMinute === startMinute)?.label}</dd><dt>Price</dt><dd>${(service.priceCents / 100).toFixed(2)}</dd><dt>Customer</dt><dd>{form.customerName}<br />{form.customerEmail}<br />{form.customerPhone}</dd><dt>Address</dt><dd>{form.address}</dd></dl><div className="d-flex gap-2 mt-4"><button className="btn btn-outline-secondary" onClick={() => setStep(3)}>Back</button><button className="btn btn-primary" disabled={loading} onClick={submit}>{loading ? "Submitting..." : "Confirm booking"}</button></div></section>}
  </div></div></main>;
}
