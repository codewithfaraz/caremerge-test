import https from "https";
import http from "http";
import * as cheerio from "cheerio";
import url from "url";

//funtion to return promise for each website
function fetchTitles(query) {
  return new Promise((resolve, reject) => {
    const originalQuery = query;
    if (query.includes("http://")) query = query.replace("http://", "https://");
    if (!query.startsWith("https://")) query = "https://" + query;
    let data = "";
    let request = https.get(query, (res) => {
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const loadedHtml = cheerio.load(data);
          const title = loadedHtml("title").text();
          resolve({ originalQuery, title: title });
        } catch (err) {
          reject({ originalQuery, title: "No Response" });
        }
      });
    });
    request.on("error", (err) => {
      console.log("@23", err);
      reject({ originalQuery, title: "No Response" });
    });
    //5sec timeout
    request.setTimeout(5000, () => {
      request.destroy();
      reject({ originalQuery, title: "No Response(Timeout)" });
    });
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === "/I/want/title/") {
    let html = `
    <html>
    <head></head>
    <body>
    <h1> Following are the titles of given websites: </h1>
    <ul>
    `;
    let queries = parsedUrl.query.address;
    //turning single query parameter to array for map function
    queries = Array.isArray(queries) ? queries : [queries];
    let promises;
    try {
      promises = queries.map(fetchTitles);
    } catch (err) {
      res.statusCode(500);
      res.end("Internal Server error");
    }
    //settling promises
    Promise.allSettled(promises)
      .then((results) => {
        console.log("@49 here is completed");
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            html += `<li>${result.value.originalQuery} - "${result.value.title}"`;
          } else {
            html += `<li>${result.reason.originalQuery} - "${result.reason.title}"`;
          }
        });
        html += `</ul>
      </body>
      </html>
      `;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      })
      .catch((err) => {
        console.log(err);
        res.statusCode(500);
        res.end("Internal Server error");
        console.log("error");
      });
  } else {
    res.writeHead(400);
    res.end("Route Not Found");
  }
});

//server listening
server.listen(8000, () => {
  console.log("server is running on port 8000");
});
