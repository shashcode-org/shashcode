import { ReactNode } from "react";

interface BlogContentProps {
  children: ReactNode;
}

const BlogContent = ({ children }: BlogContentProps) => {
  return (
    <article
      className="
        prose prose-slate dark:prose-invert
        max-w-none
        prose-p:leading-relaxed
        prose-p:text-[1.05rem]
        prose-h2:mt-12 prose-h2:mb-4
        prose-h3:mt-8 prose-h3:mb-3
        prose-code:text-sm
      "
    >
      {children}
    </article>
  );
};

export default BlogContent;
