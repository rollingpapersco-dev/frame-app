// Settings and text go to localStorage; uploaded images go to IndexedDB
// because they are too large for the localStorage quota.
const KEY = 'da-social-studio'
const PERSISTED = ['tpl', 'variant', 'h', 'dark', 'logo', 'logoColor', 'f', 'notes', 'adj', 'scale']

export function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!saved || typeof saved !== 'object') return {}
    const out = {}
    PERSISTED.forEach((k) => { if (saved[k] !== undefined) out[k] = saved[k] })
    return out
  } catch {
    return {}
  }
}

export function saveSettings(state) {
  try {
    const out = {}
    PERSISTED.forEach((k) => { out[k] = state[k] })
    localStorage.setItem(KEY, JSON.stringify(out))
  } catch {
    /* storage full or blocked: keep working without persistence */
  }
}

const DB = 'da-social-studio'
const STORE = 'images'

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no indexedDB'))
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx(mode, fn) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode)
    const result = fn(t.objectStore(STORE))
    t.oncomplete = () => { db.close(); resolve(result && result.result) }
    t.onerror = () => { db.close(); reject(t.error) }
  }))
}

// Image keys are `${tplId}:${slot}`; values are JPEG data URLs.
export function saveImage(tplId, slot, dataUrl) {
  return tx('readwrite', (s) => s.put(dataUrl, `${tplId}:${slot}`)).catch(() => {})
}

export function deleteImage(tplId, slot) {
  return tx('readwrite', (s) => s.delete(`${tplId}:${slot}`)).catch(() => {})
}

// Resolves to { tplId: [url, url] }.
export function loadImages() {
  return openDb().then((db) => new Promise((resolve) => {
    const out = {}
    const t = db.transaction(STORE, 'readonly')
    const req = t.objectStore(STORE).openCursor()
    req.onsuccess = () => {
      const cur = req.result
      if (!cur) return
      const [id, slot] = String(cur.key).split(':')
      const arr = out[id] || (out[id] = [])
      arr[Number(slot)] = cur.value
      cur.continue()
    }
    t.oncomplete = () => { db.close(); resolve(out) }
    t.onerror = () => { db.close(); resolve(out) }
  })).catch(() => ({}))
}

// Re-encode uploads to JPEG, max 2400px on the long side, quality 0.9.
// Very large data URLs failed to rasterize during export in the prototype.
// With keepAlpha (Object cut-outs), PNG/WebP/GIF uploads stay PNG at max 1600px
// so the transparent background survives on dark grounds.
export function reencodeImage(file, keepAlpha = false) {
  const alpha = keepAlpha && /png|webp|gif/.test(file.type)
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onerror = () => reject(fr.error)
    fr.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const sc = Math.min(1, (alpha ? 1600 : 2400) / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = Math.round(img.width * sc)
        c.height = Math.round(img.height * sc)
        const o = c.getContext('2d')
        if (alpha) {
          o.drawImage(img, 0, 0, c.width, c.height)
          return resolve(c.toDataURL('image/png'))
        }
        // JPEG has no alpha: flatten onto white so transparent areas don't turn black.
        o.fillStyle = '#FFFFFF'
        o.fillRect(0, 0, c.width, c.height)
        o.drawImage(img, 0, 0, c.width, c.height)
        resolve(c.toDataURL('image/jpeg', 0.9))
      }
      img.src = fr.result
    }
    fr.readAsDataURL(file)
  })
}
