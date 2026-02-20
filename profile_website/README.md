# Prishan Fernando - Profile Website

A beautiful, modern resume website built with Nuxt 3, Nuxt Content, and Tailwind CSS.

## Features

- **Static Site Generation**: Fast, SEO-friendly static website
- **Content Management**: Markdown-based content using Nuxt Content
- **Responsive Design**: Mobile-first, elegant design with Tailwind CSS
- **Blog System**: Full-featured blog with social sharing
- **Resume Download**: Downloadable PDF resume
- **Activity Summary**: Build-time changelog from GitHub commit history (heatmap, weekly breakdown, commit types)
- **Professional Branding**: Custom color palette and typography

## Tech Stack

- **Nuxt 3**: Vue.js framework for static site generation
- **Nuxt Content**: Markdown content management
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **TypeScript**: Type-safe development

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run generate
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
profile_website/
├── content/          # Markdown content files
│   ├── about.md
│   ├── experience.md
│   ├── posts/        # Blog posts
│   └── evidence/     # Yearly evidence files
├── components/       # Vue components
│   ├── Layout/       # Header, Footer
│   ├── Sections/     # Hero, Timeline, etc.
│   ├── Blog/         # Blog components
│   └── UI/           # Reusable UI components
├── pages/            # Nuxt pages (auto-routing)
├── data/             # Generated data (e.g. activity-summary.json)
├── scripts/          # Build-time scripts (sync-activity-summary, etc.)
├── public/           # Static assets (resume.pdf)
└── assets/           # CSS and other assets
```

## Content Management

### Adding a Blog Post

Create a new markdown file in `content/posts/` with frontmatter:

```yaml
---
title: "Post Title"
description: "Brief description"
image: "/images/posts/image.jpg"
date: "2025-01-28"
excerpt: "Short excerpt"
tags: ["tag1", "tag2"]
published: true
---

Your post content here...
```

### Updating Resume

Replace `public/resume.pdf` with your updated resume PDF.

### Activity Summary

The **Activity Summary** page (`/activity-summary`) shows a build-time changelog derived from your GitHub commit history: heatmap, type breakdown (feature, fix, design, etc.), and weekly/day details. Data is generated when you run the sync script (or as part of `npm run build` / `npm run generate`).

1. **Set environment variables** (in `.env` in `profile_website/`, or in GitHub Actions as **repository variables/secrets** using the `ACTIVITY_*` names — GitHub does not allow variable names starting with `GITHUB_`):
   - **`ACTIVITY_REPO`** (or `GITHUB_REPO` locally): repository in `owner/repo` form, or full URL e.g. `https://github.com/owner/repo`. Required for real data.
   - **`ACTIVITY_BRANCH`** (or `GITHUB_BRANCH` locally, optional): branch to fetch commits from (default: `main`).
   - **`ACTIVITY_TOKEN`** (or `GITHUB_TOKEN` locally, optional): GitHub personal access token; increases API rate limit and allows fetching commit stats (files/lines) for more commits. Without a token, only a limited number of commits get detailed stats.

2. **Run the sync** (or rely on build):
   ```bash
   npm run sync-activity-summary
   ```
   This writes `data/activity-summary.json`. The `build` and `generate` scripts run this step automatically. If `ACTIVITY_REPO` / `GITHUB_REPO` is not set, a minimal placeholder is written so the build still succeeds.

3. **Optional**: To change the GitHub profile link on the Activity Summary page, set **`NUXT_PUBLIC_GITHUB_PROFILE_URL`** in `.env` (e.g. `https://github.com/yourusername`).

## Branding

The site uses a custom color palette:

- **Primary**: `#738E6B` (Muted Olive Green)
- **Secondary**: `#EAE3CB` (Pale Beige)
- **Accent**: `#E8C16D` (Metallic Gold)
- **Inverse**: `#F0F0F0` (Off-White)

Colors can be customized in `tailwind.config.js`.

## Analytics (traffic & page usage)

The site uses **Google Analytics 4 (GA4)** for traffic and per-page usage. The gtag script is included in the static HTML (see `nuxt.config.ts` → `app.head.script`). You get:

- **Traffic**: visitors, sessions, geographic data, devices
- **Page usage**: which pages are viewed (Reports → Engagement → Pages and screens)

### Setup

1. **Create a GA4 property** (if you don’t have one):
   - Go to [Google Analytics](https://analytics.google.com/) → Admin → Create property
   - Add a **Web** data stream for your site URL and copy the **Measurement ID** (e.g. `G-XXXXXXXXXX`).

2. **Enable page-change tracking** (for client-side navigation):
   - In GA4: Admin → Data Streams → your web stream → **Enhanced measurement**
   - Turn on **“Page changes based on browser history events”**.

3. **Set the Measurement ID**:
   - **Local / build**: create a `.env` in `profile_website/` with:
     ```bash
     NUXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX
     ```
   - **GitHub Pages**: In your repo go to **Settings → Secrets and variables → Actions**, add a **Variable** named `NUXT_PUBLIC_GTAG_ID` with your measurement ID. The deploy workflow already passes this into the build.

Analytics only runs when `NUXT_PUBLIC_GTAG_ID` is set and in production (not in `npm run dev`).

## License

Personal portfolio website - All rights reserved.
