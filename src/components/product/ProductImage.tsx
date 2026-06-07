import type { Product } from "@/data/products";

export function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`} style={{ background: product.bg }}>
      <span className="text-5xl drop-shadow-sm md:text-6xl" aria-hidden>{product.emoji}</span>
    </div>
  );
}