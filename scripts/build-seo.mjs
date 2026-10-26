import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const configurationPath = path.join(projectDirectory, "seo", "metadata.json");
const config = JSON.parse(await readFile(configurationPath, "utf8"));
const argumentBaseUrl = process.argv.find((argument) => argument.startsWith("--base-url="));
const siteUrl = (argumentBaseUrl?.slice("--base-url=".length) || config.siteUrl || "")
  .trim()
  .replace(/\/$/, "");

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function meta(name, content, attribute = "name") {
  return `<meta ${attribute}="${escapeAttribute(name)}" content="${escapeAttribute(content)}" />`;
}

function canonicalFor(route) {
  if (!siteUrl) return "";
  const normalizedRoute = route === "index.html" ? "" : route;
  return new URL(normalizedRoute, `${siteUrl}/`).href;
}

function createOrganizationData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.brand,
    alternateName: config.englishBrand,
    telephone: config.telephone,
    address: {
      "@type": "PostalAddress",
      addressLocality: config.address.locality,
      addressRegion: config.address.region,
      addressCountry: config.address.country,
    },
    areaServed: config.serviceAreas.map((name) => ({ "@type": "Place", name })),
    knowsAbout: [...config.services, ...config.servicesEnglish],
    ...(siteUrl ? { url: `${siteUrl}/` } : {}),
  };
  if (!siteUrl) return organization;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        name: config.brand,
        alternateName: config.englishBrand,
        url: `${siteUrl}/`,
      },
    ],
  };
}

function buildSeoBlock(route, page) {
  const canonical = canonicalFor(route);
  const title = page.title;
  const description = page.description;
  const directives = page.noindex
    ? "noindex,follow"
    : "index,follow,max-image-preview:large";
  const tags = [
    meta("description", description),
    meta("robots", directives),
    meta("author", config.brand),
    meta("application-name", config.englishBrand),
    meta("og:type", "website", "property"),
    meta("og:site_name", config.brand, "property"),
    meta("og:locale", config.locale, "property"),
    meta("og:title", title, "property"),
    meta("og:description", description, "property"),
    meta("twitter:card", "summary"),
    meta("twitter:title", title),
    meta("twitter:description", description),
  ];
  if (canonical) {
    tags.push(`<link rel="canonical" href="${escapeAttribute(canonical)}" />`);
    tags.push(meta("og:url", canonical, "property"));
  }
  return `${tags.join("\n    ")}\n    <title>${escapeAttribute(title)}</title>`;
}

const managedMeta = /<meta\s+(?=[^>]*(?:name\s*=\s*["'](?:description|robots|author|application-name|twitter:[^"']+)["']|property\s*=\s*["']og:[^"']+["']))[^>]*\/?\s*>/gi;
const managedLinks = /<link\s+[^>]*rel\s*=\s*["']canonical["'][^>]*\/?\s*>/gi;
const managedStructuredData = /<script\s+type\s*=\s*["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi;

for (const [route, page] of Object.entries(config.pages)) {
  const filePath = path.join(projectDirectory, route);
  let html = await readFile(filePath, "utf8");
  html = html.replace(/<head>([\s\S]*?)<\/head>/i, (wholeHead, originalHead) => {
    let head = originalHead
      .replace(managedMeta, "")
      .replace(managedLinks, "")
      .replace(managedStructuredData, "")
      .replace(/\s*<title>[\s\S]*?<\/title>/i, "");
    const seoBlock = buildSeoBlock(route, page);
    head = head.replace(/(<meta\s+charset=["'][^"']+["']\s*\/?\s*>)/i, `$1\n    ${seoBlock}`);
    const structuredData = route === "index.html"
      ? `\n    <script type="application/ld+json">${JSON.stringify(createOrganizationData())}</script>`
      : "";
    return `<head>${head}${structuredData}\n  </head>`;
  });
  await writeFile(filePath, html, "utf8");
  console.log(`SEO metadata written: ${route}`);
}

if (siteUrl) {
  const sitemapEntries = Object.entries(config.pages)
    .filter(([, page]) => !page.noindex)
    .map(([route]) => `  <url><loc>${escapeAttribute(canonicalFor(route))}</loc></url>`)
    .join("\n");
  await writeFile(
    path.join(projectDirectory, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`,
    "utf8",
  );
  await writeFile(
    path.join(projectDirectory, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
    "utf8",
  );
} else {
  console.log("Public domain not set; canonical URLs and absolute sitemap entries were omitted.");
}
