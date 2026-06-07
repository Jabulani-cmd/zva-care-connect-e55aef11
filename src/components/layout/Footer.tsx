import { Logo } from "./Logo";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">South Africa's trusted pharmacy retailer. Quality healthcare, beauty and wellness for every family.</p>
          <div className="mt-4 flex gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((I, i) => (
              <a key={i} href="#" className="rounded-full bg-background p-2 text-foreground/70 transition hover:bg-primary hover:text-primary-foreground"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        {[
          { title: "Shop", links: ["Pharmacy", "Beauty", "Baby", "Vitamins", "Deals"] },
          { title: "Customer", links: ["About Us", "Contact", "FAQs", "Store Locator", "Careers"] },
          { title: "Services", links: ["Prescription Repeat", "Vaccinations", "Health Screening", "Medical Aid", "Benefit Card"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">{col.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => <li key={l}><a href="#" className="hover:text-primary">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© 2025 Plus2 Pharmacy. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            {["VISA", "MC", "PayFast", "PayGate", "Mobicred"].map((p) => (
              <span key={p} className="rounded border border-border bg-background px-2 py-1 text-[10px] font-bold tracking-wider">{p}</span>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="rounded-md bg-foreground px-3 py-1.5 text-[10px] font-bold text-background">📱 App Store</span>
            <span className="rounded-md bg-foreground px-3 py-1.5 text-[10px] font-bold text-background">▶ Google Play</span>
          </div>
        </div>
      </div>
    </footer>
  );
}