import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/blog/BlogLayout";
import BlogContent from "@/components/blog/BlogContent";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import { blogs } from "@/content/blogs";

const blog = blogs.find(
  (b) => b.slug === "system-design-url-shortener"
)!;
// // Import markdown as raw text
// import content from "@/content/blogs/system-design-url-shortener-detailed.md?raw";


const UrlShortenerBlog = () => {
  return (
    <>
      <Helmet>
        <title>System Design: URL Shortener | ShashCode</title>
        <meta
          name="description"
          content="Complete system design guide for URL Shortener (TinyURL) with capacity estimation, database design, caching, and scalability."
        />
      </Helmet>

      <BlogLayout
        title="System Design: URL Shortener"
        subtitle="A complete beginner-to-interview-ready system design walkthrough."
      >
        <BlogContent>
          <MarkdownRenderer content={blog.content} />
        </BlogContent>
      </BlogLayout>
    </>
  );
};

export default UrlShortenerBlog;
