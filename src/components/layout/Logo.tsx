import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="Plus2 Pharmacy home">
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-destructive text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-lg font-extrabold tracking-tight text-primary">Plus<span className="text-destructive">2</span><span className="text-foreground"> Pharmacy</span></div>
        <div className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:block">Your Health · Our Priority</div>
      </div>
    </Link>
  );
}