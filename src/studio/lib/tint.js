import { useEffect, useState } from 'react'

// Recolours a logo PNG: each pixel becomes `hex` with alpha × (1 − luminance),
// so black artwork takes the colour and white fills drop out.
// Results are cached by `src|hex`.
const cache = new Map()
const pending = new Map()

function hexToRgb(hex) {
  const h = /^#[0-9a-f]{6}$/i.test(hex) ? hex : '#1F1E1C'
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
}

export function tint(src, hex) {
  const key = src + '|' + hex
  if (cache.has(key)) return Promise.resolve(cache.get(key))
  if (pending.has(key)) return pending.get(key)
  const p = new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      const o = c.getContext('2d')
      o.drawImage(img, 0, 0)
      const d = o.getImageData(0, 0, c.width, c.height)
      const px = d.data
      const [r, g, b] = hexToRgb(hex)
      for (let i = 0; i < px.length; i += 4) {
        const lum = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255
        px[i + 3] = Math.round(px[i + 3] * (1 - lum))
        px[i] = r
        px[i + 1] = g
        px[i + 2] = b
      }
      o.putImageData(d, 0, 0)
      const url = c.toDataURL('image/png')
      cache.set(key, url)
      pending.delete(key)
      resolve(url)
    }
    img.onerror = (e) => {
      pending.delete(key)
      reject(e)
    }
    img.src = src
  })
  pending.set(key, p)
  return p
}

// Returns the tinted data URL, or null while it is being generated.
export function useTint(src, hex) {
  const key = src + '|' + hex
  const [, force] = useState(0)
  useEffect(() => {
    if (cache.has(key)) return
    let live = true
    tint(src, hex).then(() => live && force((n) => n + 1)).catch(() => {})
    return () => { live = false }
  }, [key, src, hex])
  return cache.get(key) || null
}
