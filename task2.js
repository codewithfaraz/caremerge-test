import http from "http";
import url from "url";
import https from "https";
import async from "async";
import * as cheerio from "cheerio";
///creating server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === "/I/want/title/") {
    let queries = parsedUrl.query.address;
    queries = Array.isArray(queries) ? queries : [queries];
    let html = `
    <html>
    <head></head>
    <body>
    <h1> Following are the titles of given websites: </h1>
    <ul>
    `;
    try {
      async.each(
        queries,
        (query, callback) => {
          let isHandled = false;
          let originalQuery = query;
          if (query.includes("http://"))
            query = query.replace("http://", "https://");
          if (!query.startsWith("https://")) query = "https://" + query;
          let data = "";
          //fetching title with https
          const request = https.get(query, (res) => {
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
              if (!isHandled) {
                const loadedHtml = cheerio.load(data);
                const title = loadedHtml("title").text();
                html += `<li>${originalQuery} - "${title}"</li>`;
                console.log("@241", title);
                isHandled = true;
                callback();
              }
            });
          });
          request.on("error", (err) => {
            if (!isHandled) {
              isHandled = true;
              html += `<li>${originalQuery} - "No Response"</li>`;
              callback();
            }
          });
          request.setTimeout(5000, () => {
            if (!isHandled) {
              html += `<li>${originalQuery} - "No Response(Timeout)"</li>`;
              request.destroy();
              isHandled = true;
              callback();
            }
          });
        },
        () => {
          html += `</ul>
      </body>
      </html>
      `;
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(html);
        }
      );
    } catch (err) {
      res.writeHead(500);
      res.end("Internal Server error");
    }
  } else {
    res.writeHead(400);
    res.end("Route Not Found");
  }
});
server.listen(8000, () => {
  console.log("server is running on port 8000");
});
