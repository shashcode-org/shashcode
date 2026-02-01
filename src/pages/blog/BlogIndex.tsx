import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/blog/BlogLayout";
import BlogList from "@/components/blog/BlogList";
const BlogIndex = () => {
  return (
    <>
      <Helmet>
        <title>Blog | ShashCode</title>
        <meta
          name="description"
          content="In-depth blogs on System Design, DSA, and interview preparation by ShashCode."
        />
      </Helmet>

      <BlogLayout
        title="ShashCode Blog"
        subtitle="System Design, DSA insights, and interview-ready explanations — written with clarity, not jargon."
      >
      <BlogList />
      </BlogLayout>
    </>
  );
};

export default BlogIndex;
