export function DemoBadge() {
  return (
    <div className="fixed bottom-20 right-3 z-50 select-none rounded-full bg-foreground/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-background shadow-lg backdrop-blur md:bottom-4">
      <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
      Demo Mode
    </div>
  );
}