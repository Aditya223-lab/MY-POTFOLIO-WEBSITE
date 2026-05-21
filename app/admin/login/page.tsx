import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cyber-grid absolute inset-0 opacity-50" />
        <div className="glow-blob left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 bg-neon/15" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neon/40 bg-neon/5 text-neon glow-cyan">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Control Panel</h1>
          <p className="mt-1 font-mono text-sm text-muted">
            // restricted access
          </p>
        </div>

        <div className="card p-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center font-mono text-xs text-muted">
          <Link href="/" className="hover:text-neon">
            ← back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
