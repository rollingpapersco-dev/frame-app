// Design tokens for Design Auitira — Social Studio.
// No accent colour by design: hierarchy comes from scale, case and hairlines.
export const C = {
  paper: '#F4F2EE',
  paperAlt: '#EAE7E1',
  canvas: '#E3DFD8',
  ink: '#1F1E1C',
  inkHover: '#3A3835',
  charcoal: '#2B2A28',
  stone: '#6B6863',
  sand: '#A8A39B',
  rule: '#CFCBC4',
  ruleDark: '#55524D',
  ruleAlt: '#C4BFB6',
  white: '#FFFFFF',
}

export const FONT = "'Instrument Sans', sans-serif"

// Light / dark post grounds.
export function ground(dark) {
  return dark
    ? { bg: C.charcoal, fg: C.paper, mu: C.sand, ru: C.ruleDark }
    : { bg: C.paper, fg: C.ink, mu: C.stone, ru: C.rule }
}

export const POST_W = 1080
