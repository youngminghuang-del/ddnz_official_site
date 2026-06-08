import "dotenv/config";
import fs from "fs";
import path from "path";
import { generateSlug, downloadNotionImage } from "./notion-img-sync";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const outputFilePath = path.join(process.cwd(), "src", "data", "notionBlogData.json");
const fallbackFilePath = path.join(process.cwd(), "src", "data", "blogData.json");

// Helper to write fallback data
const writeFallbackData = () => {
  console.log("Writing fallback blog data to notionBlogData.json...");
  try {
    if (fs.existsSync(fallbackFilePath)) {
      const fallbackData = fs.readFileSync(fallbackFilePath, "utf-8");
      fs.writeFileSync(outputFilePath, fallbackData, "utf-8");
      console.log("Successfully wrote offline fallback blog posts to destination.");
    } else {
      fs.writeFileSync(outputFilePath, "[]", "utf-8");
      console.warn("Fallback blogData.json not found! Wrote empty array.");
    }
  } catch (err) {
    console.error("Failed to write offline fallback blog data:", err);
  }
};

// Directly fetch Notion REST API
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

async function getPageContentHtml(pageId: string, slug: string, propertyContent?: string): Promise<string> {
  let html = propertyContent || "";

  try {
    const blocksResponse = await fetchNotion(`/v1/blocks/${pageId}/children`);
    const blocks = blocksResponse.results;
    
    let listOpen = false;
    let listType = ""; // "ul" or "ol"
    let imageIndex = 1;

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
          const localUrl = await downloadNotionImage(imageUrl, slug, imageIndex++);
          html += `<div class="my-6 rounded-2xl overflow-hidden shadow-md"><img src="${localUrl}" alt="Notion Image" class="w-full object-cover max-h-[500px]" referrerPolicy="no-referrer" /></div>`;
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

    // Clean up any remaining secure.notion-static.com or amazonaws.com links from HTML
    try {
      let cleanHtml = html;
      const imgRegex = /src=["'](https?:\/\/[^"']*(?:secure\.notion-static\.com|amazonaws\.com)[^"']*)["']/g;
      let match;
      let inlineIndex = 100;
      const urlsToDownload: string[] = [];
      while ((match = imgRegex.exec(html)) !== null) {
        if (!urlsToDownload.includes(match[1])) {
          urlsToDownload.push(match[1]);
        }
      }
      for (const url of urlsToDownload) {
        const localUrl = await downloadNotionImage(url, slug, `inline-${inlineIndex++}`);
        cleanHtml = cleanHtml.replaceAll(url, localUrl);
      }
      html = cleanHtml;
    } catch (regexErr) {
      console.error("Regex replacement error for inline images in page " + pageId, regexErr);
    }
  } catch (err) {
    console.error("Error retrieving blocks for block_id: " + pageId, err);
  }

  return html;
}

async function run() {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.log("NOTION_API_KEY or NOTION_DATABASE_ID is missing from the environment.");
    writeFallbackData();
    return;
  }

  console.log(`Starting build-time fetch from Notion. Database: ${NOTION_DATABASE_ID}`);
  try {
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

      // Generate clean SEO fallback Slug and localize the thumbnail image
      const slug = generateSlug(title, page.id);
      if (thumbnailUrl) {
        thumbnailUrl = await downloadNotionImage(thumbnailUrl, slug, "cover");
      }

      // If there is a properties content block (Rich text)
      let initialContent = "";
      const contentProp = properties.Content || properties.content;
      if (contentProp && contentProp.type === "rich_text") {
        initialContent = contentProp.rich_text.map((t: any) => formatRichText(t)).join("");
      }

      // Fetch block components and build the HTML content at build-time!
      console.log(`Compiling HTML blocks for Notion page: "${title}" (${page.id})`);
      const contentHtml = await getPageContentHtml(page.id, slug, initialContent);

      posts.push({
        id: page.id,
        title,
        category,
        date,
        summary,
        thumbnailUrl,
        content: contentHtml
      });
    }

    if (posts.length === 0) {
      console.log("No published posts found in the Notion database response.");
      writeFallbackData();
    } else {
      // Write the compiled list of blog posts to the local file
      fs.writeFileSync(outputFilePath, JSON.stringify(posts, null, 2), "utf-8");
      console.log(`Successfully compiled and wrote ${posts.length} pages to ${outputFilePath}`);
    }
  } catch (err) {
    console.error("Failed build-time fetch operation:", err);
    writeFallbackData();
  }
}

run();
