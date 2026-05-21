import { Radar } from "lucide-react";

/**
 * Pure-CSS animated "threat scanner" radar — the cybersecurity-themed hero
 * visual. No 3D, no canvas, no libraries: it renders as static markup and
 * animates entirely on the GPU, so it loads instantly.
 */

// Concentric ring sizes (% of the radar disc).
const RINGS = [100, 67, 34];

// Detected "blips" — fixed spots that fade in/out on staggered timers.
const BLIPS = [
  { top: "31%", left: "63%", delay: "0s", tone: "cyan" },
  { top: "59%", left: "39%", delay: "1.2s", tone: "cyan" },
  { top: "43%", left: "73%", delay: "2.4s", tone: "magenta" },
  { top: "69%", left: "58%", delay: "0.7s", tone: "cyan" },
  { top: "27%", left: "42%", delay: "1.9s", tone: "magenta" },
  { top: "54%", left: "26%", delay: "3.2s", tone: "cyan" },
];

const READOUTS = [
  { label: "nodes", value: "06" },
  { label: "status", value: "secure" },
  { label: "latency", value: "12ms" },
];

export function CyberScanner() {
  return (
    <div className="relative aspect-square w-full max-w-[440px]">
      {/* ambient glow */}
      <div className="glow-blob inset-8 bg-neon/30" />
      <div className="glow-blob inset-20 bg-magenta/20" />

      {/* console panel */}
      <div className="card relative flex h-full w-full flex-col gap-3 p-4">
        {/* header */}
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
          <span className="flex items-center gap-1.5 text-neon">
            <Radar className="h-3.5 w-3.5" />
            threat scanner
          </span>
          <span className="flex items-center gap-1.5 text-muted">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon" />
            live
          </span>
        </div>

        {/* radar */}
        <div className="grid flex-1 place-items-center">
          <div className="relative aspect-square w-full max-w-[300px]">
            {/* concentric rings */}
            {RINGS.map((size) => (
              <div
                key={size}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon/20"
                style={{ width: `${size}%`, height: `${size}%` }}
              />
            ))}

            {/* crosshair */}
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-neon/15" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-neon/15" />

            {/* rotating sweep wash */}
            <div
              className="animate-radar absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(43,246,255,0) 0deg, rgba(43,246,255,0) 270deg, rgba(43,246,255,0.06) 318deg, rgba(43,246,255,0.42) 360deg)",
              }}
            />
            {/* rotating beam */}
            <div className="animate-radar absolute inset-0">
              <div className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-gradient-to-t from-transparent to-neon" />
            </div>

            {/* detected blips */}
            {BLIPS.map((b) => (
              <div
                key={`${b.top}-${b.left}`}
                className="animate-blip absolute h-2 w-2 rounded-full"
                style={{
                  top: b.top,
                  left: b.left,
                  animationDelay: b.delay,
                  background:
                    b.tone === "magenta"
                      ? "var(--color-magenta)"
                      : "var(--color-neon)",
                  boxShadow: `0 0 10px 2px ${
                    b.tone === "magenta"
                      ? "rgba(255,61,240,0.7)"
                      : "rgba(43,246,255,0.7)"
                  }`,
                }}
              />
            ))}

            {/* core */}
            <div className="animate-core absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon" />
          </div>
        </div>

        {/* readouts */}
        <div className="grid grid-cols-3 gap-2 border-t border-line pt-3">
          {READOUTS.map((r) => (
            <div key={r.label} className="text-center">
              <p className="font-mono text-sm font-bold text-neon">{r.value}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted">
                {r.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* corner brackets */}
      <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-neon" />
      <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-neon" />
      <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-neon" />
      <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-neon" />
    </div>
  );
}
