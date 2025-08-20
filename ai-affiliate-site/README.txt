AUTO SITEMAP SETUP (Vercel)
===========================

Files included:
- package.json          -> defines `npm run build` to generate sitemap.xml
- scripts/generate-sitemap.mjs  -> scans .html files and writes sitemap.xml
- vercel.json           -> rewrites/redirects for clean blog URLs + caching headers

How to use with Vercel (GitHub flow):
1) Copy these files to your project root (where index.html is).
2) Commit & push to GitHub.
3) In Vercel Project Settings -> Build & Output, set "Build Command": `npm run build`
   (Output directory stays as project root).
4) Redeploy. Vercel will run the generator and include sitemap.xml in the deploy.
5) Your live sitemap will be at: https://tooltuonglai.com/sitemap.xml


Environment:
- The script uses SITE_ORIGIN env var if provided, otherwise defaults to https://tooltuonglai.com
