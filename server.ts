import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";

// Initialize express app
const app = express();
const PORT = 3000;

app.use(express.json());

// Notion Integration Credentials
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Direct Fetch Helper for Notion API to bypass SDK version issues
const fetchNotion = async (endpoint: string, options: any = {}) => {
  const url = `https://api.notion.com${endpoint}`;
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Authorization": `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Notion API error ${response.status}: ${errText}`);
  }
  return response.json();
};

// Load local fallback data
const getLocalFallbackData = () => {
  try {
    const fallbackPath = path.join(process.cwd(), "src", "data", "blogData.json");
    if (fs.existsSync(fallbackPath)) {
      return JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
    }
  } catch (error) {
    console.error("Failed to read local blogData.json:", error);
  }
  return [];
};

// Rich text formatter for Notion blocks
function formatRichText(richText: any): string {
  if (!richText || !richText.plain_text) return "";
  let text = richText.plain_text;
  
  if (richText.annotations?.bold) text = `<strong>${text}</strong>`;
  if (richText.annotations?.italic) text = `<em>${text}</em>`;
  if (richText.annotations?.strikethrough) text = `<del>${text}</del>`;
  if (richText.annotations?.underline) text = `<u>${text}</u>`;
  if (richText.annotations?.code) text = `<code>${text}</code>`;
  
  if (richText.href) {
    text = `<a href="${richText.href}" target="_blank" rel="noopener noreferrer" class="text-[#FF8A00] underline font-medium hover:text-[#4B27B1] transition-colors">${text}</a>`;
  }
  return text;
}

// Convert Notion blocks to HTML
async function getPageContentHtml(pageId: string, propertyContent?: string): Promise<string> {
  let html = propertyContent || "";

  try {
    const blocksResponse = await fetchNotion(`/v1/blocks/${pageId}/children`);
    const blocks = blocksResponse.results;
    
    let listOpen = false;
    let listType = ""; // "ul" or "ol"

    for (const block of blocks as any[]) {
      const type = block.type;
      
      // Close list if current block is not list_item of the same type
      if (listOpen && type !== "bulleted_list_item" && type !== "numbered_list_item") {
        html += `</${listType}>`;
        listOpen = false;
      }

      if (type === "paragraph") {
        const text = block.paragraph.rich_text.map((r: any) => formatRichText(r)).join("");
        html += `<p>${text}</p>`;
      } else if (type === "heading_1") {
        const text = block.heading_1.rich_text.map((r: any) => r.plain_text).join("");
        html += `<h2>${text}</h2>`;
      } else if (type === "heading_2") {
        const text = block.heading_2.rich_text.map((r: any) => r.plain_text).join("");
        html += `<h3>${text}</h3>`;
      } else if (type === "heading_3") {
        const text = block.heading_3.rich_text.map((r: any) => r.plain_text).join("");
        html += `<h4>${text}</h4>`;
      } else if (type === "bulleted_list_item") {
        if (!listOpen || listType !== "ul") {
          if (listOpen) { html += `</${listType}>`; }
          html += "<ul>";
          listOpen = true;
          listType = "ul";
        }
        const text = block.bulleted_list_item.rich_text.map((r: any) => formatRichText(r)).join("");
        html += `<li>${text}</li>`;
      } else if (type === "numbered_list_item") {
        if (!listOpen || listType !== "ol") {
          if (listOpen) { html += `</${listType}>`; }
          html += "<ol>";
          listOpen = true;
          listType = "ol";
        }
        const text = block.numbered_list_item.rich_text.map((r: any) => formatRichText(r)).join("");
        html += `<li>${text}</li>`;
      } else if (type === "image") {
        const imageUrl = block.image.type === "external" ? block.image.external.url : block.image.file?.url;
        if (imageUrl) {
          html += `<div class="my-6 rounded-2xl overflow-hidden shadow-md"><img src="${imageUrl}" alt="Notion Image" class="w-full object-cover max-h-[500px]" referrerPolicy="no-referrer" /></div>`;
        }
      } else if (type === "table") {
        try {
          const rowsResponse = await fetchNotion(`/v1/blocks/${block.id}/children`);
          html += `<table class="min-w-full border-collapse border border-slate-200 mt-4 mb-8 text-sm">`;
          let isHeader = true;
          for (const row of rowsResponse.results as any[]) {
            if (row.type === "table_row") {
              html += `<tr>`;
              for (const cell of row.table_row.cells) {
                const cellText = cell.map((r: any) => formatRichText(r)).join("");
                if (isHeader && block.table.has_column_header) {
                  html += `<th class="border border-slate-200 bg-slate-50 p-3 text-left font-bold">${cellText}</th>`;
                } else {
                  html += `<td class="border border-slate-200 p-3">${cellText}</td>`;
                }
              }
              html += `</tr>`;
              isHeader = false;
            }
          }
          html += `</table>`;
        } catch (tableErr) {
          console.error("Error loading Notion table block:", tableErr);
        }
      } else if (type === "code") {
        const text = block.code.rich_text.map((r: any) => r.plain_text).join("");
        html += `<pre><code>${text}</code></pre>`;
      } else if (type === "quote") {
        const text = block.quote.rich_text.map((r: any) => formatRichText(r)).join("");
        html += `<div class="bg-purple-50 p-6 rounded-xl border-l-4 border-[#4B27B1] italic my-6"><p class="text-slate-700">"${text}"</p></div>`;
      } else if (type === "callout") {
        const text = block.callout.rich_text.map((r: any) => formatRichText(r)).join("");
        html += `<div class="bg-purple-50 p-6 rounded-xl border border-purple-100 my-6"><h4 class="text-[#4B27B1] font-bold mb-2">Notice</h4><p class="text-slate-700">${text}</p></div>`;
      }
    }
    
    if (listOpen) {
      html += `</${listType}>`;
    }
  } catch (err) {
    console.error("Error retrieving blocks for block_id: " + pageId, err);
  }

  return html;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Fetch live Notion Blog posts (Basic properties metadata)
app.get("/api/blog-posts", async (req, res) => {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.log("Notion credentials missing. Falling back to local JSON data.");
    return res.json(getLocalFallbackData());
  }

  try {
    console.log(`Starting fetching Notion Database ID: ${NOTION_DATABASE_ID}`);
    // Querying Notion database. We will query first by status. If it fails, we fetch everything and filter manually.
    let response;
    try {
      response = await fetchNotion(`/v1/databases/${NOTION_DATABASE_ID}/query`, {
        method: "POST",
        body: {
          filter: {
            property: "Status",
            status: {
              equals: "Published"
            }
          },
          sorts: [
            {
              property: "Date",
              direction: "descending"
            }
          ]
        }
      });
    } catch (queryErr) {
      console.warn("Standard filter query failed. Falling back to query without limit/status filter.", queryErr);
      response = await fetchNotion(`/v1/databases/${NOTION_DATABASE_ID}/query`, {
        method: "POST"
      });
    }

    const posts = [];
    for (const page of response.results as any[]) {
      const properties = page.properties;
      
      // Determine Status safely
      let statusValue = "";
      if (properties.Status) {
        if (properties.Status.type === "status") {
          statusValue = properties.Status.status?.name || "";
        } else if (properties.Status.type === "select") {
          statusValue = properties.Status.select?.name || "";
        } else if (properties.Status.type === "rich_text") {
          statusValue = properties.Status.rich_text.map((t: any) => t.plain_text).join("");
        }
      }

      // If we did a full database query, filter out non-Published records manually
      if (statusValue !== "Published") {
        continue;
      }

      // Parse Title
      let title = "Untitled";
      const titleProperty = Object.values(properties).find((p: any) => p.type === "title") as any;
      if (titleProperty && titleProperty.title) {
        title = titleProperty.title.map((t: any) => t.plain_text).join("") || "Untitled";
      }

      // Parse Category
      let category = "Logistics";
      const catProp = properties.Category || properties.category;
      if (catProp) {
        if (catProp.type === "select" && catProp.select) {
          category = catProp.select.name;
        } else if (catProp.type === "multi_select" && catProp.multi_select && catProp.multi_select.length > 0) {
          category = catProp.multi_select.map((m: any) => m.name).join(", ");
        } else if (catProp.type === "rich_text") {
          category = catProp.rich_text.map((t: any) => t.plain_text).join("") || "Logistics";
        }
      }

      // Parse Date
      let date = new Date(page.created_time).toISOString().split("T")[0];
      const dateProp = properties.Date || properties.date;
      if (dateProp && dateProp.type === "date" && dateProp.date) {
        date = dateProp.date.start;
      }

      // Parse Summary
      let summary = "";
      const sumProp = properties.Summary || properties.summary || properties.description || properties.Description;
      if (sumProp && sumProp.type === "rich_text") {
        summary = sumProp.rich_text.map((t: any) => t.plain_text).join("");
      }

      // Parse Thumbnail/Cover Image Url
      let thumbnailUrl = "https://images.unsplash.com/photo-1474487585647-984bb91ffec9?q=80&w=2000&auto=format&fit=crop";
      
      // Check for Page Cover
      if (page.cover) {
        thumbnailUrl = page.cover.type === "external" ? page.cover.external.url : page.cover.file?.url;
      }
      // Check for Custom image property
      const imgProp = properties.ThumbnailUrl || properties.thumbnailUrl || properties.Image || properties.image;
      if (imgProp) {
        if (imgProp.type === "url" && imgProp.url) {
          thumbnailUrl = imgProp.url;
        } else if (imgProp.type === "files" && imgProp.files && imgProp.files.length > 0) {
          const firstFile = imgProp.files[0];
          thumbnailUrl = firstFile.type === "external" ? firstFile.external.url : firstFile.file?.url;
        }
      }

      posts.push({
        id: page.id, // We'll map the actual notion uuid page id
        title,
        category,
        date,
        summary,
        thumbnailUrl,
      });
    }

    console.log(`Successfully fetched and parsed ${posts.length} posts from Notion database.`);
    
    // In case no published post was found, provide at least the local JSON fallback
    if (posts.length === 0) {
      console.log("No published post found in Notion database. Returning fallback data.");
      return res.json(getLocalFallbackData());
    }

    res.json(posts);
  } catch (error) {
    console.error("Error querying Notion database:", error);
    // On unexpected error, return fallback JSON values to keep system bulletproof
    res.json(getLocalFallbackData());
  }
});

// 2. Fetch live Notion Blog article detail by ID (With sub-content blocks HTML conversion)
app.get("/api/blog-posts/:id", async (req, res) => {
  const postId = req.params.id;

  // Let's check first if id is a uuid (used by Notion) or a numeric identifier (used by fallback blogData)
  const isNotionId = postId.length > 20; // UUID has 36 chars

  if (!isNotionId || !NOTION_API_KEY) {
    // Return from fallback JSON matching ID
    const fallbackData = getLocalFallbackData();
    const matched = fallbackData.find((p: any) => p.id === postId);
    if (matched) {
      return res.json(matched);
    }
    return res.status(404).json({ error: "Blog post not found" });
  }

  try {
    console.log(`Retrieving full Notion page data for block_id: ${postId}`);
    // Fetch Notion Page Info using direct fetch
    const page: any = await fetchNotion(`/v1/pages/${postId}`);
    const properties = page.properties;

    // Parse Title
    let title = "Untitled";
    const titleProperty = Object.values(properties).find((p: any) => p.type === "title") as any;
    if (titleProperty && titleProperty.title) {
      title = titleProperty.title.map((t: any) => t.plain_text).join("") || "Untitled";
    }

    // Parse Category
    let category = "Logistics";
    const catProp = properties.Category || properties.category;
    if (catProp) {
      if (catProp.type === "select" && catProp.select) {
        category = catProp.select.name;
      } else if (catProp.type === "multi_select" && catProp.multi_select && catProp.multi_select.length > 0) {
        category = catProp.multi_select.map((m: any) => m.name).join(", ");
      } else if (catProp.type === "rich_text") {
        category = catProp.rich_text.map((t: any) => t.plain_text).join("") || "Logistics";
      }
    }

    // Parse Date
    let date = new Date(page.created_time).toISOString().split("T")[0];
    const dateProp = properties.Date || properties.date;
    if (dateProp && dateProp.type === "date" && dateProp.date) {
      date = dateProp.date.start;
    }

    // Parse Summary
    let summary = "";
    const sumProp = properties.Summary || properties.summary || properties.description || properties.Description;
    if (sumProp && sumProp.type === "rich_text") {
      summary = sumProp.rich_text.map((t: any) => t.plain_text).join("");
    }

    // Parse Cover Image Url
    let thumbnailUrl = "https://images.unsplash.com/photo-1474487585647-984bb91ffec9?q=80&w=2000&auto=format&fit=crop";
    if (page.cover) {
      thumbnailUrl = page.cover.type === "external" ? page.cover.external.url : page.cover.file?.url;
    }
    const imgProp = properties.ThumbnailUrl || properties.thumbnailUrl || properties.Image || properties.image;
    if (imgProp) {
      if (imgProp.type === "url" && imgProp.url) {
        thumbnailUrl = imgProp.url;
      } else if (imgProp.type === "files" && imgProp.files && imgProp.files.length > 0) {
        const firstFile = imgProp.files[0];
        thumbnailUrl = firstFile.type === "external" ? firstFile.external.url : firstFile.file?.url;
      }
    }

    // If there is a properties content block (Rich text)
    let initialContent = "";
    const contentProp = properties.Content || properties.content;
    if (contentProp && contentProp.type === "rich_text") {
      initialContent = contentProp.rich_text.map((t: any) => formatRichText(t)).join("");
    }

    // Fetch block components and build the HTML content
    const contentHtml = await getPageContentHtml(postId, initialContent);

    res.json({
      id: page.id,
      title,
      category,
      date,
      summary,
      thumbnailUrl,
      content: contentHtml
    });
  } catch (error) {
    console.error(`Error retrieving full Notion page block contents for detail ${postId}:`, error);
    // If Notion fetch fails, fallback to matched local JSON
    const fallbackData = getLocalFallbackData();
    const matched = fallbackData.find((p: any) => p.id === postId);
    if (matched) {
      return res.json(matched);
    }
    res.status(500).json({ error: "Failed to fetch notion page detail." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
