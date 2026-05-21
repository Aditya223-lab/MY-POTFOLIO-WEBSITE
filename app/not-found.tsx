import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cyber-grid absolute inset-0 opacity-40" />
        <div className="glow-blob left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 bg-magenta/15" />
      </div>

      <div className="relative">
        <p className="neon-text text-7xl font-extrabold sm:text-9xl">404</p>
        <p className="mt-4 font-mono text-sm text-neon">
          // signal lost — page not found
        </p>
        <p className="mt-2 max-w-sm text-muted">
          The page you’re looking for moved, never existed, or was unpublished.
        </p>
        <Link href="/" className="btn btn-primary mt-7">
          Return home
        </Link>
      </div>
    </div>
  );
}
