"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateProfile, type FormState } from "@/app/admin/actions";
import type { Profile } from "@/app/generated/prisma/client";
import { SubmitButton, Feedback, Field } from "./ui";
import { ImageUpload } from "./ImageUpload";
import { PdfUpload } from "./PdfUpload";

const initialState: FormState = { ok: false, message: "" };

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="card p-5">
        <ImageUpload
          name="avatarUrl"
          defaultValue={profile.avatarUrl ?? ""}
          label="Profile photo"
          round
        />
      </div>

      <div className="card flex flex-col gap-5 p-5">
        <Field label="Full name">
          <input
            name="name"
            className="field"
            defaultValue={profile.name}
            required
          />
        </Field>

        <Field label="Headline" hint="Your role — shown under your name.">
          <input
            name="headline"
            className="field"
            defaultValue={profile.headline}
            placeholder="Cybersecurity & Code Enthusiast"
          />
        </Field>

        <Field
          label="Sub-headline"
          hint="The short intro line on your hero section."
        >
          <textarea
            name="subheadline"
            className="field min-h-20 resize-y"
            defaultValue={profile.subheadline}
          />
        </Field>

        <Field
          label="About / bio"
          hint="Tell your story. Leave a blank line between paragraphs."
        >
          <textarea
            name="bio"
            className="field min-h-44 resize-y"
            defaultValue={profile.bio}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Location">
            <input
              name="location"
              className="field"
              defaultValue={profile.location ?? ""}
              placeholder="City, Country"
            />
          </Field>
          <Field label="Contact email">
            <input
              name="email"
              type="email"
              className="field"
              defaultValue={profile.email ?? ""}
              placeholder="you@example.com"
            />
          </Field>
        </div>

        <PdfUpload
          name="resumeUrl"
          defaultValue={profile.resumeUrl ?? ""}
          label="CV / Résumé (PDF)"
        />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton icon={<Save className="h-4 w-4" />}>
          Save profile
        </SubmitButton>
        <Feedback state={state} />
      </div>
    </form>
  );
}
