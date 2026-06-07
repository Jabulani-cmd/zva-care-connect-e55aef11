import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { HERO_SLIDES } from "@/data/categories";
import { AnimatePresence, motion } from "framer-motion";

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = HERO_SLIDES[i];
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg md:rounded-3xl">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex min-h-[260px] items-center justify-between gap-4 p-6 text-white md:min-h-[360px] md:p-12"
          style={{ background: s.gradient }}
        >
          <div className="max-w-xl">
            <div className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">Featured</div>
            <h1 className="text-2xl font-extrabold leading-tight md:text-5xl">{s.headline}</h1>
            <p className="mt-3 text-sm opacity-95 md:text-lg">{s.subtext}</p>
            <Link to={s.href} className="mt-5 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-foreground shadow hover:bg-surface">
              {s.cta} →
            </Link>
          </div>
          <div className="hidden text-8xl drop-shadow-2xl md:block md:text-9xl">{s.emoji}</div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {HERO_SLIDES.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-1.5 bg-white/50"}`} aria-label={`Slide ${idx + 1}`} />
        ))}
      </div>
    </div>
  );
}