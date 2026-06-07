export type Category = { slug: string; name: string; emoji: string; bg: string };

export const CATEGORIES: Category[] = [
  { slug: "pharmacy", name: "Pharmacy", emoji: "💊", bg: "oklch(0.93 0.1 150)" },
  { slug: "beauty", name: "Beauty", emoji: "💄", bg: "oklch(0.93 0.09 0)" },
  { slug: "baby", name: "Baby", emoji: "👶", bg: "oklch(0.94 0.08 50)" },
  { slug: "vitamins", name: "Vitamins", emoji: "💪", bg: "oklch(0.93 0.1 75)" },
  { slug: "personal", name: "Personal Care", emoji: "🧴", bg: "oklch(0.93 0.08 200)" },
  { slug: "sports", name: "Sports Nutrition", emoji: "🏋️", bg: "oklch(0.92 0.1 30)" },
  { slug: "household", name: "Household", emoji: "🏠", bg: "oklch(0.94 0.07 130)" },
  { slug: "pets", name: "Pets", emoji: "🐾", bg: "oklch(0.93 0.09 280)" },
];

export const BRANDS = ["Panado", "Allergex", "Vitaforce", "Bioplus", "Lennon", "Natio", "Neutrogena", "Dove", "Huggies", "USN"];

export const HERO_SLIDES = [
  {
    headline: "Up to 30% Off Winter Wellness",
    subtext: "Stock up on vitamins, cold & flu essentials and immunity boosters.",
    cta: "Shop Wellness",
    href: "/category/vitamins",
    gradient: "linear-gradient(135deg, oklch(0.55 0.16 150), oklch(0.4 0.14 150))",
    emoji: "❄️",
  },
  {
    headline: "Plus2 Benefit Card",
    subtext: "Earn points on every purchase. Redeem for instant savings in-store and online.",
    cta: "Join Free",
    href: "/account",
    gradient: "linear-gradient(135deg, oklch(0.7 0.19 45), oklch(0.55 0.18 35))",
    emoji: "💳",
  },
  {
    headline: "Free Delivery Over R500",
    subtext: "Fast, contactless delivery to your door across South Africa.",
    cta: "Start Shopping",
    href: "/category/all",
    gradient: "linear-gradient(135deg, oklch(0.5 0.18 230), oklch(0.35 0.15 250))",
    emoji: "🚚",
  },
];

export const BLOG_POSTS = [
  { id: "1", category: "Wellness", title: "5 Vitamins to Boost Your Winter Immunity", readTime: "4 min read", emoji: "🍊", bg: "oklch(0.92 0.12 75)" },
  { id: "2", category: "Baby Care", title: "A Parent's Guide to Choosing the Right Nappy", readTime: "6 min read", emoji: "👶", bg: "oklch(0.93 0.08 50)" },
  { id: "3", category: "Skincare", title: "Why Hyaluronic Acid Belongs in Your Routine", readTime: "5 min read", emoji: "💧", bg: "oklch(0.92 0.09 220)" },
];