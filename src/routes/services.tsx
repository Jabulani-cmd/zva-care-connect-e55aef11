import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Pharmacy Services — Plus2 Pharmacy" }] }),
  component: ServicesPage,
});

const SERVICES = [
  { icon: "💊", title: "Prescription Dispensing", desc: "Fast, accurate dispensing by qualified pharmacists." },
  { icon: "💉", title: "Flu & Travel Vaccinations", desc: "Walk-in vaccinations from R150. No appointment needed." },
  { icon: "🩺", title: "Chronic Medication", desc: "Auto-repeat scripts delivered monthly to your door." },
  { icon: "🩸", title: "Health Screenings", desc: "Blood pressure, glucose, cholesterol — results in minutes." },
  { icon: "👶", title: "Baby Clinic", desc: "Weigh-ins, immunisations and feeding advice." },
  { icon: "🐾", title: "Veterinary Dispensing", desc: "Pet medication, scripted and over-the-counter." },
  { icon: "📋", title: "Script Repeat", desc: "SMS or WhatsApp your script — we'll have it ready." },
  { icon: "🏥", title: "Medical Aid Claims", desc: "We claim directly from all major medical aids." },
];

const CITIES = ["Cape Town", "Johannesburg", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein"];

function ServicesPage() {
  const [city, setCity] = useState("Cape Town");
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-8 text-primary-foreground md:p-12">
        <h1 className="text-3xl font-extrabold md:text-4xl">Our Pharmacy Services</h1>
        <p className="mt-2 max-w-xl text-sm opacity-95 md:text-base">From dispensing to vaccinations, our qualified pharmacists are here to help you and your family stay healthy.</p>
        <button className="mt-5 rounded-full bg-white px-6 py-3 text-sm font-bold text-foreground shadow hover:bg-surface">Book a Consultation →</button>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold md:text-2xl">What we offer</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s.title} className="group rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="text-4xl">{s.icon}</div>
              <h3 className="mt-3 font-extrabold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold md:text-2xl">Find a Plus2 Pharmacy near you</h2>
        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <div className="rounded-xl border border-border bg-card p-5">
            <label className="text-sm font-bold">Choose city</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <div className="mt-4 space-y-3 text-sm">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg bg-surface p-3">
                  <div className="font-bold">Plus2 {city} {["CBD", "V&A Waterfront", "Sandton"][i - 1] ?? "Mall"}</div>
                  <div className="text-xs text-muted-foreground">Open today · 08:00–20:00</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex h-80 items-center justify-center rounded-xl bg-gradient-to-br from-surface to-muted text-6xl text-muted-foreground/40 md:h-auto">🗺</div>
        </div>
      </section>
    </div>
  );
}