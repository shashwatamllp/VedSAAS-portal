// node 18+
// npm i yaml fs-extra
import fs from "fs";
import fse from "fs-extra";
import { parse } from "yaml";

const cfg = parse(fs.readFileSync("manager/subdomains.yaml","utf8"));
const tpl = fs.readFileSync("manager/templates/page.html","utf8");

for (const s of cfg.subdomains) {
  const dir = `${s.key}`;
  await fse.ensureDir(dir);
  const html = tpl
    .replaceAll("{{TITLE}}", s.title)
    .replaceAll("{{EMOJI}}", s.emoji || "")
    .replaceAll("{{BLURB}}", s.blurb || "")
    .replaceAll("{{KEY}}", s.key);

  await fse.writeFile(`${dir}/index.html`, html);
  console.log("Generated:", `${dir}/index.html`);
}

// Landing page cards को auto-link (optional enhancement)
const idx = "index.html";
if (fs.existsSync(idx)) {
  let indexHtml = fs.readFileSync(idx,"utf8");
  // जहां cards हैं, वहां href inject करो (simple heuristic)
  indexHtml = indexHtml
    .replace('href="/gurukul/"', 'href="/gurukul/"') // already ok
    // अगर static थे तो ensure anchors:
    .replaceAll('class="card"><h3>🧘 Gurukul','class="card" href="/gurukul/"><h3>🧘 Gurukul')
    .replaceAll('class="card"><h3>🌾 Krishi','class="card" href="/krishi/"><h3>🌾 Krishi')
    .replaceAll('class="card"><h3>🛡 Guardian','class="card" href="/guardian/"><h3>🛡 Guardian');

  fs.writeFileSync(idx,indexHtml);
  console.log("Patched landing links in index.html");
}

// robots + sitemap basics
await fse.writeFile("robots.txt", `Sitemap: https://console.vedsaas.com/sitemap.txt\nUser-agent: *\nAllow: /\n`);
await fse.writeFile("sitemap.txt", 
  ["/","/pricing.html","/contact.html", ...cfg.subdomains.map(s=>`/${s.key}/`)]
  .map(p=>"https://console.vedsaas.com"+p).join("\n")
);
console.log("Wrote robots.txt & sitemap.txt");
