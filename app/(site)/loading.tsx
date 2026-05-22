/** Cyberpunk loading screen — shown while a page fetches its data. */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-bg">
      <div aria-hidden className="cyber-grid absolute inset-0 opacity-40" />
      <div className="glow-blob left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-neon/15" />

      <div className="relative flex flex-col items-center gap-5">
        {/* spinning neon ring */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-line" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-neon border-t-neon" />
          <div className="absolute inset-3 animate-pulse-glow rounded-full bg-neon/25" />
        </div>
        <p className="font-mono text-sm text-muted">
          <span className="text-neon">&gt;</span> loading
          <span className="animate-blink text-neon">_</span>
        </p>
      </div>
    </div>
  );
}
