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
  const darkText = (s as { textDark?: boolean }).textDark;
  return (
    <div className="relative overflow-hidden rounded-sm shadow-md">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex min-h-[240px] items-center justify-between gap-4 p-6 md:min-h-[360px] md:p-14 ${darkText ? "text-foreground" : "text-white"}`}
          style={{ background: s.gradient }}
        >
          <div className="max-w-xl">
            <div className={`mb-3 inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${darkText ? "bg-primary text-primary-foreground" : "bg-white/20 backdrop-blur"}`}>Featured Promotion</div>
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">{s.headline}</h1>
            <p className="mt-3 text-sm md:text-lg">{s.subtext}</p>
            <Link to={s.href} className={`mt-6 inline-block rounded-sm px-7 py-3 text-sm font-bold uppercase tracking-wide shadow-sm transition ${darkText ? "bg-primary text-primary-foreground hover:bg-primary-dark" : "bg-accent text-accent-foreground hover:brightness-95"}`}>
              {s.cta} →
            </Link>
          </div>
          <div className="hidden text-8xl drop-shadow-2xl md:block md:text-9xl">{s.emoji}</div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {HERO_SLIDES.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-2 bg-foreground/30"}`} aria-label={`Slide ${idx + 1}`} />
        ))}
      </div>
    </div>
  );
}