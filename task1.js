import http from "http";
import url from "url";
import https from "https";
import * as cheerio from "cheerio";
///creating server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === "/I/want/title/") {
    let queries = parsedUrl.query.address;
    queries = Array.isArray(queries) ? queries : [queries];
    let completed = 0;
    let length = queries.length;
    let html = `
    <html>
    <head></head>
    <body>
    <h1> Following are the titles of given websites: </h1>
    <ul>
    `;
    queries.forEach((query) => {
      let originalQuery = query;
      if (query.includes("http://")) query.replace("http://", "https://");
      if (!query.startsWith("https://")) query = "https://" + query;
      let data = "";
      //fetching title with https
      try {
        const request = https.get(query, (res) => {
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            const loadedHtml = cheerio.load(data);
            const title = loadedHtml("title").text();
            html += `<li>${originalQuery} - "${title}"</li>`;
            console.log("@241", title);
            completed++;
            if (completed === length) sendResponse();
          });
        });
        request.on("error", (err) => {
          html += `<li>${originalQuery} - "No Response"</li>`;
          completed++;
          if (completed === length) sendResponse();
          console.log("@232", err);
        });
      } catch (err) {
        res.statusCode(500);
        res.end("Internal Server error");
      }
    });
    function sendResponse() {
      if (completed === length) {
        html += `</ul>
      </body>
      </html>
      `;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      }
    }
  } else {
    res.writeHead(400);
    res.end("Route Not Found");
  }
});
server.listen(8000, () => {
  console.log("server is running on port 8000");
});
