import { Reveal } from "./Reveal";

/** Consistent "// tag" + big title heading used across home sections. */
export function SectionHeading({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mb-12 flex flex-col items-center text-center">
      <span className="font-mono text-sm text-neon">// {tag}</span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 max-w-2xl text-muted">{subtitle}</p>
      ) : null}
      <span className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-neon to-transparent" />
    </Reveal>
  );
}
