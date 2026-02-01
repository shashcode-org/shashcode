import { Link } from "react-router-dom";
import { BlogMeta } from "@/content/blogs";

interface BlogCardProps {
  blog: BlogMeta;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="block border border-border/40 rounded-xl p-6 hover:bg-muted/40 transition-colors"
    >
      <div className="space-y-3">
        <span className="text-sm text-muted-foreground">
          {blog.category}
        </span>

        <h2 className="text-xl font-semibold leading-snug">
          {blog.title}
        </h2>

        <p className="text-muted-foreground">
          {blog.description}
        </p>

        <div className="text-sm text-muted-foreground flex gap-3">
          <span>{blog.date}</span>
          <span>•</span>
          <span>{blog.readingTime}</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
