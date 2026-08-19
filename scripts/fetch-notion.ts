import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { downloadNotionImage, generateSlug } from "./notion-img-sync";

dotenv.config({ path: ".env.local" });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const STRICT_SYNC = process.env.CI === "true" || process.env.STRICT_NOTION_SYNC === "true";

const outputFilePath = path.join(process.cwd(), "src", "data", "notionBlogData.json");
const redirectFilePath = path.join(process.cwd(), "src", "data", "notionRedirects.json");
const fallbackFilePath = path.join(process.cwd(), "src", "data", "blogData.json");
const fallbackCover =
  "https://images.unsplash.com/photo-1474487585647-984bb91ffec9?q=80&w=2000&auto=format&fit=crop";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

type RenderContext = {
  articleTitle: string;
  imageIndex: number;
  slug: string;
  toc: TocItem[];
  usedHeadingIds: Set<string>;
  words: string[];
};

type LocalArticleAsset = {
  src: string;
  alt: string;
  caption?: string;
};

type LocalArticleAssets = {
  cover?: LocalArticleAsset;
  inline?: Array<LocalArticleAsset & { beforeHeading: string }>;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const escapeAttribute = (value: string) => escapeHtml(value).replaceAll("`", "&#096;");

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function loadLocalArticleAssets(slug: string): LocalArticleAssets | null {
  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!safeSlug || safeSlug !== slug) return null;
  const manifestPath = path.join(
    process.cwd(),
    "public",
    "images",
    "posts",
    safeSlug,
    "preview-assets.json",
  );
  if (!fs.existsSync(manifestPath)) return null;

  try {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as LocalArticleAssets;
    const allowedPrefix = `/images/posts/${safeSlug}/`;
    const validAsset = (asset?: LocalArticleAsset) =>
      !!asset && asset.src.startsWith(allowedPrefix) && !!asset.alt.trim();
    const cover = validAsset(parsed.cover) ? parsed.cover : undefined;
    const inline = (parsed.inline || []).filter(
      (asset) => validAsset(asset) && !!asset.beforeHeading?.trim(),
    );
    return cover || inline.length ? { cover, inline } : null;
  } catch {
    return null;
  }
}

function localArticleFigure(asset: LocalArticleAsset) {
  return `<figure class="article-figure"><img src="${escapeAttribute(asset.src)}" alt="${escapeAttribute(
    asset.alt,
  )}" loading="lazy" decoding="async" />${
    asset.caption ? `<figcaption>${escapeHtml(asset.caption)}</figcaption>` : ""
  }</figure>`;
}

function applyLocalArticleAssets(html: string, assets: LocalArticleAssets | null) {
  if (!assets?.inline?.length) return html;
  return assets.inline.reduce((rendered, asset) => {
    const heading = escapeHtml(asset.beforeHeading);
    const marker = new RegExp(`<h[23](?:\\s[^>]*)?>${escapeRegExp(heading)}</h[23]>`);
    return marker.test(rendered)
      ? rendered.replace(marker, `${localArticleFigure(asset)}$&`)
      : `${rendered}${localArticleFigure(asset)}`;
  }, html);
}

const plainText = (richText: any[] = []) =>
  richText.map((item) => item?.plain_text || "").join("").trim();

const propertyText = (property: any) => {
  if (!property) return "";
  if (property.type === "rich_text") return plainText(property.rich_text);
  if (property.type === "title") return plainText(property.title);
  if (property.type === "select") return property.select?.name || "";
  if (property.type === "status") return property.status?.name || "";
  if (property.type === "multi_select") {
    return (property.multi_select || []).map((item: any) => item.name).join(", ");
  }
  if (property.type === "url") return property.url || "";
  return "";
};

const propertyDate = (property: any) =>
  property?.type === "date" ? property.date?.start || "" : "";

const propertyNumber = (property: any) =>
  property?.type === "number" && typeof property.number === "number"
    ? property.number
    : null;

const propertyRelationIds = (property: any): string[] =>
  property?.type === "relation"
    ? (property.relation || []).map((item: any) => item.id).filter(Boolean)
    : [];

const propertyPeople = (property: any): string[] =>
  property?.type === "people"
    ? (property.people || [])
        .map((person: any) => person.name || person.person?.email || "")
        .filter(Boolean)
    : [];

const stableHeadingId = (text: string, context: RenderContext) => {
  const base =
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) || "section";
  let id = base;
  let suffix = 2;
  while (context.usedHeadingIds.has(id)) {
    id = `${base}-${suffix++}`;
  }
  context.usedHeadingIds.add(id);
  return id;
};

const rememberWords = (context: RenderContext, value: string) => {
  if (value.trim()) context.words.push(value.trim());
};

function formatRichText(richText: any): string {
  if (!richText?.plain_text) return "";
  let text = escapeHtml(richText.plain_text);

  if (richText.annotations?.code) text = `<code>${text}</code>`;
  if (richText.annotations?.bold) text = `<strong>${text}</strong>`;
  if (richText.annotations?.italic) text = `<em>${text}</em>`;
  if (richText.annotations?.strikethrough) text = `<del>${text}</del>`;
  if (richText.annotations?.underline) text = `<u>${text}</u>`;

  if (richText.href) {
    const href = escapeAttribute(richText.href);
    const external = /^https?:\/\//i.test(richText.href);
    text = `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`;
  }
  return text;
}

const formatRichTextArray = (richText: any[] = []) =>
  richText.map((item) => formatRichText(item)).join("");

const wait = (delayMs: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

const fetchNotion = async (endpoint: string, options: Record<string, any> = {}) => {
  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let response: Response;
    try {
      response = await fetch(`https://api.notion.com${endpoint}`, {
        method: options.method || "GET",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) throw error;
      const delayMs = 1_000 * 2 ** (attempt - 1);
      console.warn(`Notion request failed (attempt ${attempt}/${maxAttempts}); retrying in ${delayMs}ms.`);
      await wait(delayMs);
      continue;
    }

    if (response.ok) return response.json();

    const error = new Error(`Notion API error ${response.status}: ${await response.text()}`);
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === maxAttempts) throw error;
    lastError = error;
    const delayMs = 1_000 * 2 ** (attempt - 1);
    console.warn(`Notion request failed (attempt ${attempt}/${maxAttempts}); retrying in ${delayMs}ms.`);
    await wait(delayMs);
  }

  throw lastError instanceof Error ? lastError : new Error("Notion request failed.");
};

async function fetchAllDatabasePages() {
  const pages: any[] = [];
  let cursor: string | undefined;

  do {
    const response = await fetchNotion(`/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: "POST",
      body: {
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
        sorts: [{ property: "Date", direction: "descending" }],
      },
    });
    pages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return pages;
}

async function fetchAllBlockChildren(blockId: string) {
  const blocks: any[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({ page_size: "100" });
    if (cursor) params.set("start_cursor", cursor);
    const response = await fetchNotion(`/v1/blocks/${blockId}/children?${params.toString()}`);
    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

async function renderChildBlocks(block: any, context: RenderContext) {
  if (!block.has_children) return "";
  return renderBlocks(await fetchAllBlockChildren(block.id), context);
}

async function renderBlocks(blocks: any[], context: RenderContext): Promise<string> {
  let html = "";
  let listType: "ul" | "ol" | "" = "";

  const closeList = () => {
    if (listType) {
      html += `</${listType}>`;
      listType = "";
    }
  };

  for (const block of blocks) {
    const type = block.type;
    const isList = type === "bulleted_list_item" || type === "numbered_list_item";
    const nextListType = type === "bulleted_list_item" ? "ul" : type === "numbered_list_item" ? "ol" : "";

    if (!isList || (listType && listType !== nextListType)) closeList();

    if (type === "paragraph") {
      const text = plainText(block.paragraph.rich_text);
      rememberWords(context, text);
      const children = await renderChildBlocks(block, context);
      html += `<p>${formatRichTextArray(block.paragraph.rich_text)}</p>${children}`;
    } else if (type === "heading_1" || type === "heading_2" || type === "heading_3") {
      const source = block[type];
      const text = plainText(source.rich_text);
      rememberWords(context, text);
      // The page title is the article H1. Editors commonly start Notion article
      // sections with either Heading 1 or Heading 2, so both become website H2;
      // Heading 3 remains the nested H3. This matches the local final preview
      // and prevents an H1 → H3 jump on the published page.
      const tag = type === "heading_3" ? "h3" : "h2";
      const id = stableHeadingId(text, context);
      if (tag === "h2" || tag === "h3") {
        context.toc.push({ id, text, level: tag === "h2" ? 2 : 3 });
      }
      html += `<${tag} id="${escapeAttribute(id)}">${formatRichTextArray(source.rich_text)}</${tag}>`;
    } else if (isList) {
      if (!listType) {
        listType = nextListType as "ul" | "ol";
        html += `<${listType}>`;
      }
      const source = block[type];
      const text = plainText(source.rich_text);
      rememberWords(context, text);
      html += `<li>${formatRichTextArray(source.rich_text)}${await renderChildBlocks(block, context)}</li>`;
    } else if (type === "image") {
      const image = block.image;
      const imageUrl = image.type === "external" ? image.external?.url : image.file?.url;
      if (imageUrl) {
        const caption = plainText(image.caption);
        const alt = caption || `${context.articleTitle} — supporting image ${context.imageIndex}`;
        const localUrl = await downloadNotionImage(imageUrl, context.slug, context.imageIndex++);
        html += `<figure class="article-figure"><img src="${escapeAttribute(localUrl)}" alt="${escapeAttribute(alt)}" loading="lazy" referrerpolicy="no-referrer" />${
          caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""
        }</figure>`;
      }
    } else if (type === "table") {
      const rows = await fetchAllBlockChildren(block.id);
      html += '<div class="article-table-wrap"><table><tbody>';
      rows.forEach((row: any, rowIndex: number) => {
        if (row.type !== "table_row") return;
        html += "<tr>";
        row.table_row.cells.forEach((cell: any[]) => {
          const tag = rowIndex === 0 && block.table.has_column_header ? "th" : "td";
          const text = plainText(cell);
          rememberWords(context, text);
          html += `<${tag}>${formatRichTextArray(cell)}</${tag}>`;
        });
        html += "</tr>";
      });
      html += "</tbody></table></div>";
    } else if (type === "code") {
      const text = plainText(block.code.rich_text);
      rememberWords(context, text);
      html += `<pre><code>${escapeHtml(text)}</code></pre>`;
    } else if (type === "quote") {
      const text = plainText(block.quote.rich_text);
      rememberWords(context, text);
      html += `<blockquote>${formatRichTextArray(block.quote.rich_text)}${await renderChildBlocks(block, context)}</blockquote>`;
    } else if (type === "callout") {
      const text = plainText(block.callout.rich_text);
      rememberWords(context, text);
      const emoji = block.callout.icon?.type === "emoji" ? block.callout.icon.emoji : "i";
      html += `<aside class="article-callout"><span aria-hidden="true">${escapeHtml(emoji)}</span><div>${formatRichTextArray(
        block.callout.rich_text,
      )}${await renderChildBlocks(block, context)}</div></aside>`;
    } else if (type === "divider") {
      html += "<hr />";
    } else if (type === "toggle") {
      const text = plainText(block.toggle.rich_text);
      rememberWords(context, text);
      html += `<details><summary>${formatRichTextArray(block.toggle.rich_text)}</summary>${await renderChildBlocks(
        block,
        context,
      )}</details>`;
    } else if (type === "bookmark") {
      const url = block.bookmark.url || "";
      const caption = plainText(block.bookmark.caption) || url;
      rememberWords(context, caption);
      html += `<p><a href="${escapeAttribute(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
        caption,
      )}</a></p>`;
    } else if (type === "column_list" || type === "column" || type === "synced_block") {
      html += await renderChildBlocks(block, context);
    }
  }

  closeList();
  return html;
}

async function getPageContentHtml(
  pageId: string,
  slug: string,
  articleTitle: string,
  propertyContent = "",
) {
  const context: RenderContext = {
    articleTitle,
    imageIndex: 1,
    slug,
    toc: [],
    usedHeadingIds: new Set<string>(),
    words: [],
  };

  if (propertyContent) rememberWords(context, propertyContent);
  let html = propertyContent ? `<p>${escapeHtml(propertyContent)}</p>` : "";
  html += await renderBlocks(await fetchAllBlockChildren(pageId), context);

  const combinedText = context.words.join(" ").trim();
  const cjkCharacters = combinedText.match(/[\u3400-\u9fff]/g)?.length || 0;
  const nonCjkText = combinedText.replace(/[\u3400-\u9fff]/g, " ");
  const nonCjkWords =
    nonCjkText.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length || 0;
  const wordCount = nonCjkWords + Math.ceil(cjkCharacters / 2);
  const readMinutes = Math.max(1, Math.ceil(wordCount / 220));

  return { html, toc: context.toc, wordCount, readMinutes };
}

function writeFallbackData() {
  if (STRICT_SYNC) {
    throw new Error("Strict Notion sync failed; refusing to deploy stale fallback content.");
  }

  if (fs.existsSync(outputFilePath)) {
    try {
      const existingPosts = JSON.parse(fs.readFileSync(outputFilePath, "utf-8"));
      if (Array.isArray(existingPosts) && existingPosts.length > 0) {
        console.warn(
          `Notion is unavailable; keeping the last successful snapshot of ${existingPosts.length} article(s).`,
        );
        return;
      }
    } catch (error) {
      console.warn("The existing Notion snapshot is invalid and cannot be reused:", error);
    }
  }

  console.warn("No valid Notion snapshot exists; initializing with local starter blog data.");
  if (!fs.existsSync(fallbackFilePath)) {
    fs.writeFileSync(outputFilePath, "[]", "utf-8");
    if (!fs.existsSync(redirectFilePath)) fs.writeFileSync(redirectFilePath, "[]", "utf-8");
    return;
  }

  const fallbackPosts = JSON.parse(fs.readFileSync(fallbackFilePath, "utf-8")).map((post: any) => ({
    ...post,
    slug: post.slug || generateSlug(post.title, post.id),
    readMinutes: post.readMinutes || 5,
    wordCount: post.wordCount || 0,
    toc: post.toc || [],
  }));
  fs.writeFileSync(outputFilePath, JSON.stringify(fallbackPosts, null, 2), "utf-8");
  if (!fs.existsSync(redirectFilePath)) fs.writeFileSync(redirectFilePath, "[]", "utf-8");
}

function auditGovernedArticle(post: any) {
  if (!post.governed) return [];

  const blockers: string[] = [];
  const delegatedAutomatedApproval =
    post.status === "Published" &&
    !post.reviewer?.length &&
    post.evidenceCount >= 2 &&
    post.topicCount >= 1 &&
    post.auditCount >= 1 &&
    Boolean(post.lastVerified) &&
    (post.qualityScore ?? 0) >= 85;
  if (!post.topicKey) blockers.push("Topic Key is missing");
  if (!post.summary) blockers.push("Excerpt/Summary is missing");
  if (!post.lastVerified) blockers.push("Last Verified is missing");
  if (!post.reviewer?.length && !delegatedAutomatedApproval) {
    blockers.push("Reviewer or delegated automated approval is missing");
  }
  if (!post.primaryCTA) blockers.push("Primary CTA is missing");
  if ((post.qualityScore ?? 0) < 85) blockers.push("Quality Score is below 85");
  if (post.thumbnailUrl === fallbackCover) blockers.push("A rights-cleared cover image is missing");
  if (!/<a\s+href="https?:\/\//i.test(post.content)) blockers.push("No external source link appears in the article");

  const minimumEvidence = post.contentType === "Case Study" ? 1 : 2;
  if (post.evidenceCount < minimumEvidence) {
    blockers.push(`${minimumEvidence} linked Evidence Ledger record(s) required for ${post.contentType || "this article"}`);
  }
  if (post.topicCount < 1) blockers.push("A linked Topic Registry decision is required");
  if (post.auditCount < 1) blockers.push("Article-linked audit history is required");

  return blockers;
}

async function run() {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.warn("NOTION_API_KEY or NOTION_DATABASE_ID is missing.");
    writeFallbackData();
    return;
  }

  console.log(`Starting auditable build-time fetch from Notion database ${NOTION_DATABASE_ID}.`);

  try {
    const pages = await fetchAllDatabasePages();
    const pageMetadata = new Map<string, { slug: string; language: string; status: string; canonicalIds: string[] }>();

    for (const page of pages) {
      const properties = page.properties || {};
      const titleProperty = Object.values(properties).find((property: any) => property.type === "title") as any;
      const title = propertyText(titleProperty) || "Untitled";
      const slug = propertyText(properties.Slug || properties.slug) || generateSlug(title, page.id);
      const language = propertyText(properties.Language || properties.language) || "en";
      pageMetadata.set(page.id, {
        slug,
        language,
        status: propertyText(properties.Status),
        canonicalIds: propertyRelationIds(properties["Canonical Article"]),
      });
    }

    const posts: any[] = [];
    for (const page of pages) {
      const properties = page.properties || {};
      if (propertyText(properties.Status) !== "Published") continue;

      const titleProperty = Object.values(properties).find((property: any) => property.type === "title") as any;
      const title = propertyText(titleProperty) || "Untitled";
      const slug = propertyText(properties.Slug || properties.slug) || generateSlug(title, page.id);
      const category = propertyText(properties.Category || properties.category) || "Logistics";
      const language = propertyText(properties.Language || properties.language) || "en";
      const translationGroup = propertyText(properties["Translation Group"] || properties.translationGroup);
      const date = propertyDate(properties.Date || properties.date) || page.created_time.split("T")[0];
      const summary = propertyText(
        properties.Excerpt ||
          properties.excerpt ||
          properties.Summary ||
          properties.summary ||
          properties.Description ||
          properties.description,
      );

      const localAssets = loadLocalArticleAssets(slug);

      let thumbnailUrl = fallbackCover;
      if (page.cover) {
        thumbnailUrl =
          page.cover.type === "external" ? page.cover.external.url : page.cover.file?.url || thumbnailUrl;
      }
      const imageProperty =
        properties.ThumbnailUrl || properties.thumbnailUrl || properties.Image || properties.image;
      if (imageProperty?.type === "url" && imageProperty.url) thumbnailUrl = imageProperty.url;
      if (imageProperty?.type === "files" && imageProperty.files?.length) {
        const file = imageProperty.files[0];
        thumbnailUrl = file.type === "external" ? file.external.url : file.file?.url || thumbnailUrl;
      }
      if (localAssets?.cover) {
        thumbnailUrl = localAssets.cover.src;
      } else if (thumbnailUrl !== fallbackCover) {
        thumbnailUrl = await downloadNotionImage(thumbnailUrl, slug, "cover");
      }

      const initialContent = propertyText(properties.Content || properties.content);
      console.log(`Compiling Notion article "${title}" (${page.id}).`);
      const rendered = await getPageContentHtml(page.id, slug, title, initialContent);
      rendered.html = applyLocalArticleAssets(rendered.html, localAssets);
      const canonicalIds = propertyRelationIds(properties["Canonical Article"]);

      const post: Record<string, any> = {
        id: page.id,
        status: propertyText(properties.Status),
        slug,
        title,
        category,
        language,
        translationGroup,
        date,
        lastEdited: page.last_edited_time,
        summary,
        thumbnailUrl,
        content: rendered.html,
        toc: rendered.toc,
        wordCount: rendered.wordCount,
        readMinutes: rendered.readMinutes,
        leadGoal: propertyText(properties["Lead Goal"]),
        productCategory: propertyText(properties["Product Category"]),
        productSubcategory: propertyText(properties["Product Subcategory"]),
        audienceMarket: propertyText(properties["Audience Market"]),
        searchIntent: propertyText(properties["Search Intent"]),
        primaryQuery: propertyText(properties["Primary Query"]),
        topicKey: propertyText(properties["Topic Key"]),
        contentType: propertyText(properties["Content Type"]),
        reviewer: propertyPeople(properties.Reviewer),
        lastVerified: propertyDate(properties["Last Verified"]),
        qualityScore: propertyNumber(properties["Quality Score"]),
        primaryCTA: propertyText(properties["Primary CTA"]),
        evidenceCount: propertyRelationIds(properties.Evidence).length,
        topicCount: propertyRelationIds(properties["Topic Record"]).length,
        auditCount: propertyRelationIds(properties["Audit History"]).length,
        canonicalArticleId: canonicalIds[0] || "",
      };
      post.reviewMode = post.reviewer.length ? "human" : "delegated-automation";
      // Low-risk migration metadata does not make a legacy article "governed".
      // The strict publication gate begins only when verification/audit fields
      // are being asserted for that article.
      post.governed = Boolean(
        post.reviewer.length ||
          post.lastVerified ||
          post.qualityScore !== null ||
          post.evidenceCount ||
          post.topicCount ||
          post.auditCount,
      );
      post.legacyMigration = !post.governed && Boolean(post.topicKey || post.primaryCTA);

      const blockers = auditGovernedArticle(post);
      if (blockers.length) {
        throw new Error(`Publication blocked for "${title}":\n- ${blockers.join("\n- ")}`);
      }
      posts.push(post);
    }

    const redirects = Array.from(pageMetadata.entries()).flatMap(([pageId, metadata]) => {
      if (metadata.status !== "Archived" || !metadata.canonicalIds.length) return [];
      const canonical = pageMetadata.get(metadata.canonicalIds[0]);
      if (!canonical || canonical.status !== "Published") return [];
      const sourcePrefix = metadata.language === "en" ? "" : `/${metadata.language}`;
      const targetPrefix = canonical.language === "en" ? "" : `/${canonical.language}`;
      return [
        {
          pageId,
          from: `${sourcePrefix}/blog/${metadata.slug}`,
          to: `${targetPrefix}/blog/${canonical.slug}`,
        },
      ];
    });

    if (!posts.length) {
      if (STRICT_SYNC) throw new Error("No Published Notion articles were returned.");
      writeFallbackData();
      return;
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(posts, null, 2), "utf-8");
    fs.writeFileSync(redirectFilePath, JSON.stringify(redirects, null, 2), "utf-8");
    console.log(`Compiled ${posts.length} published article(s) and ${redirects.length} redirect(s).`);
  } catch (error) {
    console.error("Notion build-time sync failed:", error);
    writeFallbackData();
  }
}

run();
