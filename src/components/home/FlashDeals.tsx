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
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-extrabold md:text-2xl"><Flame className="h-6 w-6 text-accent" /> Today's Flash Deals</h2>
          <p className="text-sm text-muted-foreground">Limited time — don't miss out</p>
        </div>
        <div className="rounded-lg bg-foreground px-3 py-2 text-sm font-bold text-background">⏱ Ends in {time}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {deals.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}