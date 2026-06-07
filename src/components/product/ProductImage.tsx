import type { Product } from "@/data/products";

export function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <div className={`flex items-center justify-center overflow-hidden bg-[#F9FAFB] ${className}`}>
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}