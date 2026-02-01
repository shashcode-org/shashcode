import { ReactNode } from "react";

interface BlogSectionProps {
  title?: string;
  children: ReactNode;
}

const BlogSection = ({ title, children }: BlogSectionProps) => {
  return (
    <section className="mt-16 first:mt-0">
      {title && (
        <h2 className="text-2xl font-semibold mb-4">
          {title}
        </h2>
      )}

      <div className="space-y-5">
        {children}
      </div>

      {/* Subtle divider */}
      <div className="mt-12 border-b border-border/40" />
    </section>
  );
};

export default BlogSection;
