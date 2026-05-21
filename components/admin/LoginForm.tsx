"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { login, type FormState } from "@/app/admin/actions";
import { SubmitButton, Feedback } from "./ui";

const initialState: FormState = { ok: false, message: "" };

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="block">
        <span className="field-label">Admin password</span>
        <input
          name="password"
          type="password"
          className="field"
          placeholder="••••••••••"
          autoFocus
          required
        />
      </label>

      <Feedback state={state} />

      <SubmitButton className="btn btn-primary w-full" icon={<LogIn className="h-4 w-4" />}>
        Enter the panel
      </SubmitButton>
    </form>
  );
}
