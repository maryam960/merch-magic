import { NextRequest, NextResponse } from "next/server";
import { lookup } from "dns/promises";
import { isIP } from "net";

export const runtime = "nodejs";
export const maxDuration = 20;

const TIMEOUT_MS = 8000;
const MAX_HTML_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_REDIRECTS = 4;
const UA = "Mozilla/5.0 (compatible; MerchMagicBrandFetcher/1.0; +https://www.merchmagic.uk)";

/**
 * This endpoint fetches a URL supplied by the visitor, so every hop has to be
 * checked against private address space or it becomes an SSRF hole into
 * whatever else is reachable from the server.
 */
function isBlockedAddress(ip: string): boolean {
  if (isIP(ip) === 4) {
    const p = ip.split(".").map(Number);
    if (p[0] === 10) return true;
    if (p[0] === 127) return true;
    if (p[0] === 0) return true;
    if (p[0] === 169 && p[1] === 254) return true; // link-local / cloud metadata
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true;
    if (p[0] === 192 && p[1] === 168) return true;
    if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return true; // CGNAT
    if (p[0] >= 224) return true; // multicast / reserved
    return false;
  }
  const v6 = ip.toLowerCase();
  if (v6 === "::1" || v6 === "::") return true;
  if (v6.startsWith("fe80") || v6.startsWith("fc") || v6.startsWith("fd")) return true;
  if (v6.startsWith("::ffff:")) return isBlockedAddress(v6.slice(7)); // mapped v4
  return false;
}

async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal")) {
    throw new Error("That address isn't reachable.");
  }
  if (isIP(host)) {
    if (isBlockedAddress(host)) throw new Error("That address isn't reachable.");
    return;
  }
  const records = await lookup(host, { all: true });
  if (!records.length) throw new Error("We couldn't find that website.");
  for (const r of records) {
    if (isBlockedAddress(r.address)) throw new Error("That address isn't reachable.");
  }
}

/** Follows redirects by hand so each hop can be re-validated. */
async function safeFetch(startUrl: string, accept: string): Promise<Response> {
  let url = startUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("Only http and https addresses are supported.");
    }
    await assertPublicHost(parsed.hostname);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(parsed.toString(), {
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": UA, Accept: accept },
      });
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return res;
      url = new URL(loc, parsed).toString();
      continue;
    }
    return res;
  }
  throw new Error("That website redirected too many times.");
}

async function readCapped(res: Response, cap: number): Promise<Buffer> {
  const len = Number(res.headers.get("content-length") || 0);
  if (len && len > cap) throw new Error("That file is too large.");
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > cap) throw new Error("That file is too large.");
  return buf;
}

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return m ? m[1] : null;
}

/** Ranked candidates — a square app icon usually crops better than a wide OG banner. */
function findLogoCandidates(html: string, base: URL): string[] {
  const out: { href: string; score: number }[] = [];
  const push = (href: string | null, score: number) => {
    if (!href) return;
    try {
      const abs = new URL(href, base).toString();
      if (abs.startsWith("http")) out.push({ href: abs, score });
    } catch {
      /* ignore unparseable */
    }
  };

  for (const tag of html.match(/<link[^>]+>/gi) || []) {
    const rel = (attr(tag, "rel") || "").toLowerCase();
    const href = attr(tag, "href");
    const sizes = attr(tag, "sizes") || "";
    const px = parseInt(sizes.split("x")[0], 10) || 0;
    if (rel.includes("apple-touch-icon")) push(href, 100 + px);
    else if (rel.includes("icon")) push(href, 40 + Math.min(px, 60));
    else if (rel.includes("mask-icon")) push(href, 30);
  }

  for (const tag of html.match(/<meta[^>]+>/gi) || []) {
    const prop = (attr(tag, "property") || attr(tag, "name") || "").toLowerCase();
    const content = attr(tag, "content");
    if (prop === "og:logo") push(content, 120);
    else if (prop === "og:image" || prop === "twitter:image") push(content, 55);
  }

  for (const tag of html.match(/<img[^>]+>/gi) || []) {
    const hay = tag.toLowerCase();
    if (hay.includes("logo")) push(attr(tag, "src"), 80);
  }

  // conventional paths, often present even when not declared in <head>
  push(new URL("/apple-touch-icon.png", base).toString(), 95);
  push(new URL("/apple-touch-icon-precomposed.png", base).toString(), 94);
  push(new URL("/favicon.ico", base).toString(), 10);

  out.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  return out.filter((c) => !seen.has(c.href) && seen.add(c.href)).map((c) => c.href).slice(0, 6);
}

export async function POST(request: NextRequest) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = (body.url || "").trim();
  if (!raw) return NextResponse.json({ error: "Enter a website address." }, { status: 400 });

  let target: URL;
  try {
    target = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return NextResponse.json({ error: "That doesn't look like a website address." }, { status: 400 });
  }
  if (!target.hostname.includes(".")) {
    return NextResponse.json({ error: "That doesn't look like a website address." }, { status: 400 });
  }

  try {
    const pageRes = await safeFetch(target.toString(), "text/html,*/*");
    if (!pageRes.ok) {
      return NextResponse.json(
        { error: `That website returned an error (${pageRes.status}).` },
        { status: 502 }
      );
    }
    const html = (await readCapped(pageRes, MAX_HTML_BYTES)).toString("utf8");
    const finalUrl = new URL(pageRes.url || target.toString());

    for (const candidate of findLogoCandidates(html, finalUrl)) {
      try {
        const imgRes = await safeFetch(candidate, "image/*");
        if (!imgRes.ok) continue;
        const type = (imgRes.headers.get("content-type") || "").split(";")[0].trim();
        if (!type.startsWith("image/") || type === "image/svg+xml") continue; // canvas/model need raster
        const buf = await readCapped(imgRes, MAX_IMAGE_BYTES);
        if (buf.length < 512) continue; // near-empty placeholder
        return NextResponse.json({
          image: `data:${type};base64,${buf.toString("base64")}`,
          source: candidate,
          site: finalUrl.hostname.replace(/^www\./, ""),
        });
      } catch {
        continue; // try the next candidate
      }
    }

    return NextResponse.json(
      { error: "We couldn't find a logo on that site — try uploading the file instead." },
      { status: 404 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "We couldn't reach that website.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
