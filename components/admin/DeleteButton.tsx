"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";

/**
 * Confirms, then runs a bound server action (e.g. deleteBlog.bind(null, id)).
 */
export function DeleteButton({
  onDelete,
  label = "Delete",
  confirmText = "Are you sure you want to delete this? This can't be undone.",
  className = "btn btn-danger",
}: {
  onDelete: () => Promise<void>;
  label?: string;
  confirmText?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) {
          startTransition(() => onDelete());
        }
      }}
      className={className}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      {label}
    </button>
  );
}
