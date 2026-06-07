import { useEffect, useState } from "react";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Flame } from "lucide-react";

function useCountdown(seconds: number) {
  const [t, setT] = useState(seconds);
  useEffect(() => { const i = setInterval(() => setT((p) => (p > 0 ? p - 1 : seconds)), 1000); return () => clearInterval(i); }, [seconds]);
  const h = String(Math.floor(t / 3600)).padStart(2, "0");
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
  const s = String(t % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function FlashDeals() {
  const time = useCountdown(8073);
  const deals = PRODUCTS.filter((p) => p.flashDeal);
  return (
    <section className="mt-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#EA580C]"><Flame className="h-3.5 w-3.5" /> Limited Time</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-[#111827] md:text-2xl">Today's Flash Deals</h2>
        </div>
        <div className="rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-[#111827]">
          <span className="text-[#6B7280]">Ends in</span> <span className="ml-1 font-mono tabular-nums text-[#EA580C]">{time}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {deals.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}