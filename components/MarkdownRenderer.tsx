import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
    children: string;
    className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children, className }) => {
    if (!children) return null;

    return (
        <div className={cn("prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:marker:text-primary", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ node, ...props }) => (
                        <a {...props} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer" />
                    ),
                    h1: ({ node, ...props }) => <h1 {...props} className="text-3xl mt-8 mb-4 first:mt-0" />,
                    h2: ({ node, ...props }) => <h2 {...props} className="text-2xl mt-8 mb-4" />,
                    h3: ({ node, ...props }) => <h3 {...props} className="text-xl mt-6 mb-3" />,
                    img: ({ node, ...props }) => (
                        <img {...props} className="rounded-xl border border-border my-6 shadow-md w-full max-h-[500px] object-cover" loading="lazy" />
                    ),
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6 rounded-lg border border-border">
                            <table {...props} className="w-full text-sm text-left" />
                        </div>
                    ),
                    thead: ({ node, ...props }) => <thead {...props} className="bg-muted text-foreground uppercase" />,
                    th: ({ node, ...props }) => <th {...props} className="px-6 py-3 font-bold" />,
                    td: ({ node, ...props }) => <td {...props} className="px-6 py-4 border-b border-border/50" />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote {...props} className="border-l-4 border-primary pl-4 italic my-6 bg-muted/30 p-4 rounded-r-lg" />
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
