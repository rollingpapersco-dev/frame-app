import React from 'react'
import { C } from './tokens.js'
import { LOGO_MONO, LOGO_WORD } from './templates.js'

// One component per template; the variant picks the composition.
// Every size here is in post pixels (posts are 1080px wide).

const LBL22 = { fontSize: 22, letterSpacing: '0.04em', textTransform: 'uppercase' }
const LBL20 = { fontSize: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }
const LBL18 = { fontSize: 18, letterSpacing: '0.04em', textTransform: 'uppercase' }
const HEAD = { display: 'flex', justifyContent: 'space-between', gap: 24, ...LBL22 }
const FILL = { position: 'absolute', inset: 0 }
const COL = { ...FILL, display: 'flex', flexDirection: 'column' }
const PAD = { ...COL, padding: 72 }
const SPACER = <div style={{ flex: 1 }} />
const DISPLAY = { overflowWrap: 'anywhere', letterSpacing: '-0.05em', textTransform: 'uppercase' }
const GRADIENT = 'linear-gradient(to bottom, rgba(20,19,18,0.45) 0%, rgba(20,19,18,0) 22%, rgba(20,19,18,0) 52%, rgba(20,19,18,0.78) 100%)'

// Photo frame: the frame keeps layout, the img inside carries crop/zoom/tone.
// Export measures the frame (parent), not the scaled img.
function Frame({ slot, src, a, style, contain, blend, onClick, children, fill = C.rule }) {
  return (
    <div onClick={onClick} style={{ position: 'relative', background: fill, overflow: 'hidden', ...style }}>
      {src ? (
        <img
          data-slot={slot}
          data-fit={contain ? 'contain' : undefined}
          src={src}
          alt=""
          draggable={false}
          style={{
            ...FILL, width: '100%', height: '100%', display: 'block',
            objectFit: contain ? 'contain' : 'cover',
            objectPosition: a.pos, transform: `scale(${a.z})`, transformOrigin: a.pos,
            filter: a.filter, mixBlendMode: blend || 'normal',
          }}
        />
      ) : null}
      {children}
    </div>
  )
}

// Tinted logo. Until the tint is ready the raw PNG holds the layout, hidden.
function Logo({ src, raw = LOGO_MONO, style }) {
  return (
    <img
      data-logo="1"
      src={src || raw}
      alt="Design Auitira"
      draggable={false}
      style={{ display: 'block', position: 'relative', zIndex: 3, visibility: src ? 'visible' : 'hidden', ...style }}
    />
  )
}

function Rows({ rows, ru, mu, pad = 20, style = LBL22 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {rows.map(([k, v], i) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, borderTop: `1px solid ${ru}`, borderBottom: i === rows.length - 1 ? `1px solid ${ru}` : undefined, padding: `${pad}px 0`, ...style }}>
          <span style={{ color: mu, flexShrink: 0 }}>{k}</span>
          <span style={{ textAlign: 'right' }}>{v}</span>
        </div>
      ))}
    </div>
  )
}

function Marker({ m }) {
  return (
    <div style={{ position: 'absolute', left: m.x, top: m.y, width: 60, height: 60, margin: '-30px 0 0 -30px', borderRadius: '50%', background: C.paper, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, zIndex: 2 }}>{m.n}</div>
  )
}

function Handle({ mu }) {
  return <span style={{ marginLeft: 'auto', color: mu }}>@design_auitira</span>
}

function EmptyObject({ ru, mu, inset }) {
  return (
    <div style={{ position: 'absolute', inset, border: `1px dashed ${ru}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, letterSpacing: '0.06em', textTransform: 'uppercase', color: mu, textAlign: 'center', padding: 16 }}>
      Product cut-out — Replace image
    </div>
  )
}

export default function Post(p) {
  const { k, t, g, logo, showLogo, i1, i2, a1, a2, ts, stages, pct, marks, placeNote, objBlend } = p
  const { bg, fg, mu, ru } = g
  const L = (style, which = 'mono') => (showLogo ? <Logo src={logo[which]} style={style} /> : null)

  switch (k) {
    case 'class:a':
      return (
        <div style={PAD}>
          <div style={HEAD}><span>{t.kicker}</span><span style={{ color: mu }}>Registration open</span></div>
          {SPACER}
          <div style={{ fontSize: ts.ts220, lineHeight: 0.86, ...DISPLAY }}>{t.title}</div>
          <div style={{ marginTop: 36, fontSize: 32, lineHeight: 1.35, maxWidth: 760, textWrap: 'pretty' }}>{t.body}</div>
          <div style={{ marginTop: 56 }}>
            <Rows ru={ru} mu={mu} rows={[['Schedule', t.date], ['Format', t.place], ['Fee', t.price]]} />
          </div>
          <div style={{ marginTop: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
            {L({ height: 64 })}
            <div style={{ border: `2px solid ${fg}`, padding: '22px 44px', marginLeft: 'auto', ...LBL22 }}>{t.cta}</div>
          </div>
        </div>
      )

    case 'class:b':
      return (
        <div style={COL}>
          <Frame slot={0} src={i1} a={a1} style={{ flex: 1, minHeight: 0 }} />
          {L({ position: 'absolute', top: 56, left: 72, height: 60 }, 'monoPhoto')}
          <div style={{ padding: '56px 72px 72px', display: 'flex', flexDirection: 'column' }}>
            <div style={HEAD}><span>{t.kicker}</span><span style={{ color: mu }}>{t.price}</span></div>
            <div style={{ marginTop: 24, fontSize: ts.ts150, lineHeight: 0.88, ...DISPLAY }}>{t.title}</div>
            <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.35, maxWidth: 760, textWrap: 'pretty' }}>{t.body}</div>
            <div style={{ marginTop: 36, display: 'flex', gap: 24 }}>
              {[['Schedule', t.date], ['Format', t.place]].map(([lab, val]) => (
                <div key={lab} style={{ flex: 1, borderTop: `1px solid ${ru}`, paddingTop: 14, ...LBL20 }}>
                  <div style={{ color: mu }}>{lab}</div><div style={{ marginTop: 6 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 36, background: fg, color: bg, padding: 28, textAlign: 'center', ...LBL22 }}>{t.cta}</div>
          </div>
        </div>
      )

    case 'progress:a':
      return (
        <div style={PAD}>
          <div style={HEAD}><span>Work in progress</span><span style={{ color: mu }}>{t.code}</span></div>
          <div style={{ marginTop: 28, fontSize: 96, lineHeight: 0.95, letterSpacing: '-0.04em' }}>{t.title}</div>
          <Frame slot={0} src={i1} a={a1} style={{ flex: 1, minHeight: 0, marginTop: 44 }} />
          <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
            {stages.list.map((s) => (
              <div key={s.n} style={{ flex: 1, minWidth: 0 }}>
                <div style={{ height: 6, background: s.on ? fg : ru }} />
                <div style={{ marginTop: 16, ...LBL18, color: s.on ? fg : mu }}>{s.n}</div>
                <div style={{ marginTop: 4, fontSize: 26, color: s.on ? fg : mu, overflowWrap: 'anywhere' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
            <div style={{ fontSize: 26, lineHeight: 1.35, maxWidth: 600, color: mu, textWrap: 'pretty' }}>{t.body}</div>
            <div style={{ fontSize: 120, lineHeight: 0.8, letterSpacing: '-0.05em', flexShrink: 0 }}>{pct}%</div>
          </div>
        </div>
      )

    case 'progress:b':
      return (
        <div style={PAD}>
          <div style={HEAD}><span>Work in progress</span><span style={{ color: mu }}>{t.code}</span></div>
          <div style={{ marginTop: 28, fontSize: 96, lineHeight: 0.95, letterSpacing: '-0.04em' }}>{t.title}</div>
          <div style={{ flex: 1, minHeight: 0, marginTop: 44, display: 'flex', gap: 10 }}>
            {[[0, i1, a1, t.labelA], [1, i2, a2, t.labelB]].map(([slot, src, a, lab]) => (
              <Frame key={slot} slot={slot} src={src} a={a} style={{ flex: 1, minWidth: 0 }}>
                <div style={{ position: 'absolute', left: 20, bottom: 20, background: bg, color: fg, padding: '10px 16px', ...LBL18 }}>{lab}</div>
              </Frame>
            ))}
          </div>
          <div style={{ marginTop: 48, position: 'relative', height: 2, background: ru }}>
            <div style={{ position: 'absolute', left: 0, top: -2, height: 6, width: pct + '%', background: fg }} />
          </div>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
            <div style={{ ...LBL22, lineHeight: 1.5 }}><span style={{ color: mu }}>Stage {stages.no} / {stages.total}</span><br />{stages.name}</div>
            <div style={{ fontSize: 120, lineHeight: 0.8, letterSpacing: '-0.05em', flexShrink: 0 }}>{pct}%</div>
          </div>
        </div>
      )

    case 'reveal:a':
    case 'carousel:s1':
      return (
        <>
          <Frame slot={0} src={i1} a={a1} fill={C.charcoal} style={FILL} />
          <div style={{ ...FILL, background: GRADIENT }} />
          <div style={{ ...PAD, color: C.paper }}>
            {k === 'reveal:a'
              ? <div style={HEAD}><span>New project</span><span>{t.code}</span></div>
              : <div style={HEAD}><span>{t.code}</span><span>01 / 04</span></div>}
            {SPACER}
            <div style={{ fontSize: ts.ts200, lineHeight: 0.86, ...DISPLAY }}>{t.title}</div>
            {k === 'reveal:a' ? (
              <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
                <div style={{ ...LBL22, lineHeight: 1.6 }}>{t.sub}<br />{t.program} · {t.year}</div>
                {L({ height: 64 }, 'monoPhoto')}
              </div>
            ) : (
              <div style={{ marginTop: 36, ...HEAD }}><span>{t.sub}</span><span style={{ flexShrink: 0 }}>Swipe →</span></div>
            )}
          </div>
        </>
      )

    case 'reveal:b':
      return (
        <div style={PAD}>
          <div style={HEAD}><span>New project</span><span style={{ color: mu }}>{t.code}</span></div>
          <Frame slot={0} src={i1} a={a1} style={{ flex: 1, minHeight: 0, marginTop: 40 }} />
          <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
            <div style={{ fontSize: ts.ts120r, lineHeight: 0.86, minWidth: 0, ...DISPLAY }}>{t.title}</div>
            {L({ height: 56, flexShrink: 0 })}
          </div>
          <div style={{ marginTop: 32 }}>
            <Rows ru={ru} mu={mu} pad={16} style={LBL20} rows={[['Location', t.sub], ['Program', t.program], ['Scope', t.scope]]} />
          </div>
        </div>
      )

    case 'ba:a':
      return (
        <div style={COL}>
          <div style={{ padding: '72px 72px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
            <div style={{ fontSize: 80, lineHeight: 0.95, letterSpacing: '-0.04em' }}>{t.title}</div>
            <div style={{ ...LBL22, color: mu, flexShrink: 0 }}>{t.code}</div>
          </div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[[0, i1, a1, t.labelA], [1, i2, a2, t.labelB]].map(([slot, src, a, lab]) => (
              <Frame key={slot} slot={slot} src={src} a={a} style={{ flex: 1, minHeight: 0 }}>
                <div style={{ position: 'absolute', left: 72, top: 28, background: bg, color: fg, padding: '10px 16px', ...LBL18 }}>{lab}</div>
              </Frame>
            ))}
          </div>
          <div style={{ padding: '32px 72px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, ...LBL20 }}>
            {L({ height: 48 })}
            <Handle mu={mu} />
          </div>
        </div>
      )

    case 'ba:b':
      return (
        <div style={PAD}>
          <div style={HEAD}><span>{t.labelA} / {t.labelB}</span><span style={{ color: mu }}>{t.code}</span></div>
          <div style={{ marginTop: 28, fontSize: 80, lineHeight: 0.95, letterSpacing: '-0.04em' }}>{t.title}</div>
          <div style={{ flex: 1, minHeight: 0, marginTop: 44, display: 'flex', gap: 8 }}>
            {[[0, i1, a1, t.labelA, mu], [1, i2, a2, t.labelB, fg]].map(([slot, src, a, lab, col]) => (
              <div key={slot} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Frame slot={slot} src={src} a={a} style={{ flex: 1, minHeight: 0 }} />
                <div style={{ ...LBL20, color: col }}>{lab}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, ...LBL20 }}>
            {L({ height: 48 })}
            <Handle mu={mu} />
          </div>
        </div>
      )

    case 'news:a':
      return (
        <div style={PAD}>
          <div style={HEAD}><span>{t.kicker}</span><span style={{ color: mu }}>{t.date}</span></div>
          {SPACER}
          <div style={{ fontSize: 104, lineHeight: 1, letterSpacing: '-0.04em', textWrap: 'balance', overflowWrap: 'anywhere' }}>{t.title}</div>
          <div style={{ marginTop: 40, fontSize: 30, lineHeight: 1.4, maxWidth: 720, color: mu, textWrap: 'pretty' }}>{t.body}</div>
          <div style={{ marginTop: 72, borderTop: `1px solid ${ru}`, paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, ...LBL20 }}>
            {L({ height: 56 })}
            <Handle mu={mu} />
          </div>
        </div>
      )

    case 'news:b':
      return (
        <div style={COL}>
          <Frame slot={0} src={i1} a={a1} style={{ flex: 1.15, minHeight: 0 }} />
          <div style={{ flex: 1, minHeight: 0, padding: '56px 72px 72px', display: 'flex', flexDirection: 'column' }}>
            <div style={HEAD}><span>{t.kicker}</span><span style={{ color: mu }}>{t.date}</span></div>
            <div style={{ marginTop: 28, fontSize: 72, lineHeight: 1.02, letterSpacing: '-0.035em', textWrap: 'balance', overflowWrap: 'anywhere' }}>{t.title}</div>
            <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.4, maxWidth: 720, color: mu, textWrap: 'pretty' }}>{t.body}</div>
            {SPACER}
            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, ...LBL20 }}>
              {L({ height: 48 })}
              <Handle mu={mu} />
            </div>
          </div>
        </div>
      )

    case 'detail:a':
      return (
        <div style={PAD}>
          <div style={HEAD}><span>Detail</span><span style={{ color: mu }}>{t.code}</span></div>
          <div style={{ marginTop: 28, fontSize: 88, lineHeight: 0.95, letterSpacing: '-0.04em' }}>{t.title}</div>
          <Frame slot={0} src={i1} a={a1} onClick={placeNote} style={{ flex: 1, minHeight: 0, marginTop: 44, cursor: 'crosshair' }}>
            {marks.map((m) => <Marker key={m.n} m={m} />)}
          </Frame>
          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column' }}>
            {marks.map((m) => (
              <div key={m.n} style={{ display: 'flex', gap: 28, alignItems: 'baseline', borderTop: `1px solid ${ru}`, padding: '16px 0' }}>
                <span style={{ fontSize: 20, letterSpacing: '0.04em', color: mu, minWidth: 36 }}>0{m.n}</span>
                <span style={{ fontSize: 28 }}>{m.text}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'detail:b':
      return (
        <>
          <Frame slot={0} src={i1} a={a1} fill={C.charcoal} onClick={placeNote} style={{ ...FILL, cursor: 'crosshair' }}>
            {marks.map((m) => <Marker key={m.n} m={m} />)}
          </Frame>
          <div style={{ position: 'absolute', top: 72, left: 72, right: 72, ...HEAD, color: C.paper, pointerEvents: 'none' }}><span>Detail</span><span>{t.code}</span></div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: bg, padding: '44px 72px 56px' }}>
            <div style={{ fontSize: 56, lineHeight: 1, letterSpacing: '-0.035em' }}>{t.title}</div>
            <div style={{ marginTop: 28, display: 'flex', gap: 24 }}>
              {marks.map((m) => (
                <div key={m.n} style={{ flex: 1, minWidth: 0, borderTop: `1px solid ${ru}`, paddingTop: 14 }}>
                  <div style={{ fontSize: 18, letterSpacing: '0.04em', color: mu }}>0{m.n}</div>
                  <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.3 }}>{m.text}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )

    case 'object:a':
      return (
        <div style={{ ...COL, alignItems: 'center', padding: '64px 56px 72px' }}>
          <div style={{ width: '100%', textAlign: 'center', fontSize: ts.tsObj, lineHeight: 0.9, letterSpacing: '-0.035em', whiteSpace: 'nowrap' }}>{t.title}</div>
          <div style={{ marginTop: 72, textAlign: 'center', fontSize: 17, lineHeight: 1.6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t.line1}<br />{t.line2}</div>
          <div style={{ position: 'relative', flex: 1, minHeight: 0, width: '78%', marginTop: 40 }}>
            {i1
              ? <Frame slot={0} src={i1} a={a1} contain blend={objBlend} fill="transparent" style={FILL} />
              : <EmptyObject ru={ru} mu={mu} inset="12% 6%" />}
          </div>
          {L({ height: 60, marginTop: 40 })}
        </div>
      )

    case 'object:b':
      return (
        <div style={PAD}>
          <div style={HEAD}><span>Made by DA</span><span style={{ color: mu }}>{t.code}</span></div>
          <div style={{ position: 'relative', flex: 1, minHeight: 0, margin: '40px 4%' }}>
            {i1
              ? <Frame slot={0} src={i1} a={a1} contain blend={objBlend} fill="transparent" style={FILL} />
              : <EmptyObject ru={ru} mu={mu} inset="10% 4%" />}
          </div>
          <div style={{ fontSize: ts.tsObj, lineHeight: 0.88, letterSpacing: '-0.035em', whiteSpace: 'nowrap', marginLeft: '-0.04em' }}>{t.title}</div>
          <div style={{ marginTop: 32, borderTop: `1px solid ${ru}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
            <div style={{ fontSize: 18, lineHeight: 1.6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t.line1}<br /><span style={{ color: mu }}>{t.line2}</span></div>
            {L({ height: 52 })}
          </div>
        </div>
      )

    case 'carousel:s2':
      return (
        <div style={COL}>
          <Frame slot={1} src={i2} a={a2} style={{ flex: 1, minHeight: 0 }} />
          <div style={{ padding: '36px 72px', ...HEAD }}><span>{t.code} — {t.sub}</span><span style={{ color: mu, flexShrink: 0 }}>02 / 04</span></div>
        </div>
      )

    case 'carousel:s3':
      return (
        <div style={PAD}>
          <div style={HEAD}><span>Project information</span><span style={{ color: mu }}>03 / 04</span></div>
          {SPACER}
          <div style={{ fontSize: ts.ts120, lineHeight: 0.88, ...DISPLAY }}>{t.title}</div>
          <div style={{ marginTop: 44 }}>
            <Rows ru={ru} mu={mu} pad={18} rows={[['Code', t.code], ['Location', t.sub], ['Program', t.program], ['Scope', t.scope]]} />
          </div>
          <div style={{ marginTop: 40, fontSize: 28, lineHeight: 1.45, maxWidth: 800, textWrap: 'pretty' }}>{t.body}</div>
        </div>
      )

    case 'carousel:s4':
      return (
        <div style={PAD}>
          <div style={HEAD}><span>{t.code}</span><span style={{ color: mu }}>04 / 04</span></div>
          {SPACER}
          <Logo src={logo.word} raw={LOGO_WORD} style={{ width: '100%', height: 'auto' }} />
          {SPACER}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, ...LBL22 }}>
            <div style={{ border: `2px solid ${fg}`, padding: '22px 40px' }}>{t.cta}</div>
            <span style={{ color: mu }}>@design_auitira</span>
          </div>
        </div>
      )

    default:
      return null
  }
}
