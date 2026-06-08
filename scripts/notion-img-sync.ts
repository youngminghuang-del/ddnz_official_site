import fs from "fs";
import path from "path";

const LOCAL_IMAGE_DIR = path.join(process.cwd(), "public", "images", "posts");

// Ensure image directory exists
if (!fs.existsSync(LOCAL_IMAGE_DIR)) {
  fs.mkdirSync(LOCAL_IMAGE_DIR, { recursive: true });
}

/**
 * Generates an SEO friendly slug from a page title.
 * Falls back if title results in empty/short slug.
 */
export function generateSlug(title: string, fallbackId: string): string {
  if (!title) return `post-${fallbackId.slice(0, 8)}`;
  
  const slug = title
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accent diacritics
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric except spaces/hyphens
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  if (!slug || slug === "-") {
    return `post-${fallbackId.slice(0, 8)}`;
  }
  return slug;
}

/**
 * Checks if URL is a Notion-hosted or AWS S3 temporal image.
 */
export function isNotionTemporalUrl(url: string): boolean {
  if (!url) return false;
  return url.includes("secure.notion-static.com") || url.includes("amazonaws.com");
}

/**
 * Synchronously or asynchronously downloads a Notion image and returns the local reference path.
 */
export async function downloadNotionImage(notionImageUrl: string, slug: string, index: number | string): Promise<string> {
  if (!isNotionTemporalUrl(notionImageUrl)) {
    return notionImageUrl;
  }

  try {
    // Determine extension, default to .png
    const urlWithoutParams = notionImageUrl.split("?")[0];
    let ext = path.extname(urlWithoutParams) || ".png";
    
    // Clean up extensions with unusual suffixes or query left-overs
    if (ext.includes(";")) {
      ext = ext.split(";")[0];
    }
    
    const fileName = `${slug}-${index}${ext}`;
    const localPath = path.join(LOCAL_IMAGE_DIR, fileName);
    const webReferencePath = `/images/posts/${fileName}`;

    console.log(`Downloading Notion image: ${fileName}`);
    const response = await fetch(notionImageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await fs.promises.writeFile(localPath, buffer);
    console.log(`Successfully saved image locally: ${webReferencePath}`);
    return webReferencePath;
  } catch (error) {
    console.error(`Error downloading image for ${slug}-${index}:`, error);
    return notionImageUrl; // Fail gracefully by returning original url
  }
}
