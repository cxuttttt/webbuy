import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src");
const dist = path.join(root, "dist");
const token = "__SITE_ORIGIN__";

function normalizeOrigin(value) {
  if (!value) return "";
  let v = value.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  return v;
}

const vercelEnv = process.env.VERCEL_ENV || "development";
const origin = normalizeOrigin(
  process.env.SITE_ORIGIN ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL
);

if (vercelEnv === "production" && !origin) {
  console.error("Production URL is unavailable. Enable Vercel system environment variables and redeploy.");
  process.exit(1);
}

const effectiveOrigin = origin || "http://localhost:3000";
const indexable = vercelEnv === "production" && /^https:\/\//.test(effectiveOrigin);

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(src, dist, { recursive: true });

const htmlFiles = fs.readdirSync(dist).filter(name => name.endsWith(".html"));
for (const name of htmlFiles) {
  const file = path.join(dist, name);
  let html = fs.readFileSync(file, "utf8").replaceAll(token, effectiveOrigin);

  if (!indexable && name !== "404.html") {
    html = html.replace("</head>", '  <meta name="robots" content="noindex,nofollow">\n</head>');
  }
  if (name === "404.html" && !/name="robots"/i.test(html)) {
    html = html.replace("</head>", '  <meta name="robots" content="noindex,nofollow">\n</head>');
  }
  fs.writeFileSync(file, html);
}

const publicPaths = [
  "/",
  "/roof-square-footage-calculator",
  "/roofing-square-calculator",
  "/roof-shingle-calculator",
  "/metal-roof-cost-calculator",
  "/methodology",
  "/about",
  "/privacy-policy",
  "/terms",
  "/contact"
];

fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  ['<?xml version="1.0" encoding="UTF-8"?>',
   '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
   ...publicPaths.map(p => `  <url><loc>${effectiveOrigin}${p}</loc></url>`),
   '</urlset>', ''].join("\n")
);

fs.writeFileSync(
  path.join(dist, "robots.txt"),
  indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${effectiveOrigin}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n"
);

const errors = [];
for (const name of fs.readdirSync(dist)) {
  const file = path.join(dist, name);
  if (!fs.statSync(file).isFile()) continue;
  const ext = path.extname(name);
  if (![".html", ".xml", ".txt", ".json", ".svg"].includes(ext)) continue;
  const str = fs.readFileSync(file, "utf8");
  if (str.includes(token)) errors.push(`${name}: unresolved site-origin token`);
  if (str.includes("CONTACT_EMAIL_PLACEHOLDER")) errors.push(`${name}: unresolved email placeholder`);
  if (indexable && name.endsWith(".html") && name !== "404.html" && /noindex/i.test(str)) {
    errors.push(`${name}: production page still contains noindex`);
  }
}
if (errors.length) {
  console.error("Build audit failed:\n" + errors.join("\n"));
  process.exit(1);
}

console.log(`Built ${htmlFiles.length} HTML pages.`);
console.log(`Canonical origin: ${effectiveOrigin}`);
