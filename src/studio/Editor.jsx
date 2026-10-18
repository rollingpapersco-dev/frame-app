import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Post from './Post.jsx'
import { C, FONT, POST_W, ground } from './tokens.js'
import { TPL, FORMATS, DEFAULT_VARIANT, DEFAULT_NOTES, LOGO_MONO, LOGO_WORD, LOGO_SWATCHES, findTpl } from './templates.js'
import { useTint } from './lib/tint.js'
import { loadSettings, saveSettings, loadImages, saveImage, deleteImage, reencodeImage } from './lib/storage.js'
import { compositePost, downloadBlob } from './export/composite.js'

const HEX = /^#[0-9a-f]{6}$/i

// Accept only sane values from storage so a stale or edited save can't break the editor.
function initialState() {
  const s = loadSettings()
  const ok = (v, test, d) => (v !== undefined && test(v) ? v : d)
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)
  return {
    tpl: ok(s.tpl, (v) => TPL.some((t) => t.id === v), 'class'),
    variant: { ...DEFAULT_VARIANT, ...ok(s.variant, isObj, {}) },
    h: ok(s.h, (v) => FORMATS.some(([, h]) => h === v), 1350),
    dark: ok(s.dark, (v) => typeof v === 'boolean', false),
    logo: ok(s.logo, (v) => typeof v === 'boolean', true),
    logoColor: ok(s.logoColor, (v) => v === 'auto' || HEX.test(v), 'auto'),
    f: ok(s.f, isObj, {}),
    notes: ok(s.notes, (v) => Array.isArray(v) && v.length === 3 && v.every((n) => n && Number.isFinite(n.x) && Number.isFinite(n.y)), DEFAULT_NOTES),
    adj: ok(s.adj, isObj, {}),
    scale: ok(s.scale, (v) => [1, 2, 3].includes(v), 2),
  }
}

function useNarrow() {
  const q = '(max-width: 899px)'
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setNarrow(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return narrow
}

const pill = (on) => ({ background: on ? C.ink : 'transparent', color: on ? C.paper : C.ink })
const UI_LABEL = { fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.stone }
const BTN = { border: `1px solid ${C.ink}`, padding: '8px 10px', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer' }
const GHOST = { background: 'none', border: `1px solid ${C.rule}`, padding: '7px 10px', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer', color: C.ink }
const INPUT = { border: `1px solid ${C.rule}`, background: C.white, padding: 9, fontSize: 13, color: C.ink, textTransform: 'none', letterSpacing: 0, borderRadius: 0, fontFamily: FONT, width: '100%' }

const EDITOR_CSS = `
.ss-primary:hover{background:${C.inkHover}!important;}
.ss-primary:disabled{cursor:progress;}
.ss button{font-family:${FONT};border-radius:0;}
.ss button:focus-visible,.ss input:focus-visible,.ss textarea:focus-visible{outline:1.5px solid ${C.ink};outline-offset:1px;}
.ss input:focus,.ss textarea:focus{border-color:${C.ink};}
.ss input[type=range]{accent-color:${C.ink};width:100%;margin:2px 0;}
.ss-scroll{scrollbar-width:thin;scrollbar-color:${C.rule} transparent;}
`

function Range({ label, value, display, min, max, step, onChange }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 3, ...UI_LABEL }}>
      <span style={{ display: 'flex', justifyContent: 'space-between' }}><span>{label}</span><span>{display}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))} />
    </label>
  )
}

export default function Editor() {
  const [st, setSt] = useState(initialState)
  const set = useCallback((patch) => setSt((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) })), [])
  const [img, setImg] = useState({})
  const [activeNote, setActiveNote] = useState(0)
  const [zoom, setZoom] = useState(0.5)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(false)
  const narrow = useNarrow()
  const [leftOpen, setLeftOpen] = useState(() => !window.matchMedia('(max-width: 899px)').matches)
  const [rightOpen, setRightOpen] = useState(() => !window.matchMedia('(max-width: 899px)').matches)

  const areaRef = useRef(null)
  const postRef = useRef(null)
  const fileRef = useRef(null)
  const slotRef = useRef(0)

  // Persist settings and text; uploaded images live in IndexedDB.
  useEffect(() => { saveSettings(st) }, [st])
  useEffect(() => { loadImages().then((saved) => setImg((cur) => ({ ...saved, ...cur }))) }, [])

  // In narrow layouts the panels overlay the canvas, so only one is open at a time.
  useEffect(() => { if (narrow && leftOpen && rightOpen) setRightOpen(false) }, [narrow]) // eslint-disable-line react-hooks/exhaustive-deps

  const gutter = narrow ? 16 : 32
  const fit = useCallback(() => {
    const el = areaRef.current
    if (!el) return
    const z = Math.min((el.clientWidth - gutter * 2) / POST_W, (el.clientHeight - gutter * 2) / st.h)
    setZoom(Math.max(0.15, Math.round(z * 1000) / 1000))
  }, [st.h, gutter])
  useLayoutEffect(() => {
    fit()
    const el = areaRef.current
    if (!el) return
    const ro = new ResizeObserver(() => requestAnimationFrame(fit))
    ro.observe(el)
    return () => ro.disconnect()
  }, [fit, leftOpen, rightOpen, narrow])

  const t = findTpl(st.tpl)
  const vk = st.variant[t.id] && t.variants.some(([id]) => id === st.variant[t.id]) ? st.variant[t.id] : t.variants[0][0]
  const vals = { ...t.d, ...(st.f[t.id] || {}) }
  const g = ground(st.dark)

  const getAdj = useCallback((slot) => {
    const a = ((st.adj || {})[st.tpl] || [])[slot] || {}
    return { z: a.z ?? 1, x: a.x ?? 50, y: a.y ?? 50, b: a.b ?? 100, g: !!a.g }
  }, [st.adj, st.tpl])
  const setAdj = (slot, patch) => set((s) => {
    const arr = [...((s.adj || {})[s.tpl] || [])]
    arr[slot] = patch === null ? {} : { ...(arr[slot] || {}), ...patch }
    return { adj: { ...(s.adj || {}), [s.tpl]: arr } }
  })
  const adjVals = (slot) => {
    const a = getAdj(slot)
    const parts = []
    if (a.b !== 100) parts.push(`brightness(${a.b / 100})`)
    if (a.g) parts.push('grayscale(1)')
    return { z: a.z, pos: `${a.x}% ${a.y}%`, filter: parts.length ? parts.join(' ') : 'none' }
  }
  const setField = (key, v) => set((s) => ({ f: { ...s.f, [s.tpl]: { ...(s.f[s.tpl] || {}), [key]: v } } }))

  // Logo colour: Auto = ink on light, paper on dark and on photos.
  const choice = st.logoColor || 'auto'
  const groundHex = choice === 'auto' ? (st.dark ? C.paper : C.ink) : choice
  const photoHex = choice === 'auto' ? C.paper : choice
  const logo = {
    mono: useTint(LOGO_MONO, groundHex),
    monoPhoto: useTint(LOGO_MONO, photoHex),
    word: useTint(LOGO_WORD, groundHex),
  }

  const imgs = t.imgs.map((def, i) => (img[t.id] || [])[i] || def)
  const stagesArr = String(vals.stages || '').split(',').map((x) => x.trim()).filter(Boolean)
  const curStage = Math.max(1, Math.min(stagesArr.length || 1, parseInt(vals.stage, 10) || 1))
  const pct = Math.max(0, Math.min(100, parseInt(vals.pct, 10) || 0))

  // Uppercase titles auto-fit to the longest word; Object names fit the whole line.
  const longest = String(vals.title || '').split(/\s+/).reduce((m, w) => Math.max(m, w.length), 1)
  const fitTitle = (base, width) => Math.max(48, Math.floor(Math.min(base, width / (longest * 0.66))))
  const titleLen = Math.max(1, String(vals.title || '').length)
  const ts = {
    ts220: fitTitle(220, 936), ts150: fitTitle(150, 936), ts200: fitTitle(200, 936),
    ts120: fitTitle(120, 936), ts120r: fitTitle(120, 700),
    tsObj: Math.max(60, Math.floor(Math.min(300, 968 / (titleLen * 0.6)))),
  }

  const placeNote = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = Math.round(Math.max(4, Math.min(96, ((e.clientX - r.left) / r.width) * 100)) * 10) / 10
    const y = Math.round(Math.max(4, Math.min(96, ((e.clientY - r.top) / r.height) * 100)) * 10) / 10
    const i = activeNote
    set((s) => ({ notes: s.notes.map((n, j) => (j === i ? { x, y } : n)) }))
    setActiveNote((i + 1) % 3)
  }

  const onFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file || !file.type.startsWith('image/')) return
    const id = st.tpl
    const slot = slotRef.current
    try {
      const url = await reencodeImage(file, id === 'object')
      setImg((s) => { const arr = [...(s[id] || [])]; arr[slot] = url; return { ...s, [id]: arr } })
      saveImage(id, slot, url)
    } catch (err) {
      console.error('image upload failed', err)
    }
  }
  const resetImage = (slot) => {
    const id = st.tpl
    setImg((s) => { const arr = [...(s[id] || [])]; arr[slot] = null; return { ...s, [id]: arr } })
    deleteImage(id, slot)
  }

  const W = POST_W * st.scale
  const H = st.h * st.scale
  const exportPng = async () => {
    if (!postRef.current || exporting) return
    setExportError(false)
    setExporting(true)
    try {
      // Render the post at scale 1 and let layout settle before measuring.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      await new Promise((r) => setTimeout(r, 60))
      const blob = await compositePost({ node: postRef.current, width: POST_W, height: st.h, scale: st.scale, getAdj })
      downloadBlob(blob, `da-${t.id}-${vk}-${W}x${H}.png`)
    } catch (err) {
      console.error('export failed', err)
      setExportError(true)
    }
    setExporting(false)
  }
  const exportLabel = exporting ? 'Exporting…' : exportError ? 'Export failed — retry' : 'Export PNG'

  const postZoom = exporting ? 1 : zoom
  const boxW = Math.round(POST_W * zoom)
  const boxH = Math.round(st.h * zoom)
  const variantName = (t.variants.find(([id]) => id === vk) || [])[1]

  const panelBase = { flexShrink: 0, overflow: 'auto', background: C.paper, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }
  const overlay = narrow ? { position: 'absolute', top: 0, bottom: 0, zIndex: 20, maxWidth: 'calc(100% - 40px)', boxShadow: '0 0 0 100vmax rgba(31,30,28,0.25)' } : {}

  const toggleLeft = () => { setLeftOpen((o) => !o); if (narrow) setRightOpen(false) }
  const toggleRight = () => { setRightOpen((o) => !o); if (narrow) setLeftOpen(false) }

  const leftPanel = leftOpen && (
    <aside className="ss-scroll" aria-label="Template settings" style={{ ...panelBase, width: 232, borderRight: `1px solid ${C.rule}`, ...overlay, ...(narrow ? { left: 0 } : {}) }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ ...UI_LABEL, marginBottom: 8 }}>Template</div>
        {TPL.map((x, i) => (
          <button key={x.id} onClick={() => set({ tpl: x.id })} aria-pressed={x.id === t.id} style={{ display: 'flex', justifyContent: 'space-between', ...pill(x.id === t.id), border: 'none', padding: 10, fontSize: 13, textAlign: 'left', cursor: 'pointer' }}>
            <span>{x.name}</span><span style={{ opacity: 0.6, fontSize: 11 }}>{String(i + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={UI_LABEL}>{t.id === 'carousel' ? 'Slide' : 'Variation'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {t.variants.map(([id, label]) => (
            <button key={id} onClick={() => set((s) => ({ variant: { ...s.variant, [t.id]: id } }))} aria-pressed={id === vk} style={{ ...BTN, ...pill(id === vk) }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={UI_LABEL}>Format</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {FORMATS.map(([label, h]) => (
            <button key={h} onClick={() => set({ h })} aria-pressed={st.h === h} style={{ ...BTN, ...pill(st.h === h), display: 'flex', justifyContent: 'space-between' }}><span>{label}</span><span>1080×{h}</span></button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={UI_LABEL}>Ground</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['Light', false], ['Dark', true]].map(([label, d]) => (
            <button key={label} onClick={() => set({ dark: d })} aria-pressed={st.dark === d} style={{ ...BTN, ...pill(st.dark === d), flex: 1 }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={UI_LABEL}>Logo</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['On', true], ['Off', false]].map(([label, on]) => (
            <button key={label} onClick={() => set({ logo: on })} aria-pressed={st.logo === on} style={{ ...BTN, ...pill(st.logo === on), flex: 1 }}>{label}</button>
          ))}
        </div>
        <div style={{ ...UI_LABEL, marginTop: 6 }}>Logo colour</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          {LOGO_SWATCHES.map(([val, name]) => (
            <button key={val} onClick={() => set({ logoColor: val })} title={name} aria-label={`Logo colour: ${name}`} aria-pressed={choice === val}
              style={{ width: 30, height: 30, padding: 0, cursor: 'pointer', background: val === 'auto' ? `linear-gradient(135deg,${C.ink} 50%,${C.paper} 50%)` : val, border: `1px solid ${C.rule}`, outline: choice === val ? `1.5px solid ${C.ink}` : 'none', outlineOffset: 2, fontSize: 9, color: val === 'auto' ? C.paper : C.ink }}>
              {val === 'auto' ? 'A' : ''}
            </button>
          ))}
          <input type="color" value={choice === 'auto' ? groundHex : choice} onChange={(e) => set({ logoColor: e.target.value })} title="Custom colour" aria-label="Custom logo colour"
            style={{ width: 30, height: 30, padding: 0, border: `1px solid ${C.rule}`, background: 'none', cursor: 'pointer', outline: !LOGO_SWATCHES.some(([v]) => v === choice) ? `1.5px solid ${C.ink}` : 'none', outlineOffset: 2 }} />
        </div>
      </div>
    </aside>
  )

  const rightPanel = rightOpen && (
    <aside className="ss-scroll" aria-label="Content and export" style={{ ...panelBase, width: 288, borderLeft: `1px solid ${C.rule}`, ...overlay, ...(narrow ? { right: 0 } : {}) }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={UI_LABEL}>Content</div>
        {t.fields.map(([key, label, multi]) => (
          <label key={t.id + key} style={{ display: 'flex', flexDirection: 'column', gap: 5, ...UI_LABEL }}>
            {label}
            {multi
              ? <textarea rows={3} value={vals[key] ?? ''} onChange={(e) => setField(key, e.target.value)} style={{ ...INPUT, resize: 'vertical', outline: 'none' }} />
              : <input value={vals[key] ?? ''} onChange={(e) => setField(key, e.target.value)} style={{ ...INPUT, outline: 'none' }} />}
          </label>
        ))}
        <button onClick={() => set((s) => { const f = { ...s.f }; delete f[s.tpl]; return { f } })} style={{ ...GHOST, padding: '6px 10px', fontSize: 10, alignSelf: 'flex-start' }}>Restore default text</button>
      </div>

      {t.id === 'detail' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={UI_LABEL}>Place marker — click image</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <button key={i} onClick={() => setActiveNote(i)} aria-pressed={activeNote === i} style={{ ...BTN, ...pill(activeNote === i), flex: 1, padding: 8, fontSize: 12 }}>{i + 1}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={UI_LABEL}>Images</div>
        {t.imgs.map((def, i) => {
          const a = getAdj(i)
          const src = imgs[i]
          return (
            <div key={t.id + i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 56, height: 56, flexShrink: 0, background: `${C.rule} center/cover no-repeat`, backgroundImage: src ? `url("${src}")` : 'none' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <span style={{ fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{t.imgs.length > 1 ? `Image ${i + 1}` : 'Image'}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="ss-primary" onClick={() => { slotRef.current = i; fileRef.current && fileRef.current.click() }} style={{ background: C.ink, color: C.paper, border: 'none', padding: '6px 10px', fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer' }}>Replace</button>
                    <button onClick={() => resetImage(i)} style={{ ...GHOST, padding: '6px 10px', fontSize: 10 }}>Reset</button>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0 14px', borderBottom: `1px solid ${C.canvas}` }}>
                <Range label="Zoom" value={Math.round(a.z * 100)} display={Math.round(a.z * 100) + '%'} min={100} max={300} step={5} onChange={(v) => setAdj(i, { z: v / 100 })} />
                <Range label="Horizontal" value={a.x} display={a.x + '%'} min={0} max={100} step={1} onChange={(v) => setAdj(i, { x: v })} />
                <Range label="Vertical" value={a.y} display={a.y + '%'} min={0} max={100} step={1} onChange={(v) => setAdj(i, { y: v })} />
                <Range label="Brightness" value={a.b} display={a.b + '%'} min={50} max={150} step={1} onChange={(v) => setAdj(i, { b: v })} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setAdj(i, { g: false })} aria-pressed={!a.g} style={{ ...BTN, ...pill(!a.g), flex: 1, padding: 7, fontSize: 10 }}>Colour</button>
                  <button onClick={() => setAdj(i, { g: true })} aria-pressed={a.g} style={{ ...BTN, ...pill(a.g), flex: 1, padding: 7, fontSize: 10 }}>B&amp;W</button>
                  <button onClick={() => setAdj(i, null)} style={{ ...GHOST, flex: 1, padding: 7, fontSize: 10 }}>Reset</button>
                </div>
              </div>
            </div>
          )
        })}
        <input type="file" accept="image/*" ref={fileRef} onChange={onFile} style={{ display: 'none' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: `1px solid ${C.rule}`, paddingTop: 20 }}>
        <div style={UI_LABEL}>Export size</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3].map((n) => (
            <button key={n} onClick={() => set({ scale: n })} aria-pressed={st.scale === n} style={{ ...BTN, ...pill(st.scale === n), flex: 1, padding: '8px 4px', textTransform: 'none' }}>{n}×</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.stone }}>{W} × {H} px PNG</div>
        <button className="ss-primary" onClick={exportPng} disabled={exporting} style={{ marginTop: 4, background: C.ink, color: C.paper, border: 'none', padding: 14, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer' }}>{exportLabel}</button>
      </div>
    </aside>
  )

  return (
    <div className="ss" style={{ fontFamily: FONT, color: C.ink, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <style>{EDITOR_CSS}</style>
      <header style={{ height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: narrow ? 8 : 16, padding: narrow ? '0 8px' : '0 16px', background: C.paper, borderBottom: `1px solid ${C.rule}`, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: narrow ? 8 : 16, minWidth: 0 }}>
          <button onClick={toggleLeft} aria-expanded={leftOpen} style={GHOST}>{leftOpen ? '← Panel' : 'Panel →'}</button>
          <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{narrow ? 'DA Studio' : 'DA — Social Studio'}</span>
        </div>
        {!narrow && <span style={{ color: C.stone, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name} · {variantName} · 1080 × {st.h}</span>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button className="ss-primary" onClick={exportPng} disabled={exporting} style={{ background: C.ink, color: C.paper, border: `1px solid ${C.ink}`, padding: narrow ? '8px 10px' : '8px 16px', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>{narrow && !exporting && !exportError ? 'Export' : exportLabel}</button>
          <button onClick={toggleRight} aria-expanded={rightOpen} style={GHOST}>{rightOpen ? 'Panel →' : '← Panel'}</button>
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', position: 'relative' }}>
        {leftPanel}
        <main ref={areaRef} style={{ flex: 1, minWidth: 0, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: gutter, background: C.canvas }}>
          <div style={{ width: boxW, height: boxH, flexShrink: 0, position: 'relative', overflow: 'hidden', boxShadow: `0 1px 0 ${C.rule}` }}>
            <div
              ref={postRef}
              data-post="1"
              style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${postZoom})`, transformOrigin: '0 0', width: POST_W, height: st.h, overflow: 'hidden', background: g.bg, color: g.fg, fontFamily: FONT, fontWeight: 400 }}
            >
              <Post
                k={`${t.id}:${vk}`} t={vals} g={g} logo={logo} showLogo={st.logo}
                i1={imgs[0]} i2={imgs[1] || imgs[0]} a1={adjVals(0)} a2={adjVals(t.imgs.length > 1 ? 1 : 0)}
                ts={ts} pct={pct} objBlend={st.dark ? 'normal' : 'multiply'}
                stages={{
                  list: stagesArr.map((label, i) => ({ n: String(i + 1).padStart(2, '0'), label, on: i < curStage })),
                  no: String(curStage).padStart(2, '0'), total: String(stagesArr.length).padStart(2, '0'), name: stagesArr[curStage - 1] || '',
                }}
                marks={st.notes.map((n, i) => ({ n: i + 1, x: n.x + '%', y: n.y + '%', text: vals['n' + (i + 1)] }))}
                placeNote={placeNote}
              />
            </div>
            {exporting && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: C.stone }}>Exporting…</div>
            )}
          </div>
        </main>
        {rightPanel}
      </div>
    </div>
  )
}
