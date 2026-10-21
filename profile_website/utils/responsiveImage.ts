const UNSPLASH_WIDTHS = [640, 828, 1080, 1200, 1600] as const

function isUnsplash(src: string) {
  return src.includes('images.unsplash.com')
}

/** Rebuild an Unsplash URL at a specific width instead of the default 2070px crop. */
export function unsplashWidthUrl(src: string, width: number, quality = 80) {
  try {
    const url = new URL(src)
    url.searchParams.set('w', String(width))
    url.searchParams.set('auto', 'format')
    url.searchParams.set('fit', 'crop')
    url.searchParams.set('q', String(quality))
    return url.toString()
  } catch {
    return src
  }
}

export function responsiveImageAttrs(src?: string | null, sizes = '(max-width: 768px) 100vw, 768px') {
  if (!src) {
    return { src: '', srcset: undefined as string | undefined, sizes: undefined as string | undefined }
  }
  if (!isUnsplash(src)) {
    return { src, srcset: undefined, sizes: undefined }
  }
  const srcset = UNSPLASH_WIDTHS.map((width) => `${unsplashWidthUrl(src, width)} ${width}w`).join(', ')
  return {
    src: unsplashWidthUrl(src, 1080),
    srcset,
    sizes
  }
}
