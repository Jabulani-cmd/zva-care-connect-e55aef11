import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FlashDeals } from "@/components/home/FlashDeals";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES, BRANDS, BLOG_POSTS } from "@/data/categories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Plus2 Pharmacy — Your Health, Our Priority" },
      { name: "description", content: "Shop pharmacy, beauty, baby, vitamins and more. Free delivery over R500 across South Africa." },
      { property: "og:title", content: "Plus2 Pharmacy" },
      { property: "og:description", content: "South Africa's trusted pharmacy — quality healthcare for every family." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = PRODUCTS.filter((p) => p.featured);
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <HeroCarousel />

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold md:text-2xl">Shop by Category</h2>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-8 md:overflow-visible md:px-0">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group flex min-w-[88px] flex-col items-center gap-2 md:min-w-0"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl shadow-sm transition group-hover:scale-105 group-hover:shadow-md md:h-24 md:w-24 md:text-4xl" style={{ background: c.bg }}>{c.emoji}</div>
              <span className="text-xs font-semibold text-foreground">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <FlashDeals />

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-muted-foreground">Featured Brands</h2>
        <div className="flex flex-wrap items-center gap-2">
          {BRANDS.map((b) => (
            <div key={b} className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-extrabold tracking-wide text-foreground/70 shadow-sm transition hover:text-primary">{b}</div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-extrabold md:text-2xl">Top Sellers</h2>
          <Link to="/category/$slug" params={{ slug: "all" }} className="text-sm font-bold text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold md:text-2xl">Health Tips & Articles</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {BLOG_POSTS.map((b) => (
            <article key={b.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md">
              <div className="flex h-44 items-center justify-center text-6xl" style={{ background: b.bg }}>{b.emoji}</div>
              <div className="p-4">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">{b.category}</span>
                <h3 className="mt-2 font-bold leading-snug">{b.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{b.readTime}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}