const https = require("https");
const fs = require("fs");
const { config } = require("dotenv");
const links = require("./links.json");

config();

async function checkPageStatus(link) {
  return new Promise((resolve) => {
    const request = https.get(link, (response) => {
      resolve(response.statusCode);
    });
    request.on("error", (err) => {
      console.error(`Error checking link: ${link}`);
      resolve(null);
    });
    request.setTimeout(5000, () => {
      // 5 seconds timeout
      console.error(`Timeout checking link: ${link}`);
      request.abort();
      resolve(404); // Treat timeout as page not found
    });
  });
}

async function main() {
  const filePath = "./TODO.md";
  let content = "# TODO List\n\n";

  const linkPromises = links.map(async (rawLink, index) => {
    try {
      const link = rawLink.replace("{{language}}", process.env.LANGUAGE_CODE);
      const status = await checkPageStatus(link);
      const isChecked = status === 200;

      const title = link.split("/").pop();

      console.log(`Processing link ${index + 1}/${links.length}: ${link}`);

      return `## ${title}\n- [${isChecked ? "x" : " "}] ${link}\n\n`;
    } catch (err) {
      console.error(`Error processing link: ${rawLink}`, err);
      return `## ${rawLink}\n- [ ] ${rawLink}\n\n`;
    }
  });

  const results = await Promise.all(linkPromises);
  content += results.join("");

  fs.writeFileSync(filePath, content, "utf8");
}

main();
