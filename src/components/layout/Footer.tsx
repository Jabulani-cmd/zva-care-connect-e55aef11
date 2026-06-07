import { Logo } from "./Logo";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 bg-[oklch(0.22_0.03_260)] text-white">
      {/* Trust strip */}
      <div className="border-b border-white/10 bg-[oklch(0.18_0.03_260)]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 text-xs md:grid-cols-4 md:text-sm">
          {[
            { t: "Free Delivery", s: "On orders over R500" },
            { t: "Click & Collect", s: "Ready in 2–4 hours" },
            { t: "Secure Payment", s: "Visa, MasterCard, PayFast" },
            { t: "Registered Pharmacists", s: "Trusted health advice" },
          ].map((b) => (
            <div key={b.t} className="flex flex-col">
              <span className="font-bold text-white">{b.t}</span>
              <span className="text-white/70">{b.s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="rounded-sm bg-white p-3 inline-block"><Logo /></div>
          <p className="mt-4 text-sm text-white/75">South Africa's trusted pharmacy retailer. Quality healthcare, beauty and wellness for every family.</p>
          <div className="mt-4 flex gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((I, i) => (
              <a key={i} href="#" className="rounded-full bg-white/10 p-2 text-white transition hover:bg-accent hover:text-accent-foreground"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        {[
          { title: "Shop", links: ["Pharmacy", "Beauty", "Baby", "Vitamins", "Deals"] },
          { title: "Customer", links: ["About Us", "Contact", "FAQs", "Store Locator", "Careers"] },
          { title: "Services", links: ["Prescription Repeat", "Vaccinations", "Health Screening", "Medical Aid", "Benefit Card"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">{col.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              {col.links.map((l) => <li key={l}><a href="#" className="hover:text-accent">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 bg-[oklch(0.15_0.025_260)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-white/70 md:flex-row">
          <p>© 2025 Plus2 Pharmacy. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            {["VISA", "MC", "PayFast", "PayGate", "Mobicred"].map((p) => (
              <span key={p} className="rounded border border-white/20 bg-white px-2 py-1 text-[10px] font-bold tracking-wider text-foreground">{p}</span>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="rounded-md bg-white px-3 py-1.5 text-[10px] font-bold text-foreground">📱 App Store</span>
            <span className="rounded-md bg-white px-3 py-1.5 text-[10px] font-bold text-foreground">▶ Google Play</span>
          </div>
        </div>
      </div>
    </footer>
  );
}