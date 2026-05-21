"use client";

import dynamic from "next/dynamic";

// three.js touches browser APIs — load the scene on the client only.
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse-glow rounded-full border border-neon/40 bg-neon/5" />
    </div>
  );
}

/** Square, glowing container for the interactive 3D hero object. */
export default function HeroCanvas() {
  return (
    <div className="relative aspect-square w-full max-w-[460px]">
      {/* ambient glow behind the object */}
      <div className="glow-blob inset-6 bg-neon/40" />
      <div className="glow-blob inset-16 bg-magenta/30" />
      <div className="relative h-full w-full cursor-grab active:cursor-grabbing">
        <Scene />
      </div>
      <p className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs text-muted">
        [ drag to rotate ]
      </p>
    </div>
  );
}
