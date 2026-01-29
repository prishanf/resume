# Prishan Fernando - Profile Website

A beautiful, modern resume website built with Nuxt 3, Nuxt Content, and Tailwind CSS.

## Features

- **Static Site Generation**: Fast, SEO-friendly static website
- **Content Management**: Markdown-based content using Nuxt Content
- **Responsive Design**: Mobile-first, elegant design with Tailwind CSS
- **Blog System**: Full-featured blog with social sharing
- **Resume Download**: Downloadable PDF resume
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

## Branding

The site uses a custom color palette:

- **Primary**: `#738E6B` (Muted Olive Green)
- **Secondary**: `#EAE3CB` (Pale Beige)
- **Accent**: `#E8C16D` (Metallic Gold)
- **Inverse**: `#F0F0F0` (Off-White)

Colors can be customized in `tailwind.config.js`.

## Deployment

The site can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repo
- **Netlify**: Drag and drop the `.output/public` folder
- **GitHub Pages**: Use GitHub Actions to build and deploy

## License

Personal portfolio website - All rights reserved.
