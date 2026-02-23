# Podcast episodes

Episode content lives here as markdown. **Audio files should not be committed to the repo** (see `.gitignore`). Host them externally and use the full URL in each episode’s `<audio>` and download links.

## Hosting large audio files (~35MB+)

GitHub isn’t suitable for large binaries. Prefer one of these:

| Option | Pros | Cons |
|--------|------|------|
| **Cloudflare R2** | S3-compatible, **free egress**, low cost | Need Cloudflare account |
| **AWS S3 + CloudFront** | Reliable, CDN, common choice | Paid (egress costs) |
| **Backblaze B2** | Cheap storage, free egress with Cloudflare | Extra setup for public URLs |
| **SoundCloud / Buzzsprout** | Podcast-focused, embed players | Different workflow, may not want “platform” branding |

**Recommended: Cloudflare R2** – create a bucket, upload the `.m4a`, set the object to public, and use the object URL in your episode markdown.

### After you have a URL

In the episode’s `.md` file, replace the placeholder audio URL with your hosted URL, e.g.:

```html
<source src="https://your-bucket.r2.dev/Is_Amazon_Bedrock_Safer_Than_Claude.m4a" type="audio/mp4" />
```

Use the same URL in the download link and in any body text that links to the file.
