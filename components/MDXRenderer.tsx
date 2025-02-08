"use client";
import { useEffect, useState } from "react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight"; // For syntax highlighting
import remarkToc from "remark-toc";
import Loading from "./Loading";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";

const MDXRenderer = ({ mdxString }: { mdxString: string }) => {
  const [mdxSource, setMdxSource] = useState<any>(null);

  useEffect(() => {
    const renderMDX = async () => {
      try {
        const serializedMDX = await serialize(mdxString, {
          mdxOptions: {    
            remarkPlugins: [remarkGfm, remarkToc], // GFM & TOC are remark plugins
            rehypePlugins: [rehypeHighlight],  
          },
        });
        setMdxSource(serializedMDX);
      } catch (error) {
        console.error("Error serializing MDX:", error);
      }
    };

    renderMDX();
  }, [mdxString]);

  useEffect(() => {
    if (mdxSource) {
      applyHieroglyphEffect();
    }
  }, [mdxSource]);

  if (!mdxSource) return <Loading />;

  return (
    <div className="mdx-container">
      <MDXRemote {...mdxSource} />
    </div>
  );
};

export default MDXRenderer;
