import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useShop, formatZAR } from "@/store/shop";
import { ProductImage } from "./ProductImage";
import { RatingStars } from "./RatingStars";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useShop((s) => s.addToCart);
  const toggleWishlist = useShop((s) => s.toggleWishlist);
  const wished = useShop((s) => s.wishlist.includes(product.id));

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-border bg-card transition hover:border-primary/40 hover:shadow-lg"
    >
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); toast.success(wished ? "Removed from wishlist" : "❤️ Added to wishlist"); }}
        className="absolute right-2 top-2 z-10 rounded-full bg-white/95 p-1.5 shadow-sm backdrop-blur transition hover:scale-110"
        aria-label="Toggle wishlist"
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-destructive text-destructive" : "text-foreground/60"}`} />
      </button>
      {product.savePct && (
        <div className="absolute left-2 top-2 z-10 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-destructive text-white shadow-md">
          <span className="text-[9px] font-bold uppercase leading-none">Save</span>
          <span className="text-sm font-extrabold leading-none">{product.savePct}%</span>
        </div>
      )}
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <ProductImage product={product} className="aspect-square w-full bg-white" />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 border-t border-border p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-primary">{product.brand}</div>
        <Link to="/product/$id" params={{ id: product.id }} className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground hover:underline">
          {product.name}
        </Link>
        <RatingStars rating={product.rating} reviews={product.reviewCount} />
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-primary">{formatZAR(product.price)}</span>
          {product.originalPrice && <span className="text-xs text-muted-foreground line-through">{formatZAR(product.originalPrice)}</span>}
        </div>
        <button
          onClick={() => { addToCart(product.id); toast.success(`✅ ${product.name.slice(0, 30)}… added`); }}
          className="mt-2 flex items-center justify-center gap-1.5 rounded-sm bg-primary py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground transition hover:bg-primary-dark"
        >
          <ShoppingCart className="h-3.5 w-3.5" /> Add to cart
        </button>
      </div>
    </motion.div>
  );
}