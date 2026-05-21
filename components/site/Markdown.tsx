import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

/** Renders blog markdown with GitHub-flavored syntax + code highlighting. */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-cyber">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
