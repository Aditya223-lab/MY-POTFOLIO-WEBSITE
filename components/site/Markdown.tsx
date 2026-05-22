import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { remarkCallout } from "@/lib/remark-callout";
import { CodeBlock } from "./CodeBlock";

/** Renders blog markdown with GitHub-flavored syntax + code highlighting. */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-cyber">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkCallout]}
        // `detect` lets fenced blocks without a language tag still get coloured.
        rehypePlugins={[[rehypeHighlight, { detect: true }]]}
        // Swap <pre> for a version with a "Copy" button.
        components={{ pre: CodeBlock }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
