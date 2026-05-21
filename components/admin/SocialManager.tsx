"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus, Save } from "lucide-react";
import {
  createSocial,
  updateSocial,
  deleteSocial,
  type FormState,
} from "@/app/admin/actions";
import type { SocialLink } from "@/app/generated/prisma/client";
import { SOCIAL_ICON_OPTIONS, getIcon } from "@/lib/icons";
import { SubmitButton, Feedback, Field } from "./ui";
import { DeleteButton } from "./DeleteButton";

const initialState: FormState = { ok: false, message: "" };

function IconSelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <select
      name="icon"
      className="field"
      defaultValue={defaultValue ?? "link"}
    >
      {SOCIAL_ICON_OPTIONS.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** "Add a new social link" form. */
export function SocialAddForm() {
  const [state, formAction] = useActionState(createSocial, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="card flex flex-col gap-4 border-neon/25 p-5"
    >
      <p className="flex items-center gap-2 font-semibold">
        <Plus className="h-4 w-4 text-neon" /> Add a new link
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Platform name">
          <input
            name="platform"
            className="field"
            placeholder="GitHub"
            required
          />
        </Field>
        <Field label="Icon">
          <IconSelect />
        </Field>
        <Field label="URL">
          <input
            name="url"
            className="field"
            placeholder="https://github.com/you"
            required
          />
        </Field>
        <Field label="Label" hint="Optional — a handle or short text.">
          <input name="label" className="field" placeholder="@username" />
        </Field>
        <Field label="Order" hint="Lower numbers show first.">
          <input
            name="order"
            type="number"
            className="field"
            defaultValue={0}
          />
        </Field>
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton icon={<Plus className="h-4 w-4" />}>
          Add link
        </SubmitButton>
        <Feedback state={state} />
      </div>
    </form>
  );
}

/** Editable row for one existing social link. */
export function SocialRow({ social }: { social: SocialLink }) {
  const [state, formAction] = useActionState(updateSocial, initialState);
  const Icon = getIcon(social.icon);

  return (
    <form action={formAction} className="card flex flex-col gap-4 p-5">
      <input type="hidden" name="id" value={social.id} />

      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon/25 bg-neon/5 text-neon">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="font-semibold">{social.platform}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Platform name">
          <input
            name="platform"
            className="field"
            defaultValue={social.platform}
            required
          />
        </Field>
        <Field label="Icon">
          <IconSelect defaultValue={social.icon} />
        </Field>
        <Field label="URL">
          <input
            name="url"
            className="field"
            defaultValue={social.url}
            required
          />
        </Field>
        <Field label="Label">
          <input
            name="label"
            className="field"
            defaultValue={social.label}
          />
        </Field>
        <Field label="Order">
          <input
            name="order"
            type="number"
            className="field"
            defaultValue={social.order}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="visible"
            defaultChecked={social.visible}
            className="h-4 w-4 accent-[var(--color-neon)]"
          />
          Visible on site
        </label>
        <SubmitButton icon={<Save className="h-4 w-4" />}>Save</SubmitButton>
        <Feedback state={state} />
        <div className="ml-auto">
          <DeleteButton
            onDelete={deleteSocial.bind(null, social.id)}
            label="Delete"
            confirmText={`Delete the ${social.platform} link?`}
          />
        </div>
      </div>
    </form>
  );
}
