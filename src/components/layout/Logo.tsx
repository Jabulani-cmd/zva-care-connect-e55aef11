import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="Plus2 Pharmacy home">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-base font-extrabold tracking-tight text-foreground">Plus<span className="text-primary">2</span> Pharmacy</div>
        <div className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:block">Your Health, Our Priority</div>
      </div>
    </Link>
  );
}