import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.NOTION_API_KEY;
const notionVersion = "2022-06-28";

if (!apiKey) {
  throw new Error("NOTION_API_KEY is missing from .env.local");
}

const args = process.argv.slice(2);
const valueFor = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : "";
};

const pageId = valueFor("--page");
const coverUrl = valueFor("--cover");
const imageMappings = args
  .flatMap((value, index) => (value === "--image" ? [args[index + 1]] : []))
  .map((mapping) => {
    const separator = mapping.indexOf("=");
    if (separator < 1) throw new Error(`Invalid --image mapping: ${mapping}`);
    return {
      filename: mapping.slice(0, separator),
      url: mapping.slice(separator + 1),
    };
  });

if (!pageId || !coverUrl || imageMappings.length === 0) {
  throw new Error(
    "Usage: node scripts/repair-notion-image-urls.mjs --page PAGE_ID --cover URL --image filename=URL",
  );
}

const notionRequest = async (endpoint, options = {}) => {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`https://api.notion.com${endpoint}`, {
        ...options,
        signal: AbortSignal.timeout(20_000),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Notion-Version": notionVersion,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (response.ok) return response.json();
      const body = await response.text();
      if (response.status < 500 && response.status !== 429) {
        throw new Error(`Notion API ${response.status}: ${body}`);
      }
      lastError = new Error(`Notion API ${response.status}: ${body}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 1_000 * attempt));
  }
  throw lastError;
};

const fetchChildren = async (blockId) => {
  const children = [];
  let cursor = "";
  do {
    const query = new URLSearchParams({ page_size: "100" });
    if (cursor) query.set("start_cursor", cursor);
    const response = await notionRequest(`/v1/blocks/${blockId}/children?${query}`);
    children.push(...response.results);
    cursor = response.has_more ? response.next_cursor : "";
  } while (cursor);
  return children;
};

const allBlocks = [];
const walkBlocks = async (blockId) => {
  const children = await fetchChildren(blockId);
  for (const child of children) {
    allBlocks.push(child);
    if (child.has_children) await walkBlocks(child.id);
  }
};

await walkBlocks(pageId);

const repaired = [];
for (const mapping of imageMappings) {
  const block = allBlocks.find((candidate) => {
    if (candidate.type !== "image") return false;
    const image = candidate.image;
    const sourceUrl = image.type === "external" ? image.external?.url : image.file?.url;
    return sourceUrl?.split("?")[0].endsWith(`/${mapping.filename}`);
  });

  if (!block) throw new Error(`Image block not found: ${mapping.filename}`);

  await notionRequest(`/v1/blocks/${block.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      image: {
        external: { url: mapping.url },
        caption: block.image.caption || [],
      },
    }),
  });
  repaired.push({ blockId: block.id, filename: mapping.filename, url: mapping.url });
  console.log(`Repaired image block ${mapping.filename}`);
}

await notionRequest(`/v1/pages/${pageId}`, {
  method: "PATCH",
  body: JSON.stringify({
    cover: { type: "external", external: { url: coverUrl } },
  }),
});
console.log("Repaired page cover");

console.log(JSON.stringify({ pageId, coverUrl, repaired }, null, 2));
