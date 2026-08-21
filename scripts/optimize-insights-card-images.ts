import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

type InsightPost = {
  id?: string;
  slug?: string;
  thumbnailUrl?: string;
  listingThumbnailUrl?: string;
  listingThumbnailSrcSet?: string;
  [key: string]: unknown;
};

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, 'public');
const dataPath = path.join(projectRoot, 'src', 'data', 'notionBlogData.json');
const outputDirectory = path.join(publicRoot, 'images', 'posts', '_cards');
const widths = [480, 960] as const;

function safeAssetStem(post: InsightPost) {
  const raw = `${post.slug || 'article'}-${String(post.id || '').replaceAll('-', '').slice(0, 8)}`;
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'article-cover';
}

function localImagePath(source: string) {
  let pathname = source;

  if (/^https?:\/\//i.test(source)) {
    const parsed = new URL(source);
    if (!['www.ddnzglobal.com', 'ddnzglobal.com'].includes(parsed.hostname.toLowerCase())) return null;
    pathname = parsed.pathname;
  }

  if (!pathname.startsWith('/')) return null;
  const resolved = path.resolve(publicRoot, `.${decodeURIComponent(pathname)}`);
  if (!resolved.startsWith(`${publicRoot}${path.sep}`)) return null;
  return resolved;
}

function optimizedUnsplashUrl(source: string, width: number) {
  try {
    const parsed = new URL(source);
    if (parsed.hostname.toLowerCase() !== 'images.unsplash.com') return null;
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    parsed.searchParams.set('w', String(width));
    parsed.searchParams.set('q', width <= 480 ? '70' : '76');
    return parsed.toString();
  } catch {
    return null;
  }
}

async function createLocalVariants(post: InsightPost, source: string) {
  const sourcePath = localImagePath(source);
  if (!sourcePath || !fs.existsSync(sourcePath)) return null;

  const stem = safeAssetStem(post);
  const variants: Array<{ width: number; url: string }> = [];

  for (const width of widths) {
    const height = Math.round(width * 9 / 16);
    const fileName = `${stem}-${width}.webp`;
    const outputPath = path.join(outputDirectory, fileName);

    await sharp(sourcePath)
      .rotate()
      .resize({ width, height, fit: 'cover', position: 'attention', withoutEnlargement: true })
      .webp({ quality: width <= 480 ? 72 : 76, effort: 4 })
      .toFile(outputPath);

    variants.push({ width, url: `/images/posts/_cards/${fileName}` });
  }

  return variants;
}

async function main() {
  const posts = JSON.parse(await fs.promises.readFile(dataPath, 'utf8')) as InsightPost[];
  await fs.promises.mkdir(outputDirectory, { recursive: true });

  let optimized = 0;
  let unchanged = 0;

  for (const post of posts) {
    const source = typeof post.thumbnailUrl === 'string' ? post.thumbnailUrl : '';
    if (!source) continue;

    let variants = await createLocalVariants(post, source);
    if (!variants) {
      const unsplashVariants = widths.flatMap((width) => {
        const url = optimizedUnsplashUrl(source, width);
        return url ? [{ width, url }] : [];
      });
      variants = unsplashVariants.length === widths.length ? unsplashVariants : null;
    }

    if (!variants) {
      delete post.listingThumbnailUrl;
      delete post.listingThumbnailSrcSet;
      unchanged += 1;
      continue;
    }

    const largest = variants[variants.length - 1];
    post.listingThumbnailUrl = largest.url;
    post.listingThumbnailSrcSet = variants.map(({ width, url }) => `${url} ${width}w`).join(', ');
    optimized += 1;
  }

  await fs.promises.writeFile(dataPath, `${JSON.stringify(posts, null, 2)}\n`);
  console.log(`Insights card images ready: ${optimized} optimized, ${unchanged} unchanged.`);
}

main().catch((error) => {
  console.error('Failed to optimize Insights card images:', error);
  process.exitCode = 1;
});
