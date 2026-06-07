import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { HERO_SLIDES } from "@/data/categories";
import { AnimatePresence, motion } from "framer-motion";

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = HERO_SLIDES[i];
  return (
    <div className="relative overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#111827] shadow-sm">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-[260px] w-full md:h-[480px]"
        >
          <img src={s.image} alt={s.headline} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 flex h-full max-w-7xl items-center px-6 md:px-12">
            <div className="max-w-xl text-white">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#86EFAC]">{s.eyebrow}</p>
              <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight md:text-[40px]">{s.headline}</h1>
              <p className="mt-3 text-sm text-white/90 md:text-base">{s.subtext}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={s.href}
                  className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  {s.cta}
                </Link>
                <Link
                  to="/prescriptions"
                  className="inline-flex items-center rounded-md border border-white/80 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-primary"
                >
                  Upload a Prescription
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full bg-white transition-all ${idx === i ? "w-8" : "w-2 opacity-50"}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}