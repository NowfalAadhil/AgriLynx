import type { ImageStats } from '../types'

export const MAX_BYTES = 8 * 1024 * 1024
export const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

export function validateFile(file: File): string | null {
  if (!ACCEPTED.includes(file.type)) return 'Unsupported file type. Please upload a JPG, PNG or WebP image.'
  if (file.size === 0) return 'This file is empty.'
  if (file.size > MAX_BYTES) return `File is too large (${(file.size / 1048576).toFixed(1)} MB). Maximum size is 8 MB.`
  return null
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('This image could not be read. It may be corrupted.'))
    img.src = src
  })
}

/** Real measurements from the pixels. Simple colour ratios only: not a diagnosis. */
export function measureImage(img: HTMLImageElement): ImageStats {
  const w = img.naturalWidth
  const h = img.naturalHeight
  const scale = Math.min(1, 200 / Math.max(w, h))
  const cw = Math.max(1, Math.round(w * scale))
  const ch = Math.max(1, Math.round(h * scale))
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')
  if (!ctx) return { width: w, height: h, brightness: 0, greenShare: 0, warmShare: 0 }
  ctx.drawImage(img, 0, 0, cw, ch)
  const { data } = ctx.getImageData(0, 0, cw, ch)
  let lum = 0, green = 0, warm = 0, n = 0
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    lum += 0.2126 * r + 0.7152 * g + 0.0722 * b
    if (2 * g - r - b > 20) green++ // excess-green style test
    else if (r > g && r > b && r - b > 30) warm++ // yellow/brown/red-ish pixels
    n++
  }
  return {
    width: w,
    height: h,
    brightness: Math.round(lum / n),
    greenShare: Math.round((green / n) * 100),
    warmShare: Math.round((warm / n) * 100),
  }
}

export function makeThumbnail(img: HTMLImageElement, size = 160): string {
  const scale = Math.min(1, size / Math.max(img.naturalWidth, img.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale))
  canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.7)
}

export function qualityNotes(s: ImageStats): string[] {
  const notes: string[] = []
  if (Math.min(s.width, s.height) < 400) notes.push('Low resolution: a larger, sharper photo makes inspection easier.')
  if (s.brightness < 60) notes.push('The image is quite dark: retake in daylight if possible.')
  if (s.brightness > 215) notes.push('The image is very bright or overexposed: avoid direct glare.')
  if (s.greenShare < 8) notes.push('Little green vegetation detected by a simple colour test: check that the plant fills the frame.')
  if (notes.length === 0) notes.push('Basic image properties look usable for visual inspection.')
  return notes
}
