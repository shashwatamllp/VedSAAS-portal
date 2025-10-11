# vedsaas-www (pro starter)
Production-ready static site for VedSAAS, smoothly linked to the app.
- Local UI kit under `/ui` (no external CDN). Same theme can be copied to app.
- Partials `/partials/header.html` + `/partials/footer.html` included via `/ui/ved.js`.
- GitHub Pages workflow included.

## Deploy
1) Create repo `vedsaas-www` → upload all files (drag & drop ZIP).
2) Ensure `.github/workflows/pages.yml` exists on `main` branch.
3) Settings → Pages → Source: GitHub Actions.
4) Edit `CNAME` to your domain if needed.
