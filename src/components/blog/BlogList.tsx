import BlogCard from "./BlogCard";
import { blogs } from "@/content/blogs";

const BlogList = () => {
  return (
    <div className="space-y-8">
      {blogs.map((blog) => (
        <BlogCard key={blog.slug} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
