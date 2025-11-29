"use client";
import { useEffect, useState } from "react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight"; // For syntax highlighting
import remarkToc from "remark-toc";
import Loading from "./Loading";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

const MDXRenderer = ({ mdxString }: { mdxString: string }) => {
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const renderMDX = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Clean up common MDX issues before parsing
        let cleanedMdxString = mdxString;

        // Remove HTML tags and convert to markdown if needed
        // This helps prevent unclosed tag issues
        cleanedMdxString = cleanedMdxString
          // Remove unclosed structural tags at end of lines
          .replace(/<(article|section|div|main|header|footer|aside|nav)\s*>\s*$/gm, '')
          .replace(/<\/(article|section|div|main|header|footer|aside|nav)\s*>\s*$/gm, '')
          // Remove all structural HTML tags entirely
          .replace(/<\/?(?:article|section|div|main|header|footer|aside|nav)[^>]*>/g, '\n')
          // Handle paragraph tags
          .replace(/<p>\s*$/gm, '') // Remove unclosed <p> tags at end of lines
          .replace(/<\/p>\s*$/gm, '') // Remove loose closing </p> tags
          .replace(/<p>/g, '\n\n') // Convert <p> to markdown paragraph breaks
          .replace(/<\/p>/g, '\n\n') // Convert </p> to markdown paragraph breaks
          // Handle header tags
          .replace(/<h([1-6])>/g, (match, level) => '\n' + '#'.repeat(parseInt(level)) + ' ') // Convert <h1-6> to markdown
          .replace(/<\/h[1-6]>/g, '\n\n') // Close headers
          // Normalize whitespace
          .replace(/\n{3,}/g, '\n\n'); // Normalize multiple newlines

        const serializedMDX = await serialize(cleanedMdxString, {
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkToc],
            rehypePlugins: [rehypeHighlight],
          },
        });
        setMdxSource(serializedMDX);
      } catch (err) {
        console.error("Error serializing MDX:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);

        // Try to render as plain text as fallback
        try {
          const plainText = mdxString
            .replace(/<[^>]*>/g, '') // Strip all HTML tags
            .replace(/\n{3,}/g, '\n\n'); // Normalize newlines

          const fallbackMDX = await serialize(plainText, {
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          });
          setMdxSource(fallbackMDX);
        } catch (fallbackError) {
          console.error("Fallback rendering also failed:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (mdxString) {
      renderMDX();
    }
  }, [mdxString]);

  useEffect(() => {
    if (mdxSource) {
      applyHieroglyphEffect();
    }
  }, [mdxSource]);

  if (isLoading) return <Loading />;

  return (
    <div className="mdx-container space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Content Rendering Issue</AlertTitle>
          <AlertDescription className="text-sm">
            Some formatting may not display correctly. The content has been cleaned up and displayed below.
          </AlertDescription>
        </Alert>
      )}

      {mdxSource ? (
        <MDXRemote {...mdxSource} />
      ) : (
        <div className="p-6 border border-destructive/50 rounded-lg bg-destructive/5">
          <h3 className="text-lg font-semibold mb-2 text-destructive">Unable to Render Content</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The content could not be displayed due to formatting errors. Please contact support.
          </p>
          <details className="text-xs">
            <summary className="cursor-pointer font-medium mb-2">Raw Content (for debugging)</summary>
            <pre className="bg-muted p-4 rounded overflow-auto max-h-96">
              {mdxString}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default MDXRenderer;
