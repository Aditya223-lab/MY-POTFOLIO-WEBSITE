/**
 * remark plugin: render Obsidian-style callouts.
 *
 * Obsidian writes a callout as a blockquote whose first line is a marker:
 *
 *   > [!note] Optional title
 *   > Body text…
 *
 * A plain Markdown renderer shows that as an ordinary quote with a literal
 * "[!note]" sitting in it. This plugin spots the marker, strips it, and turns
 * the blockquote into a styled <div class="callout callout-note"> with a title
 * row — see the `.callout` rules in app/globals.css.
 */

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
};

/** Maps every Obsidian callout name onto one of our five colour variants. */
const VARIANTS: Record<string, string> = {
  note: "note",
  info: "note",
  todo: "note",
  abstract: "note",
  summary: "note",
  tldr: "note",
  tip: "tip",
  hint: "tip",
  important: "tip",
  success: "success",
  check: "success",
  done: "success",
  question: "warning",
  help: "warning",
  faq: "warning",
  warning: "warning",
  caution: "warning",
  attention: "warning",
  danger: "danger",
  error: "danger",
  bug: "danger",
  failure: "danger",
  fail: "danger",
  missing: "danger",
  example: "example",
  quote: "example",
  cite: "example",
};

// e.g. "[!warning]+ Heads up"  ->  type "warning", title "Heads up"
const MARKER = /^\[!(\w+)\][+-]?[ \t]*(.*)$/;

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function transform(blockquote: MdNode) {
  const firstPara = blockquote.children?.[0];
  if (!firstPara || firstPara.type !== "paragraph") return;

  const firstText = firstPara.children?.[0];
  if (
    !firstText ||
    firstText.type !== "text" ||
    typeof firstText.value !== "string"
  ) {
    return;
  }

  // The marker only ever lives on the very first line.
  const newline = firstText.value.indexOf("\n");
  const firstLine =
    newline === -1 ? firstText.value : firstText.value.slice(0, newline);
  const match = firstLine.match(MARKER);
  if (!match) return;

  const variant = VARIANTS[match[1].toLowerCase()] ?? "note";
  const title = match[2].trim() || capitalize(match[1].toLowerCase());

  // Drop the marker line, keep whatever body text followed it.
  firstText.value = newline === -1 ? "" : firstText.value.slice(newline + 1);
  if (firstText.value === "" && firstPara.children!.length === 1) {
    blockquote.children!.shift();
  }

  // Prepend the title row.
  blockquote.children!.unshift({
    type: "paragraph",
    data: { hProperties: { className: ["callout-title"] } },
    children: [{ type: "strong", children: [{ type: "text", value: title }] }],
  });

  // Render as a <div> so it sheds the plain blockquote styling.
  blockquote.data = {
    hName: "div",
    hProperties: { className: ["callout", `callout-${variant}`] },
  };
}

function walk(node: MdNode) {
  if (!node.children) return;
  for (const child of node.children) {
    if (child.type === "blockquote") transform(child);
    walk(child);
  }
}

export function remarkCallout() {
  return (tree: MdNode) => walk(tree);
}
