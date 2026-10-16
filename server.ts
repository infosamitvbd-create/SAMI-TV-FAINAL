import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // SAMI TV Live Stream Proxy (supports proxying stream & fallback for firewalls)
  app.all("/api/stream/*", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    try {
      const subPath = (req.params as any)[0] || "video.m3u8";
      const queryString = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
      const qs = queryString.includes("token=") ? queryString : (queryString ? `${queryString}&token=Sami-TV` : "?token=Sami-TV");
      const targetUrl = `https://bdix.ottking.top:8082/Sami-TV/${subPath}${qs}`;
      
      const upstream = await fetch(targetUrl);
      if (!upstream.ok) {
        return res.status(upstream.status).send(`Stream upstream error: ${upstream.statusText}`);
      }

      const contentType = upstream.headers.get("content-type") || 
        (subPath.endsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/MP2T");
      
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", subPath.endsWith(".m3u8") ? "no-cache, no-store, must-revalidate" : "public, max-age=3600");

      if (req.method === "HEAD") {
        return res.status(200).end();
      }

      const arrayBuffer = await upstream.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      console.error("Stream proxy error:", err);
      res.status(502).send("Stream proxy gateway error");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
