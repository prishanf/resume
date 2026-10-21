import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const photoPath = path.join(root, 'public/images/posts/me.jpg')
const outPath = path.join(root, 'public/images/og-default.jpg')

const WIDTH = 1200
const HEIGHT = 630
const PHOTO = 300

const photoCircle = Buffer.from(
  `<svg width="${PHOTO}" height="${PHOTO}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${PHOTO / 2}" cy="${PHOTO / 2}" r="${PHOTO / 2}" fill="white"/>
  </svg>`
)

const photoRing = Buffer.from(
  `<svg width="${PHOTO + 16}" height="${PHOTO + 16}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${(PHOTO + 16) / 2}" cy="${(PHOTO + 16) / 2}" r="${(PHOTO + 16) / 2}" fill="#627A5B"/>
  </svg>`
)

const photo = await sharp(photoPath)
  .resize(PHOTO, PHOTO, { fit: 'cover', position: 'attention' })
  .composite([{ input: photoCircle, blend: 'dest-in' }])
  .png()
  .toBuffer()

const svg = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#F0F0F0"/>
  <rect x="0" y="0" width="18" height="${HEIGHT}" fill="#627A5B"/>
  <rect x="0" y="${HEIGHT - 18}" width="${WIDTH}" height="18" fill="#E8C16D"/>
  <rect x="72" y="86" width="1056" height="458" rx="28" fill="#EAE3CB"/>
  <text x="470" y="250" font-family="Inter, DejaVu Sans, sans-serif" font-size="56" font-weight="700" fill="#627A5B">Prishan Fernando</text>
  <rect x="470" y="278" width="120" height="6" rx="3" fill="#E8C16D"/>
  <text x="470" y="348" font-family="Inter, DejaVu Sans, sans-serif" font-size="22" font-weight="500" fill="#4F6848">Salesforce &amp; Agentforce Architect · Vancouver, BC</text>
</svg>
`)

await sharp(svg)
  .composite([
    { input: photoRing, left: 118, top: 157 },
    { input: photo, left: 126, top: 165 }
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(outPath)

const { default: fs } = await import('fs/promises')
const stats = await fs.stat(outPath)
console.log(`Wrote ${outPath} (${Math.round(stats.size / 1024)} KB)`)
