const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "../dist");
const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
    res.end(data);
  });
}

http.createServer((req, res) => {
  const cleanPath = decodeURIComponent(req.url.split("?")[0]);
  const relativePath = cleanPath === "/" ? "index.html" : cleanPath.slice(1);
  const requestedPath = path.resolve(root, relativePath);

  if (!requestedPath.startsWith(root)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(requestedPath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(res, requestedPath);
      return;
    }

    sendFile(res, path.join(root, "index.html"));
  });
}).listen(port, host, () => {
  console.log(`Dang phuc vu Frontend/dist tai http://${host}:${port}`);
});
