import { Block } from "payload";

export const MDXBlock: Block = {
  slug: "mdx", // required
  imageURL: "https://cdn-icons-png.flaticon.com/512/10122/10122180.png",
  interfaceName: "MDXBlock", // optional
  fields: [
    {
      name: "mdx",
      type: "textarea",
      required: true,
      validate: (value) => {
        if (!value) return "MDX content is required";

        // Check for frontmatter
        const frontmatterMatch = value.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return "Frontmatter is required";

        // Parse frontmatter content
        const frontmatter = frontmatterMatch[1];

        // Check if title exists and has minimum length
        const titleMatch = frontmatter.match(/title:\s*(.+)/);
        if (!titleMatch) return "Title is required in frontmatter";

        const title = titleMatch[1].trim();
        if (title.length < 3) return "Title must be at least 3 characters long";

        return true;
      },
    },
  ],
};
