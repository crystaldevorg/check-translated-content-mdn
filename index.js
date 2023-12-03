const https = require("https");
const { Client } = require("@notionhq/client");
const { config } = require("dotenv");
const links = require("./links.json");

config();

const apiKey = process.env.NOTION_API_KEY;

const notion = new Client({ auth: apiKey });

async function clearPage(pageId) {
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: startCursor,
    });

    for (const block of response.results) {
      await notion.blocks.delete({ block_id: block.id });
    }

    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }
}

// Function to check page status
async function checkPageStatus(link) {
  return new Promise((resolve) => {
    const request = https.get(link, (response) => {
      resolve(response.statusCode);
    });
    request.on("error", (err) => {
      console.error(`Error checking link: ${link}`);
      resolve(null);
    });
  });
}

async function main() {
  const blockId = process.env.NOTION_PAGE_ID;
  await clearPage(blockId);

  for (const rawLink of links) {
    try {
      const link = rawLink.replace("{{language}}", process.env.LANGUAGE_CODE);
      const status = await checkPageStatus(link);
      const isChecked = status === 200;

      const title = link.split("/").pop();

      console.log("\n\n\n\n------------");
      console.log(`Adding ${link}`);
      console.log("------------\n");

      await notion.blocks.children.append({
        block_id: blockId,
        children: [
          {
            object: "block",
            type: "heading_1",
            heading_1: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: title,
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "to_do",
            to_do: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: link,
                  },
                },
              ],
              checked: isChecked,
            },
          },
        ],
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}

main();
