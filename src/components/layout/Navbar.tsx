import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, Heart, ShoppingCart, User, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { useShop } from "@/store/shop";
import { CATEGORIES } from "@/data/categories";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Navbar() {
  const cart = useShop((s) => s.cart);
  const wishlist = useShop((s) => s.wishlist);
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const [q, setQ] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/category/$slug", params: { slug: "all" }, search: { q } });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Sheet>
          <SheetTrigger className="md:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="mt-6 flex flex-col gap-1">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                  <span className="text-lg">{c.emoji}</span> {c.name}
                </Link>
              ))}
              <Link to="/services" className="mt-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Pharmacy Services</Link>
              <Link to="/account" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">My Account</Link>
            </div>
          </SheetContent>
        </Sheet>

        <Logo />

        <form onSubmit={submit} className="ml-2 hidden flex-1 md:flex">
          <div className="relative w-full max-w-2xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for medicines, vitamins, brands…"
              className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <Link to="/account" className="hidden flex-col items-center rounded-md p-2 text-xs hover:bg-muted sm:flex">
            <User className="h-5 w-5" />
            <span className="mt-0.5 text-[10px] font-medium">Account</span>
          </Link>
          <Link to="/account" className="relative hidden flex-col items-center rounded-md p-2 text-xs hover:bg-muted sm:flex">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">{wishlist.length}</span>
            )}
            <span className="mt-0.5 text-[10px] font-medium">Wishlist</span>
          </Link>
          <button onClick={() => setCartOpen(true)} className="relative flex flex-col items-center rounded-md p-2 text-xs hover:bg-muted" aria-label="Open cart">
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-0 top-0 min-w-[18px] rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="mt-0.5 hidden text-[10px] font-medium sm:block">Cart</span>
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={submit} className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
      </form>

      {/* Category strip */}
      <nav className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 py-2 text-sm font-medium scrollbar-none">
          {CATEGORIES.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-background"}`}
              >
                {c.emoji} {c.name}
              </Link>
            );
          })}
          <Link to="/category/$slug" params={{ slug: "deals" }} className="whitespace-nowrap rounded-full bg-accent/10 px-3 py-1.5 font-semibold text-accent">🔥 Deals</Link>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}