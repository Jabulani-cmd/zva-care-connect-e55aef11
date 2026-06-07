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
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md"
    >
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); toast.success(wished ? "Removed from wishlist" : "❤️ Added to wishlist"); }}
        className="absolute right-2 top-2 z-10 rounded-full bg-background/90 p-1.5 shadow-sm backdrop-blur transition hover:scale-110"
        aria-label="Toggle wishlist"
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-accent text-accent" : "text-foreground/60"}`} />
      </button>
      {product.savePct && (
        <div className="absolute left-2 top-2 z-10 rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground shadow-sm">
          Save {product.savePct}%
        </div>
      )}
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <ProductImage product={product} className="aspect-square w-full" />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{product.brand}</div>
        <Link to="/product/$id" params={{ id: product.id }} className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground hover:text-primary">
          {product.name}
        </Link>
        <RatingStars rating={product.rating} reviews={product.reviewCount} />
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-extrabold text-foreground">{formatZAR(product.price)}</span>
          {product.originalPrice && <span className="text-xs text-muted-foreground line-through">{formatZAR(product.originalPrice)}</span>}
        </div>
        <button
          onClick={() => { addToCart(product.id); toast.success(`✅ ${product.name.slice(0, 30)}… added`); }}
          className="mt-2 flex items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary-dark"
        >
          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
        </button>
      </div>
    </motion.div>
  );
}