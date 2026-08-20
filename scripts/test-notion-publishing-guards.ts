import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import notionBlogPosts from "../src/data/notionBlogData.json" with { type: "json" };
import { downloadNotionImage, isNotionTemporalUrl } from "./notion-img-sync";
import { auditPublishedArticle } from "./notion-publication-guard";

const fallbackCover = "https://images.example.test/fallback.jpg";
const failures: string[] = [];

async function check(name: string, run: () => void | Promise<void>) {
  try {
    await run();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`FAIL ${name}`);
  }
}

function blockersFor(post: Record<string, unknown>, strictSync = true) {
  return auditPublishedArticle(post, { fallbackCover, strictSync });
}

await check("strict sync rejects an ungoverned Published article", () => {
  const blockers = blockersFor({
    status: "Published",
    governed: false,
    reviewer: [],
    content: '<p><a href="https://example.test/source">Source</a></p>',
  });
  assert.ok(blockers.some((blocker) => blocker.includes("governance")));
});

await check("non-strict local sync preserves legacy article compatibility", () => {
  const blockers = blockersFor(
    {
      status: "Published",
      governed: false,
      reviewer: [],
      content: '<p><a href="https://example.test/source">Source</a></p>',
    },
    false,
  );
  assert.deepEqual(blockers, []);
});

await check("all current Published articles satisfy the strict publication guard", () => {
  assert.ok(notionBlogPosts.length >= 21, "the current 21-article baseline must not shrink unexpectedly");
  for (const post of notionBlogPosts) {
    assert.deepEqual(
      blockersFor(post),
      [],
      `${post.language || "en"}:${post.slug || post.id} should remain publishable`,
    );
  }
});

const imageDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "ddnz-notion-image-guard-"));
try {
  const firstUrl = "https://secure.notion-static.com/source-a/photo.png?signature=one";
  const changedUrl = "https://secure.notion-static.com/source-b/photo.png?signature=two";
  const stockCoverUrl = "https://app.notion.com/images/page-cover/met_silk_kashan_carpet.jpg";
  const localFile = path.join(imageDir, "guard-test-cover.png");

  await check("Notion stock page covers are classified for local production storage", () => {
    assert.equal(isNotionTemporalUrl(stockCoverUrl), true);
    assert.equal(isNotionTemporalUrl("https://app.notion.com/unrelated/image.jpg"), false);
    assert.equal(isNotionTemporalUrl("https://example.test/images/page-cover/image.jpg"), false);
  });

  await check("a Notion stock page cover is localized like a signed upload", async () => {
    const localized = await downloadNotionImage(stockCoverUrl, "stock-cover-test", "cover", {
      imageDir,
      strict: true,
      fetchImpl: async () => new Response("stock-cover-image", { status: 200 }),
    });
    assert.equal(localized, "/images/posts/stock-cover-test-cover.jpg");
    assert.equal(
      await fs.promises.readFile(path.join(imageDir, "stock-cover-test-cover.jpg"), "utf8"),
      "stock-cover-image",
    );
  });

  await check("a changed source refreshes an existing same-name local image", async () => {
    await fs.promises.writeFile(localFile, "stale-image");
    const localized = await downloadNotionImage(changedUrl, "guard-test", "cover", {
      imageDir,
      strict: true,
      fetchImpl: async () => new Response("fresh-image", { status: 200 }),
    });
    assert.equal(localized, "/images/posts/guard-test-cover.png");
    assert.equal(await fs.promises.readFile(localFile, "utf8"), "fresh-image");
  });

  await check("strict image localization retries a transient network failure", async () => {
    let attempts = 0;
    const localized = await downloadNotionImage(changedUrl, "guard-test", "cover", {
      imageDir,
      strict: true,
      maxAttempts: 2,
      retryDelayMs: 0,
      fetchImpl: async () => {
        attempts += 1;
        if (attempts === 1) throw new TypeError("temporary socket closure");
        return new Response("retried-image", { status: 200 });
      },
    });
    assert.equal(localized, "/images/posts/guard-test-cover.png");
    assert.equal(attempts, 2);
    assert.equal(await fs.promises.readFile(localFile, "utf8"), "retried-image");
  });

  await check("strict image localization rejects a failed download", async () => {
    const lastValidImage = await fs.promises.readFile(localFile, "utf8");
    await assert.rejects(
      downloadNotionImage(firstUrl, "guard-test", "cover", {
        imageDir,
        strict: true,
        maxAttempts: 1,
        fetchImpl: async () => new Response("unavailable", { status: 503, statusText: "Unavailable" }),
      }),
      /localiz|download|fetch/i,
    );
    assert.equal(await fs.promises.readFile(localFile, "utf8"), lastValidImage);
  });

  await check("non-strict failure never silently returns a stale local image", async () => {
    const result = await downloadNotionImage(firstUrl, "guard-test", "cover", {
      imageDir,
      strict: false,
      maxAttempts: 1,
      fetchImpl: async () => new Response("unavailable", { status: 503, statusText: "Unavailable" }),
    });
    assert.equal(result, firstUrl);
  });
} finally {
  await fs.promises.rm(imageDir, { recursive: true, force: true });
}

if (failures.length) {
  throw new Error(`Notion publishing guard tests failed:\n- ${failures.join("\n- ")}`);
}

console.log(`Validated ${notionBlogPosts.length} current articles and both strict failure contracts.`);
