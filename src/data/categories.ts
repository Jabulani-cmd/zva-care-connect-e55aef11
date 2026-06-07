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
    headline: "Up to 30% off Winter Wellness",
    subtext: "Vitamins, cold & flu essentials and immunity boosters — while stocks last.",
    cta: "Shop the sale",
    href: "/category/vitamins",
    gradient: "linear-gradient(120deg, oklch(0.92 0.18 95) 0%, oklch(0.85 0.2 85) 100%)",
    textDark: true,
    emoji: "❄️",
  },
  {
    headline: "Earn with the Plus2 Benefit Card",
    subtext: "Earn 1 point per R1 spent. Redeem in-store and online — it's free to join.",
    cta: "Join free today",
    href: "/account",
    gradient: "linear-gradient(120deg, oklch(0.36 0.18 260) 0%, oklch(0.28 0.17 260) 100%)",
    emoji: "💳",
  },
  {
    headline: "Free delivery on orders over R500",
    subtext: "Fast, tracked, contactless delivery to your door anywhere in South Africa.",
    cta: "Start shopping",
    href: "/category/all",
    gradient: "linear-gradient(120deg, oklch(0.55 0.24 27) 0%, oklch(0.42 0.22 25) 100%)",
    emoji: "🚚",
  },
];

export const BLOG_POSTS = [
  { id: "1", category: "Wellness", title: "5 Vitamins to Boost Your Winter Immunity", readTime: "4 min read", emoji: "🍊", bg: "oklch(0.92 0.12 75)" },
  { id: "2", category: "Baby Care", title: "A Parent's Guide to Choosing the Right Nappy", readTime: "6 min read", emoji: "👶", bg: "oklch(0.93 0.08 50)" },
  { id: "3", category: "Skincare", title: "Why Hyaluronic Acid Belongs in Your Routine", readTime: "5 min read", emoji: "💧", bg: "oklch(0.92 0.09 220)" },
];