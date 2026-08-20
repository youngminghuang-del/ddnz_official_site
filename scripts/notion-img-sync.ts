import fs from "fs";
import path from "path";

const LOCAL_IMAGE_DIR = path.join(process.cwd(), "public", "images", "posts");

export type NotionImageDownloadOptions = {
  fetchImpl?: typeof fetch;
  imageDir?: string;
  maxAttempts?: number;
  retryDelayMs?: number;
  strict?: boolean;
};

const wait = (milliseconds: number) =>
  milliseconds > 0 ? new Promise((resolve) => setTimeout(resolve, milliseconds)) : Promise.resolve();

async function fetchNotionImageWithRetry(
  imageUrl: string,
  label: string,
  options: NotionImageDownloadOptions,
) {
  const fetchImpl = options.fetchImpl || fetch;
  const maxAttempts = Math.max(1, options.maxAttempts ?? 3);
  const retryDelayMs = Math.max(0, options.retryDelayMs ?? 500);
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetchImpl(imageUrl);
      if (response.ok) return response;

      const error = new Error(`Failed to fetch image: ${response.status} ${response.statusText}`.trim());
      const retryableStatus = response.status === 408 || response.status === 429 || response.status >= 500;
      if (!retryableStatus) throw error;
      lastError = error;
    } catch (error) {
      lastError = error;
    }

    if (attempt < maxAttempts) {
      console.warn(`Retrying Notion image ${label} after attempt ${attempt}/${maxAttempts}.`);
      await wait(retryDelayMs * 2 ** (attempt - 1));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Failed to fetch image");
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
export async function downloadNotionImage(
  notionImageUrl: string,
  slug: string,
  index: number | string,
  options: NotionImageDownloadOptions = {},
): Promise<string> {
  if (!isNotionTemporalUrl(notionImageUrl)) {
    return notionImageUrl;
  }

  try {
    const imageDir = options.imageDir || LOCAL_IMAGE_DIR;
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    // Determine extension, default to .png
    const urlWithoutParams = notionImageUrl.split("?")[0];
    let ext = path.extname(urlWithoutParams) || ".png";
    
    // Clean up extensions with unusual suffixes or query left-overs
    if (ext.includes(";")) {
      ext = ext.split(";")[0];
    }
    
    const fileName = `${slug}-${index}${ext}`;
    const localPath = path.join(imageDir, fileName);
    const webReferencePath = `/images/posts/${fileName}`;

    console.log(`Downloading Notion image: ${fileName}`);
    const response = await fetchNotionImageWithRetry(notionImageUrl, `${slug}-${index}`, options);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!buffer.length) {
      throw new Error("Downloaded image is empty");
    }

    // Signed Notion URLs can point a stable slug/index filename at a newly
    // replaced source asset. Always fetch the current bytes; only reuse the
    // local file after comparing content, never merely because the name exists.
    if (fs.existsSync(localPath)) {
      const existingBuffer = await fs.promises.readFile(localPath);
      if (existingBuffer.equals(buffer)) {
        console.log(`Verified unchanged Notion image: ${webReferencePath}`);
        return webReferencePath;
      }
    }

    const temporaryPath = `${localPath}.${process.pid}-${Date.now()}.tmp`;
    try {
      await fs.promises.writeFile(temporaryPath, buffer);
      await fs.promises.rename(temporaryPath, localPath);
    } finally {
      if (fs.existsSync(temporaryPath)) {
        await fs.promises.unlink(temporaryPath);
      }
    }
    console.log(`Successfully localized current Notion image: ${webReferencePath}`);
    return webReferencePath;
  } catch (error) {
    console.error(`Error downloading image for ${slug}-${index}:`, error);
    if (options.strict) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`Strict Notion image localization failed for ${slug}-${index}: ${reason}`, {
        cause: error,
      });
    }
    // Local previews may remain usable when Notion is temporarily unavailable,
    // but never claim an older same-name file represents the current source.
    return notionImageUrl;
  }
}
