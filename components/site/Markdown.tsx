import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { remarkCallout } from "@/lib/remark-callout";

/** Renders blog markdown with GitHub-flavored syntax + code highlighting. */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-cyber">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkCallout]}
        // `detect` lets fenced blocks without a language tag still get coloured.
        rehypePlugins={[[rehypeHighlight, { detect: true }]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
