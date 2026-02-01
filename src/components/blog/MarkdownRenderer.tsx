import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                ul: ({ children }) => (
                    <ul className="list-disc pl-6 my-5 space-y-2">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal pl-6 my-5 space-y-2">
                        {children}
                    </ol>
                ),
                li: ({ children }) => (
                    <li className="leading-relaxed">
                        {children}
                    </li>
                ),
                h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mt-12 mb-6">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mt-12 mb-4">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mt-8 mb-3">
                        {children}
                    </h3>
                ),
                p: ({ children }) => (
                    <p className="leading-relaxed mb-5">
                        {children}
                    </p>
                ),
                pre: ({ children }) => (
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-6 text-sm">
                        {children}
                    </pre>
                ),
                code: ({ children }) => (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                        {children}
                    </code>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
