# YouTube Videos – Google Sheet setup (static site / GitHub Pages)

The **YouTube Videos** page (`/youtube-videos`) is built from a Google Sheet. The site runs as a **static** site (e.g. GitHub Pages), so there is **no server at runtime**. The sheet is fetched **at build time** and written to `data/youtube-videos.json`; the page reads that static file.

## 1. Create the Google Sheet

1. Create a new Google Sheet.
2. In **row 1**, add these column headers (exact names recommended, but case-insensitive):

   | Title       | Video URL   | Channel | Summary | Tags              | Watched Date |
   |------------|-------------|---------|---------|-------------------|--------------|
   | Video name | https://... | Channel | Short summary (Markdown OK) | productivity, coding | 2025-02-14   |

3. From row 2 onward, add one video per row.
4. **Tags**: use commas (or `;` / `|`) to separate multiple tags, e.g. `productivity, coding, nuxt`.
5. **Summary**: plain text or **Markdown** (bold, lists, links, code). The page shows a “Show summary” / “Hide summary” toggle and renders Markdown with nice formatting.

## 2. Share the sheet

- Click **Share**.
- Set access to **“Anyone with the link”** → **Viewer** (so the build can read the sheet without logging in).

## 3. Get the Sheet ID

From the sheet URL:

```
https://docs.google.com/spreadsheets/d/ YOUR_SHEET_ID_HERE /edit#gid=0
```

Copy the part between `/d/` and `/edit` — that is your **Sheet ID**.

## 4. Configure the build

Set this in your environment so the **sync script** can fetch the sheet at build time:

```bash
NUXT_PUBLIC_GOOGLE_SHEET_ID_VIDEOS=your_sheet_id_here
```

Optional: if your data is on a different tab (not the first one), set the tab’s **gid** (from the URL when you open that tab: `#gid=123456`):

```bash
NUXT_PUBLIC_GOOGLE_SHEET_GID_VIDEOS=123456
```

- **Local:** put these in a `.env` file (and add `.env` to `.gitignore` if it contains secrets).
- **GitHub Pages / GitHub Actions:** add `NUXT_PUBLIC_GOOGLE_SHEET_ID_VIDEOS` (and optionally `NUXT_PUBLIC_GOOGLE_SHEET_GID_VIDEOS`) as **repository secrets**, then use them in your build workflow when running `npm run generate` (or `npm run build`).

## 5. Build and deploy

- **Sync script:** `npm run sync-youtube-videos` fetches the sheet and writes `data/youtube-videos.json`.
- **Build:** `npm run generate` already runs `sync-youtube-videos` before generating the site, so you don’t need to run it by hand.
- The generated site is fully static; no server is needed at runtime. Deploy the output (e.g. `dist/` or `.output/public/`) to GitHub Pages as usual.

To refresh the video list, re-run the build (e.g. push a commit so GitHub Actions runs again). New or updated rows in the sheet will appear after the next deploy.
