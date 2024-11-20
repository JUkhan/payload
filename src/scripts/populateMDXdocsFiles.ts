//import { payloadLocal } from "@/data-access/actionUtils";
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import type { MDXBlock } from "@/payload-types";
import fs from "fs/promises";
import path from "path";

interface FolderInfo {
  name: string;
  parent?: string | null;
  content?: MDXBlock[] | null;
}

interface FileInfo {
  name: string;
  content?: MDXBlock[] | null;
  parent?: string | null;
}

async function populateMDXdocsFiles() {
  // 1. Initialize Payload
  const payload = await getPayloadHMR({config:configPromise});

  // 2. Clear the content/docs directory
  const docsPath = path.join(process.cwd(), "content/docs");
  try {
    await fs.rm(docsPath, { recursive: true, force: true });
    await fs.mkdir(docsPath, { recursive: true });
  } catch (error) {
    console.error("Error clearing docs directory:", error);
  }

  // 3. Get all published documentation entries
  const { docs } = await payload.find({
    collection: "documentation",
    depth: 0,
    where: {
      _status: {
        equals: "published",
      },
    },
    limit: 0,
  });

  // 4. Create a map of parent-child relationships
  const folderMap = new Map<string, FolderInfo>();
  const fileMap = new Map<string, FileInfo>();

  docs.forEach((doc) => {
    if (doc.isFolder && doc.folderName) {
      folderMap.set(doc.id, {
        name: doc.folderName,
        parent: doc.parent as string | null | undefined,
        content: doc.content,
      });
    } else {
      fileMap.set(doc.id, {
        name: doc.fileName,
        content: doc.content,
        parent: doc.parent as string | null | undefined,
      });
    }
  });

  // 5. Create folders recursively
  async function createFolder(
    folderId: string,
    basePath: string
  ): Promise<string> {
    const folder = folderMap.get(folderId);
    if (!folder) return basePath;

    const folderPath = folder.parent
      ? path.join(await createFolder(folder.parent, basePath), folder.name)
      : path.join(basePath, folder.name);

    await fs.mkdir(folderPath, { recursive: true });

    // Create index.mdx for folder if it has content
    if (folder.content) {
      const mdxContent =
        folder.content
          ?.filter((block): block is MDXBlock => block.blockType === "mdx")
          ?.map((block) => block.mdx)
          ?.join("\n\n") || "";

      const indexPath = path.join(folderPath, "index.mdx");
      await fs.writeFile(indexPath, mdxContent, "utf-8");
      console.log(`Created folder index: ${indexPath}`);
    }

    return folderPath;
  }

  // 6. Create all folders first
  for (const folderId of folderMap.keys()) {
    await createFolder(folderId, docsPath);
  }

  // 7. Write files with their MDX content
  for (const [fileId, file] of fileMap.entries()) {
    let targetPath = docsPath;

    if (file.parent) {
      const parentFolder = folderMap.get(file.parent);
      if (parentFolder) {
        targetPath = path.join(docsPath, parentFolder.name);
      }
    }

    const mdxContent =
      file.content
        ?.filter((block): block is MDXBlock => block.blockType === "mdx")
        ?.map((block) => block.mdx)
        ?.join("\n\n") || "";

    const filePath = path.join(targetPath, `${file.name}.mdx`);
    await fs.writeFile(filePath, mdxContent, "utf-8");
    console.log(`Created file: ${filePath}`);
  }

  console.log("Seed completed");
  process.exit(0);
}

populateMDXdocsFiles().catch((error) => {
  console.error("Seed error:", error);
  process.exit(1);
});
