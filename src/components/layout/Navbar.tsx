import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, Heart, ShoppingCart, User, Menu, MapPin, Phone, HelpCircle, ChevronDown, Truck, FileText } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { useShop } from "@/store/shop";
import { useAuth } from "@/store/auth";
import { CATEGORIES } from "@/data/categories";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Navbar() {
  const cart = useShop((s) => s.cart);
  const wishlist = useShop((s) => s.wishlist);
  const user = useAuth((s) => s.user);
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
    <header className="sticky top-0 z-40 border-b border-border bg-background shadow-sm">
      {/* Utility top bar */}
      <div className="hidden bg-[oklch(0.22_0.03_260)] text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[12px]">
          <div className="flex items-center gap-5 text-white/85">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Find a Store</span>
            <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Free delivery over R500</span>
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> 0860 PLUS2 (0860 75872)</span>
          </div>
          <div className="flex items-center gap-5 text-white/85">
            <Link to="/services" className="hover:text-accent">Pharmacy Services</Link>
            <Link to="/prescriptions" className="flex items-center gap-1 hover:text-accent"><FileText className="h-3.5 w-3.5" /> Upload Script</Link>
            <a href="#" className="flex items-center gap-1 hover:text-accent"><HelpCircle className="h-3.5 w-3.5" /> Help</a>
            <Link to="/track" className="hover:text-accent">Track Order</Link>
            <Link to={user ? "/account" : "/auth"} className="font-semibold hover:text-accent">{user ? `Hi, ${user.firstName}` : "Sign In / Register"}</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
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
              <Link to="/prescriptions" className="mt-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">📋 Upload Prescription</Link>
              <Link to="/track" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">🚚 Track Order</Link>
              <Link to="/services" className="mt-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Pharmacy Services</Link>
              <Link to={user ? "/account" : "/auth"} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">{user ? "My Account" : "Sign In / Register"}</Link>
            </div>
          </SheetContent>
        </Sheet>

        <Logo />

        <form onSubmit={submit} className="ml-4 hidden flex-1 md:flex">
          <div className="flex w-full max-w-3xl overflow-hidden rounded-sm border-2 border-primary bg-background shadow-sm">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products, brands, categories..."
              className="w-full bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" aria-label="Search" className="flex items-center justify-center bg-accent px-5 text-accent-foreground transition hover:brightness-95">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <Link to={user ? "/account" : "/auth"} className="hidden items-center gap-2 rounded-sm px-3 py-2 text-left text-xs hover:bg-muted lg:flex">
            <User className="h-6 w-6 text-primary" />
            <span className="leading-tight">
              <span className="block text-[11px] text-muted-foreground">{user ? `Hi, ${user.firstName}` : "Hello, Guest"}</span>
              <span className="block text-sm font-bold text-foreground">{user ? "My account" : "Sign in"} <ChevronDown className="-mt-0.5 inline h-3 w-3" /></span>
            </span>
          </Link>
          <Link to="/account" className="relative hidden flex-col items-center rounded-md p-2 text-xs hover:bg-muted sm:flex">
            <Heart className="h-6 w-6 text-primary" />
            {wishlist.length > 0 && (
              <span className="absolute right-0 top-0 rounded-full bg-destructive px-1.5 text-[10px] font-bold text-white">{wishlist.length}</span>
            )}
            <span className="mt-0.5 text-[10px] font-semibold text-foreground">Wishlist</span>
          </Link>
          <button onClick={() => setCartOpen(true)} className="relative flex flex-col items-center rounded-md p-2 text-xs hover:bg-muted" aria-label="Open cart">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-0 top-0 min-w-[18px] rounded-full bg-destructive px-1 text-center text-[10px] font-bold text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="mt-0.5 hidden text-[10px] font-semibold text-foreground sm:block">Cart</span>
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={submit} className="px-4 pb-3 md:hidden">
        <div className="flex overflow-hidden rounded-sm border-2 border-primary bg-background">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-background px-3 py-2.5 text-sm outline-none"
          />
          <button type="submit" aria-label="Search" className="flex items-center justify-center bg-accent px-4 text-accent-foreground">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Departments / secondary nav (Dis-Chem blue bar) */}
      <nav className="border-t border-primary-dark bg-primary text-white">
        <div className="mx-auto flex max-w-7xl items-stretch gap-1 overflow-x-auto px-2 text-sm font-semibold scrollbar-none">
          <button className="flex items-center gap-2 bg-accent px-4 py-2.5 font-bold uppercase tracking-wide text-accent-foreground">
            <Menu className="h-4 w-4" /> Browse Departments
          </button>
          {CATEGORIES.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className={`whitespace-nowrap border-b-2 px-3 py-2.5 transition ${active ? "border-accent text-accent" : "border-transparent text-white hover:bg-primary-dark"}`}
              >
                {c.name}
              </Link>
            );
          })}
          <Link to="/category/$slug" params={{ slug: "deals" }} className="ml-auto flex items-center whitespace-nowrap bg-destructive px-3 py-2.5 font-bold uppercase tracking-wide text-white">Specials</Link>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}