"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import type { FormState } from "@/app/admin/actions";

/** Submit button that shows a spinner while the form action runs. */
export function SubmitButton({
  children,
  className = "btn btn-primary",
  icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {pending ? "Saving…" : children}
    </button>
  );
}

/** Inline success / error banner driven by a form action's return value. */
export function Feedback({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-sm ${
        state.ok
          ? "border-neon/40 bg-neon/10 text-neon"
          : "border-magenta/40 bg-magenta/10 text-magenta"
      }`}
    >
      {state.message}
    </div>
  );
}

/** Labelled field wrapper. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
      {hint ? (
        <span className="mt-1 block text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}
