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
    <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
      {/* Yellow promo strip */}
      <div className="mb-4 flex items-center justify-center gap-2 rounded-sm bg-accent px-4 py-2 text-center text-xs font-bold uppercase tracking-wide text-accent-foreground md:text-sm">
        <span>🎉 SAVE BIG THIS WEEK — Up to 50% off selected wellness & beauty. Shop now while stocks last.</span>
      </div>

      <HeroCarousel />

      <section className="mt-8">
        <h2 className="mb-3 border-l-4 border-accent pl-3 text-lg font-extrabold uppercase tracking-wide md:text-xl">Shop by Department</h2>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-8 md:overflow-visible md:gap-3 md:px-0">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group flex min-w-[96px] flex-col items-center gap-2 rounded-sm border border-border bg-card p-3 transition hover:border-primary hover:shadow-md md:min-w-0"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full text-3xl md:h-20 md:w-20 md:text-4xl" style={{ background: c.bg }}>{c.emoji}</div>
              <span className="text-center text-xs font-bold text-foreground group-hover:text-primary">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <FlashDeals />

      <section className="mt-10">
        <h2 className="mb-4 border-l-4 border-accent pl-3 text-lg font-extrabold uppercase tracking-wide">Featured Brands</h2>
        <div className="flex flex-wrap items-center gap-2">
          {BRANDS.map((b) => (
            <div key={b} className="rounded-sm border border-border bg-card px-5 py-3 text-sm font-extrabold tracking-wide text-foreground/70 transition hover:border-primary hover:text-primary">{b}</div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between border-l-4 border-accent pl-3">
          <h2 className="text-lg font-extrabold uppercase tracking-wide md:text-xl">Top Sellers</h2>
          <Link to="/category/$slug" params={{ slug: "all" }} className="text-sm font-bold text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 border-l-4 border-accent pl-3 text-lg font-extrabold uppercase tracking-wide md:text-xl">Health Tips & Articles</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {BLOG_POSTS.map((b) => (
            <article key={b.id} className="overflow-hidden rounded-sm border border-border bg-card transition hover:shadow-md">
              <div className="flex h-44 items-center justify-center text-6xl" style={{ background: b.bg }}>{b.emoji}</div>
              <div className="p-4">
                <span className="rounded-sm bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">{b.category}</span>
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