// Template definitions: variants, editable fields, defaults and default images.
// Mirrors the TPL array in the design prototype (the behaviour spec).
const P = '/studio/photography/'

export const LOGO_MONO = '/studio/logo/lockup-monogram-script-trimmed.png'
export const LOGO_WORD = '/studio/logo/wordmark-technical-trimmed.png'

export const TPL = [
  {
    id: 'class', name: 'Class', variants: [['a', 'Type-led'], ['b', 'Image-led']],
    fields: [['kicker', 'Kicker'], ['title', 'Title'], ['body', 'Body', 1], ['date', 'Schedule'], ['place', 'Format'], ['price', 'Fee'], ['cta', 'Button']],
    imgs: [P + 'pin-lagos-lounge.jpg'],
    d: { kicker: 'Classes with DA', title: 'SketchUp', body: 'Online class in practical 3D modelling for architecture and interiors.', date: '3× a week · 3 weeks', place: 'Online', price: '₦100,000', cta: 'Register now' },
  },
  {
    id: 'progress', name: 'Progress', variants: [['a', 'Stage track'], ['b', 'Side by side']],
    fields: [['code', 'Code'], ['title', 'Title'], ['stages', 'Stages (comma-separated)'], ['stage', 'Current stage #'], ['pct', 'Percent complete'], ['body', 'Note', 1], ['labelA', 'Left label'], ['labelB', 'Right label']],
    imgs: [P + 'pin-lagos-bedroom.jpg', P + 'pin-lagos-media-wall.jpg'],
    d: { code: '#PIN1R', title: 'Pin, Lagos', stages: 'Brief, Layout, Model, Render', stage: '3', pct: '64', body: 'Modelling complete. Materials and lighting in progress.', labelA: 'Model', labelB: 'Render' },
  },
  {
    id: 'reveal', name: 'Project reveal', variants: [['a', 'Full-bleed'], ['b', 'Framed']],
    fields: [['code', 'Code'], ['title', 'Title'], ['sub', 'Location'], ['program', 'Program'], ['scope', 'Scope'], ['year', 'Year']],
    imgs: [P + 'pin-lagos-kitchen-living.jpg'],
    d: { code: '#PIN1R', title: 'Pin', sub: 'Lagos, NG', program: 'Residential', scope: 'Interior architecture + 3D visualization', year: '2026' },
  },
  {
    id: 'ba', name: 'Before / after', variants: [['a', 'Stacked'], ['b', 'Side by side']],
    fields: [['code', 'Code'], ['title', 'Title'], ['labelA', 'First label'], ['labelB', 'Second label']],
    imgs: [P + 'pin-lagos-bedroom.jpg', P + 'pin-lagos-lounge.jpg'],
    d: { code: '#PIN1R', title: 'Living room', labelA: 'Before', labelB: 'After' },
  },
  {
    id: 'news', name: 'Announcement', variants: [['a', 'Statement'], ['b', 'With image']],
    fields: [['kicker', 'Kicker'], ['title', 'Headline', 1], ['body', 'Body', 1], ['date', 'Date']],
    imgs: [P + 'wellness-salon.jpg'],
    d: { kicker: 'Studio news', title: 'Classes with DA are now open for registration.', body: 'SketchUp online class. Limited slots.', date: 'Oct 2026' },
  },
  {
    id: 'detail', name: 'Render detail', variants: [['a', 'Legend below'], ['b', 'Overlay']],
    fields: [['code', 'Code'], ['title', 'Title'], ['n1', 'Note 1'], ['n2', 'Note 2'], ['n3', 'Note 3']],
    imgs: [P + 'pin-lagos-media-wall.jpg'],
    d: { code: '#PIN1R', title: 'Media wall', n1: 'Concealed linear cove light', n2: 'Fluted timber panelling', n3: 'Olive velvet upholstery' },
  },
  {
    id: 'object', name: 'Object', variants: [['a', 'Centered'], ['b', 'Grounded']],
    fields: [['title', 'Object name'], ['line1', 'Credit line 1'], ['line2', 'Credit line 2'], ['code', 'Code (Grounded)']],
    imgs: [''],
    d: { title: 'DA.01', line1: 'By Design Auitira', line2: 'For a private client, Lagos', code: '#OBJ01F' },
  },
  {
    id: 'carousel', name: 'Carousel', variants: [['s1', '01 Cover'], ['s2', '02 Image'], ['s3', '03 Info'], ['s4', '04 Close']],
    fields: [['code', 'Code'], ['title', 'Title'], ['sub', 'Location'], ['program', 'Program'], ['scope', 'Scope'], ['body', 'Description', 1], ['cta', 'Closing button']],
    imgs: [P + 'pin-lagos-lounge.jpg', P + 'pin-lagos-kitchen-living.jpg'],
    d: { code: '#PIN1R', title: 'Pin', sub: 'Lagos, NG', program: 'Residential', scope: 'Interior architecture + 3D visualization', body: 'Interior architecture and 3D visualization for a residential unit in Lagos. Concealed linear coves carry the lighting; the palette stays with dark timber, olive upholstery and brass.', cta: 'View project' },
  },
]

export const FORMATS = [['Feed', 1350], ['Square', 1080], ['Story', 1920]]

export const DEFAULT_VARIANT = Object.fromEntries(TPL.map((t) => [t.id, t.variants[0][0]]))

export const DEFAULT_NOTES = [{ x: 28, y: 38 }, { x: 64, y: 24 }, { x: 52, y: 70 }]

export const LOGO_SWATCHES = [['auto', 'Auto'], ['#1F1E1C', 'Ink'], ['#F4F2EE', 'Paper'], ['#6B6863', 'Stone'], ['#A8A39B', 'Sand']]

export function findTpl(id) {
  return TPL.find((t) => t.id === id) || TPL[0]
}
