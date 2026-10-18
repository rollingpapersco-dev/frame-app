import { toPng } from 'html-to-image'

// Composite PNG export.
// DOM-to-image alone dropped photos, blend modes and filters in this design, so:
//   1. measure every <img> relative to the post (photos: their frame, not the scaled img)
//   2. capture only the text/vector layer with html-to-image
//   3. on a canvas: ground → photos (cover/contain + focal point + zoom + tone) → text → logos
// The caller renders the post at scale 1 before calling this.

const NO_ADJ = { z: 1, x: 50, y: 50, b: 100, g: false }

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function toneAdjust(src, nw, nh, a) {
  const off = document.createElement('canvas')
  off.width = nw
  off.height = nh
  const o = off.getContext('2d')
  o.drawImage(src, 0, 0)
  const d = o.getImageData(0, 0, nw, nh)
  const px = d.data
  const m = a.b / 100
  for (let i = 0; i < px.length; i += 4) {
    let r = px[i] * m
    let g = px[i + 1] * m
    let b = px[i + 2] * m
    if (a.g) {
      const y = 0.2126 * r + 0.7152 * g + 0.0722 * b
      r = g = b = y
    }
    px[i] = r > 255 ? 255 : r
    px[i + 1] = g > 255 ? 255 : g
    px[i + 2] = b > 255 ? 255 : b
  }
  o.putImageData(d, 0, 0)
  return off
}

export async function compositePost({ node, width: W, height: H, scale: S, getAdj }) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready
  const nb = node.getBoundingClientRect()
  const k = nb.width / W
  const ground = getComputedStyle(node).backgroundColor

  const layers = [...node.querySelectorAll('img')].map((img) => {
    const isPhoto = img.hasAttribute('data-slot')
    const r = (isPhoto ? img.parentElement : img).getBoundingClientRect()
    return {
      img,
      x: (r.left - nb.left) / k,
      y: (r.top - nb.top) / k,
      w: r.width / k,
      h: r.height / k,
      blend: getComputedStyle(img).mixBlendMode,
      onTop: img.hasAttribute('data-logo'),
      adj: isPhoto ? getAdj(parseInt(img.getAttribute('data-slot'), 10)) : null,
      contain: img.getAttribute('data-fit') === 'contain',
    }
  })

  await Promise.all(layers.map((l) => (l.img.decode ? l.img.decode().catch(() => {}) : null)))

  // Text/vector layer only: hide images and clear the grounds behind them.
  const parents = layers.map((l) => l.img.parentElement)
  const prevP = parents.map((p) => p.style.background)
  const prevV = layers.map((l) => l.img.style.visibility)
  const prevBg = node.style.background
  let textUrl
  try {
    layers.forEach((l) => { l.img.style.visibility = 'hidden' })
    parents.forEach((p) => { if (p !== node) p.style.background = 'transparent' })
    node.style.background = 'transparent'
    textUrl = await toPng(node, {
      width: W,
      height: H,
      pixelRatio: S,
      style: { transform: 'none', left: '0', top: '0' },
    })
  } finally {
    node.style.background = prevBg
    parents.forEach((p, i) => { if (p !== node) p.style.background = prevP[i] })
    layers.forEach((l, i) => { l.img.style.visibility = prevV[i] })
  }
  const textImg = await loadImage(textUrl)

  const canvas = document.createElement('canvas')
  canvas.width = W * S
  canvas.height = H * S
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.scale(S, S)
  ctx.fillStyle = ground
  ctx.fillRect(0, 0, W, H)

  const draw = (l) => {
    const nw = l.img.naturalWidth
    const nh = l.img.naturalHeight
    if (!nw || !nh || !l.w || !l.h) return
    const a = l.adj || NO_ADJ
    const src = l.adj && (a.b !== 100 || a.g) ? toneAdjust(l.img, nw, nh, a) : l.img
    // object-fit + object-position, then transform: scale(z) about the focal point.
    const s = (l.contain ? Math.min : Math.max)(l.w / nw, l.h / nh)
    const cw = nw * s
    const ch = nh * s
    const px0 = a.x / 100
    const py0 = a.y / 100
    const ox = l.w * px0
    const oy = l.h * py0
    const dx0 = (l.w - cw) * px0
    const dy0 = (l.h - ch) * py0
    const dx = ox + (dx0 - ox) * a.z
    const dy = oy + (dy0 - oy) * a.z
    ctx.save()
    ctx.beginPath()
    ctx.rect(l.x, l.y, l.w, l.h)
    ctx.clip()
    ctx.globalCompositeOperation = l.blend === 'multiply' ? 'multiply' : l.blend === 'screen' ? 'screen' : 'source-over'
    ctx.drawImage(src, l.x + dx, l.y + dy, cw * a.z, ch * a.z)
    ctx.restore()
  }

  layers.filter((l) => !l.onTop).forEach(draw)
  ctx.drawImage(textImg, 0, 0, W, H)
  layers.filter((l) => l.onTop).forEach(draw)

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
  })
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}
