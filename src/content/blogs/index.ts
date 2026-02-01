import fm from "front-matter";

// Load all markdown files as raw text (Vite feature)
const blogModules = import.meta.glob("./*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});


export interface BlogFrontmatter {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  category: string;
}

export interface BlogMeta extends BlogFrontmatter {
  content: string;
}

export const blogs: BlogMeta[] = Object.entries(blogModules).map(
  ([_, rawContent]) => {
    const { attributes, body } = fm<BlogFrontmatter>(
      rawContent as string
    );

    return {
      slug: attributes.slug,
      title: attributes.title,
      description: attributes.description,
      date: attributes.date,
      readingTime: attributes.readingTime,
      category: attributes.category,
      content: body,
    };
  }
);
