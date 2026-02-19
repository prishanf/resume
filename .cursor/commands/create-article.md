# Create Article (Blog Post)

Create or expand a blog post for `profile_website/content/posts/` using the project’s standard format.

## What I need from you

- **Topic or focus**: What the article is about (e.g. “AI and cloud transformation”, “building a profile site with Nuxt”).
- **Optional**: Existing draft, bullet points, or key messages you want included.

If you don’t specify a filename, suggest a slug (e.g. `ai-cloud-transformation`) and write to `content/posts/<slug>.md`.

---

## Required format

Follow this structure exactly so posts work with Nuxt Content and the site layout.

### 1. Frontmatter (YAML)

```yaml
---
title: "Your Article Title in Title Case"
description: "One clear sentence for SEO and social sharing (under ~160 chars)."
image: "https://images.unsplash.com/photo-XXXXX?q=80&w=2070&auto=format&fit=crop"
date: "YYYY-MM-DD"
excerpt: "1–2 sentences that appear in listings and previews."
tags: ["Tag1", "Tag2", "Tag3", "Tag4"]
published: true
---
```

- **title**: Clear, specific, in Title Case. No trailing period.
- **description**: One sentence; good for meta description and Open Graph.
- **image**: Use an Unsplash URL (e.g. `https://images.unsplash.com/photo-...?q=80&w=2070&auto=format&fit=crop`) or a local path like `/images/posts/your-image.png` if the asset exists.
- **date**: ISO date string `YYYY-MM-DD` (e.g. `2026-01-28`).
- **excerpt**: Short preview for cards and RSS; can repeat or rephrase the idea of the description.
- **tags**: Array of 3–6 relevant tags; use consistent casing (e.g. Title Case or lowercase).
- **published**: `true` for live posts, `false` for drafts.

### 2. Body structure

- **H1**: Must match `title` in the frontmatter exactly (same wording, no extra punctuation).
- **Opening paragraph**: 2–4 sentences that set context and hook the reader. No heading above it.
- **Sections**: Use `## Section Title` for main sections. Use `### Subsection` only when you need a clear sub-structure.
- **Content style**:
  - Use **bold** for emphasis on key terms or phrases.
  - Use numbered lists for steps or ordered points; bullet lists for unordered items.
  - Use blockquotes (`> "...quote..."`) for short, impactful quotes.
  - Optional: add a short closing line and sign-off (e.g. *Stay tuned for more...*) before the end.

### 3. Example structure (minimal)

```markdown
---
title: "The Future of AI-Enabled Cloud Transformation"
description: "Exploring how generative AI and Agentforce are reshaping enterprise architecture and delivery models."
image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
date: "2026-01-28"
excerpt: "As enterprise architectures become more complex, the role of AI in streamlining delivery and enhancing user experiences has never been more critical."
tags: ["AI", "Salesforce", "Cloud Computing", "Architecture"]
published: true
---

# The Future of AI-Enabled Cloud Transformation

In today's rapidly evolving technological landscape, the intersection of Cloud Computing and Artificial Intelligence is creating unprecedented opportunities for enterprise transformation. As a Salesforce Architect, I've seen firsthand how these technologies are moving from experimental phases to core strategic pillars.

## The Shift to Autonomous Agents

Content here...

## Architecture Considerations

Content here...

## Conclusion

Closing thoughts. Optional sign-off line.
```

---

## Your task

1. If I gave a **topic or outline**: generate a full article (frontmatter + body) in the format above and write it to `profile_website/content/posts/<slug>.md`. Suggest a slug and an Unsplash image search term if I didn’t specify one.
2. If I gave **existing content**: turn it into a full post with correct frontmatter and structure; preserve my meaning and tone.
3. If I’m **editing an existing file**: only change what I ask for; keep frontmatter and structure valid.

Always output valid YAML and markdown and use the date format `YYYY-MM-DD` for `date`.
