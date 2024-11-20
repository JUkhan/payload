import type { RelationshipFieldSingleValidation } from "payload";
import { CollectionConfig, TextFieldSingleValidation } from "payload";
import { MDXBlock } from "@/blocks/MarkdownBlock/mdx-block";

const validateParent: RelationshipFieldSingleValidation = async (
  value,
  options
) => {
  if (!value) return true;
  if (value === options.id) return "A document cannot be its own parent";

  // Get all ancestors to check for cycles
  const payload = options.req.payload;
  let currentId = typeof value === "object" ? value.value : value;

  if (typeof currentId !== "string")
    return "Invalid parent ID. Expected a string.";

  // Only add options.id to visited set if it's not undefined
  const visited = new Set<string | number>(options.id ? [options.id] : []);

  // Get all docs in one query
  const allDocs = await payload.find({
    collection: "documentation",
    limit: 0,
  });

  const docsMap = new Map(allDocs.docs.map((doc) => [doc.id, doc]));

  while (currentId) {
    if (visited.has(currentId))
      return "Cyclic dependency detected. A document cannot be a descendant of itself";

    visited.add(currentId);

    const doc = docsMap.get(currentId as string);
    if (!doc) break;

    currentId =
      doc.parent && typeof doc.parent === "object"
        ? doc.parent.id
        : (doc.parent as string);
  }

  return true;
};

const singleStringValidationWithSiblingUnique =
  (label: string): TextFieldSingleValidation =>
  async (value, args) => {
    if (!value) return `${label} is required`;
    if (!/^[a-z-]+$/.test(value))
      return `${label} must only contain lowercase letters and hyphens (-)`;

    // Validate uniqueness among siblings
    const { req, data, id } = args;
    const payload = req.payload;
    const parentId = (data as any).parent as string | null | undefined;

    // Get all siblings (documents with the same parent)
    const siblings = await payload.find({
      collection: "documentation",
      where: {
        and: [
          {
            parent: {
              equals: parentId,
            },
          },
          {
            id: {
              not_equals: id, // Exclude current document
            },
          },
          // If no parent (root level), check all root level docs
          ...(parentId === ""
            ? [
                {
                  parent: {
                    exists: false,
                  },
                },
              ]
            : []),
        ],
      },
    });

    // Check if any sibling has the same fileName
    const hasDuplicate = siblings.docs.some((doc) => doc.fileName === value);
    if (hasDuplicate)
      return parentId === ""
        ? "File name must be unique at the root level"
        : "File name must be unique among siblings in the same folder";

    return true;
  };

export const Documentation: CollectionConfig = {
  slug: "documentation",
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: "fileName",
  },
  fields: [
    {
      type: "text",
      name: "fileName",
      label: "File Name",
      required: true,
      validate: singleStringValidationWithSiblingUnique("File Name"),
      admin: {
        description:
          "Use hyphens (-) to separate words. Spaces are not allowed.",
      },
    },
    {
      type: "checkbox",
      name: "isFolder",
      label: "Is Folder",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      type: "text",
      name: "folderName",
      label: "Folder Name",
      required: true,
      validate: singleStringValidationWithSiblingUnique("Folder Name"),
      admin: {
        condition: (data) => Boolean(data?.isFolder),
        position: "sidebar",
        description:
          "Use hyphens (-) to separate words. Spaces are not allowed.",
      },
    },
    {
      type: "relationship",
      relationTo: "documentation",
      name: "parent",
      filterOptions: {
        isFolder: {
          equals: true,
        },
      },
      validate: validateParent,
      admin: {
        position: "sidebar",
      },
    },
    {
      type: "blocks",
      name: "content",
      label: "Content",
      blocks: [MDXBlock],
      required: true,
      minRows: 1,
    },
  ],
};
