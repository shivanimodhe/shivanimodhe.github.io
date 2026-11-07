# Shivani Modhe · Portfolio

Plain HTML, CSS and JavaScript. No framework, no build step.

```
shivani-portfolio/
├── index.html          the page (all text lives here)
├── css/styles.css      design; light and dark colors are at the top
├── js/main.js          theme toggle, menu, copy email, share, animations
├── assets/
│   ├── shivani.jpg     portrait
│   └── favicon.svg     browser tab icon
├── robots.txt          for search engines
└── sitemap.xml         for search engines
```

## Run locally

```bash
cd shivani-portfolio
python3 -m http.server 8080
```
Open http://localhost:8080 (or double-click index.html).

## Before publishing: fill in the placeholders

Search index.html for `[` to find every placeholder:
- Availability: `[ROLE TYPE]`
- About: one or two sentences in her own words
- Résumé: add `assets/resume.pdf`

After deploying, replace `shivanimodhe` in index.html, robots.txt and sitemap.xml with her GitHub username.

## Deploy to GitHub Pages

1. Create a public repo named `<username>.github.io`.
2. Add file → Upload files: drag in everything in this folder. Commit.
3. Settings → Pages → Deploy from a branch → main / (root) → Save.
4. Live at `https://<username>.github.io` in a minute or two.
