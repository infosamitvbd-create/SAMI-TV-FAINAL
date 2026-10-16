import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  const url = new URL(req.url);
  
  // Extract the stream subpath after /api/stream/
  const match = url.pathname.match(/\/api\/stream\/?(.*)/);
  const subPath = (match && match[1]) ? match[1] : "video.m3u8";
  
  const searchParams = new URLSearchParams(url.search);
  if (!searchParams.has("token")) {
    searchParams.set("token", "Sami-TV");
  }
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const targetUrl = `https://bdix.ottking.top:8082/Sami-TV/${subPath}${queryString}`;

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Accept": "*/*",
        "User-Agent": "Mozilla/5.0 (compatible; SAMITV/1.0)",
      },
    });

    if (!upstream.ok) {
      return new Response(`Stream upstream error: ${upstream.statusText}`, {
        status: upstream.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const contentType = upstream.headers.get("content-type") ||
      (subPath.endsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/MP2T");

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Cache-Control": subPath.endsWith(".m3u8") 
          ? "no-cache, no-store, must-revalidate" 
          : "public, max-age=3600",
      },
    });
  } catch (err: any) {
    return new Response(`Stream proxy gateway error: ${err?.message || "connection failed"}`, {
      status: 502,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
};

export const config: Config = {
  path: "/api/stream/*",
};
