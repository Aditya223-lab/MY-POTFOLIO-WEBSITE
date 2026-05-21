"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus, Save } from "lucide-react";
import {
  createAchievement,
  updateAchievement,
  deleteAchievement,
  type FormState,
} from "@/app/admin/actions";
import type { Achievement } from "@/app/generated/prisma/client";
import { ACHIEVEMENT_ICON_OPTIONS, getIcon } from "@/lib/icons";
import { SubmitButton, Feedback, Field } from "./ui";
import { DeleteButton } from "./DeleteButton";

const initialState: FormState = { ok: false, message: "" };

function IconSelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <select
      name="icon"
      className="field"
      defaultValue={defaultValue ?? "trophy"}
    >
      {ACHIEVEMENT_ICON_OPTIONS.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** "Add a new achievement" form. */
export function AchievementAddForm() {
  const [state, formAction] = useActionState(createAchievement, initialState);
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
        <Plus className="h-4 w-4 text-neon" /> Add a new achievement
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input
            name="title"
            className="field"
            placeholder="CTF Finalist — Cyber Challenge"
            required
          />
        </Field>
        <Field label="Icon">
          <IconSelect />
        </Field>
        <Field label="Date" hint="Free text, e.g. 2025 or Mar 2025.">
          <input name="date" className="field" placeholder="2025" />
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
      <Field label="Description">
        <textarea
          name="description"
          className="field min-h-20 resize-y"
          placeholder="What you did and why it mattered."
        />
      </Field>
      <Field label="Link" hint="Optional — proof, certificate, or write-up.">
        <input name="link" className="field" placeholder="https://…" />
      </Field>
      <div className="flex items-center gap-3">
        <SubmitButton icon={<Plus className="h-4 w-4" />}>
          Add achievement
        </SubmitButton>
        <Feedback state={state} />
      </div>
    </form>
  );
}

/** Editable row for one existing achievement. */
export function AchievementRow({ item }: { item: Achievement }) {
  const [state, formAction] = useActionState(updateAchievement, initialState);
  const Icon = getIcon(item.icon);

  return (
    <form action={formAction} className="card flex flex-col gap-4 p-5">
      <input type="hidden" name="id" value={item.id} />

      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon/25 bg-neon/5 text-neon">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="font-semibold">{item.title}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input
            name="title"
            className="field"
            defaultValue={item.title}
            required
          />
        </Field>
        <Field label="Icon">
          <IconSelect defaultValue={item.icon} />
        </Field>
        <Field label="Date">
          <input
            name="date"
            className="field"
            defaultValue={item.date}
          />
        </Field>
        <Field label="Order">
          <input
            name="order"
            type="number"
            className="field"
            defaultValue={item.order}
          />
        </Field>
      </div>
      <Field label="Description">
        <textarea
          name="description"
          className="field min-h-20 resize-y"
          defaultValue={item.description}
        />
      </Field>
      <Field label="Link">
        <input
          name="link"
          className="field"
          defaultValue={item.link ?? ""}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton icon={<Save className="h-4 w-4" />}>Save</SubmitButton>
        <Feedback state={state} />
        <div className="ml-auto">
          <DeleteButton
            onDelete={deleteAchievement.bind(null, item.id)}
            label="Delete"
            confirmText={`Delete "${item.title}"?`}
          />
        </div>
      </div>
    </form>
  );
}
