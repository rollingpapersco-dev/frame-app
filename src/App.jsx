import { useState } from "react";

// ── DESIGN TOKENS — Apple feel ─────────────────────────────
const C = {
  bg: "#FFFFFF",
  surface: "#F5F5F7",
  surfaceAlt: "#E8E8ED",
  border: "#D2D2D7",
  borderStrong: "#000000",
  text: "#1D1D1F",
  muted: "#6E6E73",
  dim: "#AEAEB2",
  accent: "#0071E3",
  accentLight: "#E8F0FB",
  black: "#000000",
  white: "#FFFFFF",
};

const T = {
  body: "-apple-system, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
  display: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
};

// ── KNOWLEDGE BASE ─────────────────────────────────────────
const LIGHTING_SETUPS = [
  { name: "Rembrandt", mood: "Intimate, dramatic", genre: ["Fashion", "Film", "Music"], description: "45° key light above eye level creates a triangle of light on the shadow cheek. Shadow side stays dark. Builds psychological weight and character depth.", uses: "Portraits, character studies, moody editorials", ratio: "3:1" },
  { name: "Split", mood: "Tense, mysterious", genre: ["Music", "Film", "Fashion"], description: "Key light at 90° to subject splits the face into equal light and shadow halves. Stark and confrontational — forces the viewer to pick a side.", uses: "Dark editorial, music videos, villain character work", ratio: "1:1" },
  { name: "Butterfly / Paramount", mood: "Glamorous, classic", genre: ["Fashion", "Film"], description: "Key light directly in front and above, casting a butterfly shadow under the nose. Flattering for cheekbones. Classic Old Hollywood portrait light.", uses: "Beauty, fashion, classic portraiture", ratio: "2:1" },
  { name: "Loop", mood: "Natural, versatile", genre: ["Fashion", "Commercial", "Music"], description: "Key light slightly above and 30–45° to side. Small loop shadow from nose. Most natural-looking studio setup — works across almost any subject.", uses: "Commercial, lifestyle, versatile editorial", ratio: "2:1 to 3:1" },
  { name: "Broad", mood: "Open, approachable", genre: ["Commercial", "Fashion"], description: "Lit side of the face turned toward camera. Wider lit area, feels friendly and open. Less dramatic but extremely flattering.", uses: "Commercial, corporate, approachable portraits", ratio: "2:1" },
  { name: "Short", mood: "Slim, dramatic", genre: ["Fashion", "Film", "Music"], description: "Shadow side of face toward camera. Narrowing effect, more dramatic. Pairs beautifully with strong bone structure — elegant and editorial.", uses: "Fashion editorial, fine art, dramatic narrative", ratio: "3:1" },
  { name: "Flat / Beauty", mood: "Clean, high-key", genre: ["Fashion", "Commercial"], description: "Light directly in front, very even illumination. Minimal shadow. Used where clarity and skin quality matter more than drama.", uses: "Beauty campaigns, product, clean lifestyle", ratio: "1:1" },
  { name: "Practical Only", mood: "Raw, immersive", genre: ["Film", "Music", "Documentary"], description: "Only light sources visible in the scene — lamps, windows, candles, neon. Feels lived-in and authentic. Requires fast lenses and high ISO.", uses: "Documentary, music videos, cinematic narrative", ratio: "Variable" },
  { name: "Golden Hour Window", mood: "Warm, nostalgic", genre: ["Fashion", "Film", "Music"], description: "Soft directional natural light from a window during golden hour. Warm tones, long shadows, gentle fall-off. One of the most emotive natural setups.", uses: "Fashion, music, intimate narrative", ratio: "4:1 natural" },
  { name: "Hard Top / Overhead", mood: "Harsh, stylized", genre: ["Fashion", "Music", "Film"], description: "Single hard light directly above subject. Deep eye socket shadows, dramatic jaw lines. Confrontational and highly stylized.", uses: "Dark fashion, stylized music, noir editorial", ratio: "5:1+" },
];

const LENS_DATA = [
  { fl: "14–20mm", type: "Ultra Wide", emotion: "Vastness, isolation, environment dominance", compression: "Extreme distortion", dof: "Infinite", bestFor: ["Landscape", "Architecture", "Environmental portraits"], ref: "Emmanuel Lubezki — The Revenant", notes: "Subject close to lens creates dramatic distortion. The environment becomes the story, not the subject." },
  { fl: "24mm", type: "Wide", emotion: "Intimate but environmental, reportage energy", compression: "Slight", dof: "Deep", bestFor: ["Documentary", "Street", "Environmental fashion"], ref: "Roger Deakins — No Country for Old Men", notes: "The photojournalist's lens. Keeps context without distorting. Honest and immediate." },
  { fl: "35mm", type: "Wide-Normal", emotion: "Natural human perspective, cinematic", compression: "Near-natural", dof: "Medium-deep", bestFor: ["Film", "Street", "Fashion", "Music"], ref: "Gordon Willis, Vilmos Zsigmond", notes: "Closest to human peripheral vision. The storyteller's lens. Slightly heroic feel without distortion." },
  { fl: "50mm", type: "Normal", emotion: "Truth, documentary honesty", compression: "Natural", dof: "Medium", bestFor: ["Documentary", "Portrait", "Commercial"], ref: "Stanley Kubrick — Eyes Wide Shut", notes: "What your eye sees. No deception. Forces compositional honesty from the photographer." },
  { fl: "85mm", type: "Short Tele", emotion: "Intimacy without intrusion, beauty", compression: "Flattering", dof: "Shallow-medium", bestFor: ["Fashion", "Portrait", "Beauty", "Music"], ref: "Standard portrait cinematography", notes: "The portrait lens. Flatters faces. Shallow DOF separates subjects beautifully from environment." },
  { fl: "135mm", type: "Tele", emotion: "Compressed intimacy, voyeuristic", compression: "Strong", dof: "Shallow", bestFor: ["Fashion", "Film", "Music"], ref: "Various editorial cinematographers", notes: "Background compression makes environments feel close. Skin texture rendered at its finest." },
  { fl: "200mm+", type: "Long Tele", emotion: "Detachment, surveillance, epic scale", compression: "Maximum", dof: "Very shallow", bestFor: ["Sports", "Wildlife", "Cinematic epic"], ref: "War cinematographers, action directors", notes: "Maximum background compression creates the layers effect. Distant subjects feel massive and present." },
];

const STORY_FRAMEWORKS = {
  Fashion: [
    { name: "The Transformation", arc: "We meet the subject in their rawest state → tension between identity and expectation → the look as liberation or armor. The clothes don't dress the subject — they reveal them." },
    { name: "The World She Inhabits", arc: "Environment established first → subject emerges from or contrasts with it → final frame shows the relationship between person and world. They belong here, or they don't." },
    { name: "The Gaze", arc: "Subject is unaware → becomes aware of the camera → decides how to meet it: complicity, defiance, or vulnerability. The viewer becomes part of the story." },
  ],
  Music: [
    { name: "The Performance Within", arc: "Still before the storm → the music takes over the body → aftermath: what remains after the feeling passes. Capture the invisible force of sound through physicality." },
    { name: "The World of the Song", arc: "Visual metaphor for the track's emotion established → artist inhabits that world fully → a moment of pure feeling as climax. The video is the song, translated." },
    { name: "Raw Exposure", arc: "No artifice — catch the artist off-guard → build to an honest performance moment → end on something private the audience wasn't supposed to see." },
  ],
  Film: [
    { name: "Three-Room Structure", arc: "Establish world and normal → rupture that changes everything → new equilibrium that can never go back. Every great film lives in this shape." },
    { name: "Character Reveals Environment", arc: "Start tight on character detail → pull back to reveal where they are → environment reframes everything we thought we knew about them." },
    { name: "The Slow Burn", arc: "Long take of ordinary life → tension builds through duration and stillness alone → a single action or look that breaks everything open." },
  ],
  Commercial: [
    { name: "Problem → Relief", arc: "Establish the before state honestly → the product enters the world → show the after in emotional, not functional terms. Sell the feeling." },
    { name: "The Hero's Object", arc: "Object treated with the gravitas of cinema → person discovers it → their world expands. Make the mundane feel mythic." },
  ],
  Documentary: [
    { name: "The Observational Arc", arc: "Enter the world without judgment → let the subject reveal themselves through action → find the moment that says everything without being staged." },
    { name: "Contradiction as Story", arc: "Establish what we expect to find → show what's actually there → sit with the gap between the two. Truth lives in contradictions." },
  ],
  Editorial: [
    { name: "Single Frame Story", arc: "One image must contain opening, tension, and resolution simultaneously. Every element in frame either serves the story or shouldn't be there." },
    { name: "The Sequence", arc: "Image 1 establishes world → Image 2 introduces tension → Image 3 resolves or leaves open. Three images, one story." },
  ],
};

const COMPOSITION_LIBRARY = [
  { name: "Rule of Thirds", type: "Classic", description: "Place subject at intersection points — creates tension between subject and space.", storyUse: "Let the empty space tell the story of what's missing or coming." },
  { name: "Leading Lines", type: "Dynamic", description: "Roads, corridors, shadows, fences that pull the eye toward subject.", storyUse: "Lines echoing the narrative direction — converging for tension, parallel for calm." },
  { name: "Frame Within Frame", type: "Cinematic", description: "Doorways, windows, arches that contain the subject.", storyUse: "Subject is trapped, protected, or observed. The frame becomes a metaphor for their condition." },
  { name: "Negative Space", type: "Minimalist", description: "Subject surrounded by emptiness — isolation, contemplation.", storyUse: "The space around the subject carries the emotional weight. Emptiness is not absence." },
  { name: "Symmetry", type: "Formal", description: "Mirror balance — controlled, sometimes eerie.", storyUse: "Perfect symmetry = power or obsession. Breaking symmetry = rupture or loss of control." },
  { name: "Dutch Angle", type: "Expressive", description: "Camera tilted off horizontal — unease, instability.", storyUse: "Something is wrong. The world is off. Subject is losing ground." },
  { name: "Low Angle", type: "Expressive", description: "Camera below eye level looking up at subject.", storyUse: "Power, dominance, heroism — or menace if used on a threatening figure." },
  { name: "High Angle / Bird's Eye", type: "Expressive", description: "Camera above, looking down at subject.", storyUse: "Vulnerability, smallness, surveillance. The subject is exposed and observed." },
  { name: "Over The Shoulder", type: "Narrative", description: "Subject A's shoulder frames Subject B.", storyUse: "Relationship, tension, power dynamic. Two worlds in contact." },
  { name: "Foreground Interest", type: "Layered", description: "Out-of-focus element in foreground adds depth and layering.", storyUse: "We look through something to reach the subject. Distance, voyeurism, context." },
];

const COLOR_GRADES = [
  {
    name: "Teal & Orange",
    mood: "Cinematic, commercial blockbuster",
    genres: ["Film", "Commercial", "Music"],
    description: "The most used grade in Hollywood. Shadows pushed teal, skin tones pushed orange. High contrast. Feels epic and immediate.",
    howTo: "In shadows: push blue-green. In highlights/midtones: push orange-amber. Keep skin in midtones warm. Increase contrast.",
    lut: "Most commercial LUTs default here. Look for 'Cinematic' presets.",
    references: "Mad Max: Fury Road, Transformers, most Marvel films",
    avoid: "Overuse makes work look generic. Use intentionally or subvert it.",
  },
  {
    name: "Desaturated Realism",
    mood: "Raw, documentary, honest",
    genres: ["Documentary", "Film", "Editorial"],
    description: "Pulled saturation, lifted blacks, neutral skin tones. The world as it is, not as we wish it looked. Truth-telling aesthetic.",
    howTo: "Lower saturation 20-40%. Lift blacks slightly (crushed blacks feel too dramatic). Keep skin tones neutral — no orange push.",
    lut: "Look for 'Flat', 'Natural', or 'Film Print' LUT styles.",
    references: "Roma, Boyhood, most Dardenne Brothers films",
    avoid: "Can feel lifeless without strong composition and subject to carry it.",
  },
  {
    name: "Warm Golden",
    mood: "Nostalgic, intimate, golden age",
    genres: ["Fashion", "Music", "Film"],
    description: "Warm amber shadows, golden highlights. Feels like memory. Every frame looks like it was shot at golden hour even if it wasn't.",
    howTo: "Push shadows amber-orange. Highlights stay warm white or cream. Reduce blue channel in shadows. Slight grain adds texture.",
    lut: "Search 'Golden Hour', 'Vintage Film', 'Kodak 500T' LUTs.",
    references: "Call Me By Your Name, Once Upon a Time in Hollywood",
    avoid: "Can romanticize subjects that don't need romanticizing.",
  },
  {
    name: "Cool Blue / Bleach Bypass",
    mood: "Cold, clinical, tense",
    genres: ["Film", "Music", "Fashion"],
    description: "Cold shadows, high contrast, reduced saturation. Feels like something is wrong. Psychological tension without saying a word.",
    howTo: "Push shadows blue. Reduce overall saturation. Increase contrast hard. Optionally blend color with B&W for bypass effect.",
    lut: "Look for 'Bleach Bypass', 'Cold', 'Nordic' styles.",
    references: "Saving Private Ryan, Prisoners, Se7en",
    avoid: "Can feel heavy-handed. Let the story earn the coldness.",
  },
  {
    name: "High Key Clean",
    mood: "Fresh, commercial, aspirational",
    genres: ["Commercial", "Fashion", "Beauty"],
    description: "Bright, even, clean. Minimal shadow. Skin luminous. Feels expensive and aspirational. The Apple product aesthetic applied to people.",
    howTo: "Lift exposure. Reduce contrast. Keep highlights from clipping. Skin should glow, not burn. Minimal shadow presence.",
    lut: "Search 'Beauty', 'Clean', 'Lifestyle' LUT packs.",
    references: "Apple campaigns, ZARA lookbooks, beauty brand content",
    avoid: "Needs perfect lighting and skin retouching to land correctly.",
  },
  {
    name: "Faded Film",
    mood: "Nostalgic, editorial, timeless",
    genres: ["Fashion", "Editorial", "Music"],
    description: "Lifted blacks, faded highlights, slight color shift. Feels like a photograph found in a shoebox. Age and memory baked in.",
    howTo: "Lift blacks in tone curve (never pure black). Bring down highlights slightly. Add slight color cast to shadows (green or magenta). Add grain.",
    lut: "Search 'Kodak', 'Fuji Film', 'Analog', 'Fade' LUT styles.",
    references: "Most Lana Del Rey visuals, vintage editorial, film photography aesthetic",
    avoid: "Overused in Instagram photography. Execute with restraint.",
  },
  {
    name: "High Contrast B&W",
    mood: "Timeless, graphic, powerful",
    genres: ["Fashion", "Documentary", "Editorial", "Film"],
    description: "Pure monochrome with heavy contrast. Deep blacks, bright whites, graphic midtones. Removes distraction of colour — forces composition to carry everything.",
    howTo: "Desaturate fully. Push contrast hard. Consider dodging/burning to control viewer eye path. Grain adds life.",
    lut: "Apply after desaturation: contrast S-curve. Many B&W film emulation LUTs available.",
    references: "Sebastião Salgado, Helmut Newton, The Artist, Schindler's List",
    avoid: "Weak compositions are exposed without colour to hide behind.",
  },
  {
    name: "Neon / Night Urban",
    mood: "Electric, gritty, modern",
    genres: ["Music", "Fashion", "Film"],
    description: "Deep blacks with saturated neon light sources — pink, cyan, purple. The city at night as a character. Feels alive and dangerous.",
    howTo: "Deep crush blacks. Boost saturation of colored lights only. Keep skin tones from going too green/cyan. Add grain for texture.",
    lut: "Search 'Neon', 'Cyberpunk', 'Night City' LUTs.",
    references: "Blade Runner 2049, Gaspar Noé's Enter the Void, The Weeknd visuals",
    avoid: "Requires actual colored light sources in scene — can't be fully manufactured in grade.",
  },
];

const SHOT_TYPES = [
  { name: "Extreme Wide Shot (EWS)", abbr: "EWS", purpose: "Establishes world. Subject is small within environment. Tells viewer where they are and what they're up against.", storyMoment: "Opening of a sequence, establishing scale, isolation." },
  { name: "Wide Shot (WS)", abbr: "WS", purpose: "Subject visible but environment still dominant. Context and character shown together.", storyMoment: "Character entering a space, showing relationship to environment." },
  { name: "Full Shot (FS)", abbr: "FS", purpose: "Head to toe. Body language visible. Costume, physicality, posture all communicate.", storyMoment: "Fashion reveals, character entrances, physical performance." },
  { name: "Medium Wide (MW)", abbr: "MW", purpose: "Knees up. Conversational but still shows physical context.", storyMoment: "Two-person scenes, action with context, editorial mid-shots." },
  { name: "Medium Shot (MS)", abbr: "MS", purpose: "Waist up. The most common shot. Neutral — neither intimate nor distant.", storyMoment: "Dialogue, interviews, standard editorial coverage." },
  { name: "Medium Close-Up (MCU)", abbr: "MCU", purpose: "Chest up. Starts to enter personal space. Emotion begins to read clearly.", storyMoment: "Emotional dialogue, key reactions, editorial portraits." },
  { name: "Close-Up (CU)", abbr: "CU", purpose: "Face fills frame. Emotion is the entire subject. Intimate and confrontational.", storyMoment: "Peak emotional moments, key reactions, beauty close-ups." },
  { name: "Extreme Close-Up (ECU)", abbr: "ECU", purpose: "A detail — eyes, hands, lips, objects. Abstraction. Forces the viewer to feel rather than understand.", storyMoment: "Tension peaks, sensory detail, fashion texture, abstract emotion." },
  { name: "Over-the-Shoulder (OTS)", abbr: "OTS", purpose: "We see subject from behind another. Implies relationship, perspective, power dynamic.", storyMoment: "Conversations, confrontations, moments of observation." },
  { name: "Point of View (POV)", abbr: "POV", purpose: "Camera is the character's eyes. Total subjective immersion.", storyMoment: "Placing viewer inside the experience — discovery, fear, desire." },
  { name: "Insert / Cutaway", abbr: "INS", purpose: "Detail shot that lives outside the main action — hands, objects, environment details.", storyMoment: "Adds texture and time. Tells story through objects rather than faces." },
  { name: "Aerial / Bird's Eye", abbr: "AER", purpose: "Above looking down — omniscient, surveillance, reveals patterns invisible from ground.", storyMoment: "Opening sequences, transition moments, revealing scale and pattern." },
];

const MOODS = ["Melancholic","Euphoric","Raw","Dreamlike","Tense","Serene","Gritty","Intimate","Bold","Mysterious","Nostalgic","Cinematic"];
const INDUSTRIES = ["Fashion","Music","Film","Commercial","Documentary","Editorial"];
const TIMES = ["Golden Hour","Blue Hour","Midday","Night","Overcast","Studio"];

// ── API KEY STORAGE ────────────────────────────────────────
const API_KEY_STORAGE = "frame_os_api_key";
function getApiKey() { try { return localStorage.getItem(API_KEY_STORAGE) || ""; } catch { return ""; } }
function setApiKey(k) { try { localStorage.setItem(API_KEY_STORAGE, k); } catch {} }

// ── SETTINGS SCREEN ────────────────────────────────────────
function SettingsScreen({ onBack }) {
  const [key, setKey] = useState(getApiKey);
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState(false);

  const save = () => {
    setApiKey(key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasKey = !!getApiKey();

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={onBack} title="Settings" />
      <div style={{ padding: "32px 20px 0" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.text, fontFamily: T.display, marginBottom: 8 }}>Anthropic API Key</div>
          <div style={{ fontSize: 14, color: C.muted, fontFamily: T.body, lineHeight: 1.7, marginBottom: 20 }}>
            Your key is stored privately on this device only — never sent anywhere except directly to Anthropic's API when generating briefs. Get yours at <span style={{ color: C.accent }}>console.anthropic.com</span>
          </div>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input
              type={visible ? "text" : "password"}
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 48px 13px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: T.body, boxSizing: "border-box" }}
            />
            <button onClick={() => setVisible(!visible)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: T.body }}>
              {visible ? "Hide" : "Show"}
            </button>
          </div>
          <button onClick={save} style={{
            width: "100%", padding: "14px", background: saved ? C.surface : C.black,
            border: `1px solid ${saved ? C.border : C.black}`, borderRadius: 12,
            color: saved ? C.muted : C.white, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: T.body,
          }}>
            {saved ? "✓ Saved" : "Save Key"}
          </button>
        </div>

        {hasKey && (
          <div style={{ background: "#F0FFF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#166534", fontFamily: T.body }}>✓ API key is set — Story Engine is AI-powered</div>
          </div>
        )}

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, fontFamily: T.body }}>How to get a key</div>
          {["1. Go to console.anthropic.com", "2. Sign up — free, no credit card needed", "3. Click API Keys in the sidebar", "4. Create Key → copy it", "5. Paste it above and save"].map((s, i) => (
            <div key={i} style={{ fontSize: 13, color: C.muted, fontFamily: T.body, padding: "6px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AI BRIEF GENERATOR ─────────────────────────────────────
async function generateAIBrief({ description, subjectColor, subjectTexture, subjectRole, subjectEmotion, industry, mood, time, constraints, shootType }) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("NO_KEY");

  const prompt = `You are a world-class Director of Photography and Creative Director with 20+ years experience across fashion, music videos, and film. You think like Roger Deakins, Emmanuel Lubezki, and Ellen von Unwerth combined.

A cinematographer/photographer has come to you for a specific production brief. Think deeply and specifically about their exact subject — not generically. Reason through every decision like a real DP would in a pre-production meeting.

SUBJECT DETAILS:
- Description: ${description}
- Color: ${subjectColor || "not specified"}
- Texture/Surface: ${subjectTexture || "not specified"}
- Role in shoot: ${subjectRole || "not specified"}
- Emotion to trigger in viewer: ${subjectEmotion || "not specified"}

SHOOT CONTEXT:
- Industry/Context: ${industry}
- Desired mood: ${mood}
- Time of day: ${time || "not specified"}
- Shoot type: ${shootType || "not specified"}
- Constraints: ${constraints || "none"}

Think specifically about THIS subject. A red apple with shiny skin is completely different from a matte black jacket — your lighting, set, color, and lens choices must be derived from the actual physical and emotional properties of what they're shooting.

Respond ONLY with a valid JSON object, no markdown, no explanation:
{
  "title": "A specific, evocative 4-6 word title for this shoot direction",
  "director_take": "2-3 sentences of how you as a DP would approach this. What's the one thing that makes this subject interesting to shoot? What would most photographers miss about it?",
  "narrative_arc": {
    "name": "Name of the story framework",
    "arc": "The full narrative arc — opening, tension, resolution — written specifically for this subject and context. 3-4 sentences.",
    "what_viewer_feels": "Exactly what emotion hits the viewer and why this subject creates it"
  },
  "set_design": {
    "primary_surface": "Specific surface material and why it serves THIS subject's color and texture",
    "background": "Exact background recommendation with reasoning",
    "props": "2-3 specific props or environmental elements that add story without distraction",
    "what_to_avoid": "What would kill this shot — specific to this subject",
    "spatial_relationship": "How the subject should sit in the space — centered, offset, environmental context"
  },
  "color_script": {
    "foreground_palette": "Colors in and around the subject itself",
    "background_palette": "What colors the background and set should carry",
    "grade_direction": "Specific grading direction — shadows, highlights, saturation, any color pushes — derived from the subject's actual color",
    "what_to_avoid": "Color combinations that would fight this subject"
  },
  "lighting_plan": {
    "setup_name": "Name of the lighting setup",
    "key_light": "Position, quality (hard/soft), size, and distance — specific to this subject's texture",
    "fill": "Fill light direction and ratio — or deliberate absence",
    "rim_or_separation": "How to separate subject from background",
    "modifiers": "Specific modifiers — softbox size, diffusion, flags, reflectors — and why for THIS texture",
    "what_texture_tells_us": "Specific insight about how this subject's surface interacts with light",
    "ratio": "Light ratio recommendation"
  },
  "camera_plan": {
    "lens": "Specific focal length with reasoning for this subject",
    "distance": "How far from subject and why",
    "angle": "Camera angle and height relative to subject",
    "movement": "Any camera movement or deliberate stillness",
    "dof": "Depth of field intent and aperture range"
  },
  "shot_sequence": [
    { "shot": "Shot type", "abbr": "abbreviation", "purpose": "Why this shot specifically for this subject" }
  ],
  "composition_direction": [
    { "technique": "Composition technique", "application": "How to apply it to THIS specific subject" }
  ],
  "unexpected_idea": "One bold, unexpected creative direction most photographers would never think of for this subject — something that could make this shoot iconic"
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API_ERROR: ${res.status} — ${err}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "API error");
  const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
  const clean = text.replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Could not parse response. Try regenerating.");
  try { return JSON.parse(clean.slice(start, end + 1)); }
  catch(e) { throw new Error("Parse failed — try regenerating."); }
}

// ── AI BRIEF OUTPUT ────────────────────────────────────────
function AIBriefOutput({ brief, inputs, onBack, onRegen, onSave, loading }) {
  if (loading) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 40 }}>
      <div style={{ fontSize: 32, animation: "spin 2s linear infinite" }}>◎</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: T.body }}>Reading your subject...</div>
      <div style={{ fontSize: 13, color: C.muted, fontFamily: T.body, textAlign: "center", lineHeight: 1.7 }}>Thinking like a DP — lighting, set, color, story — all derived from what you're actually shooting.</div>
    </div>
  );

  if (!brief) return null;

  const Block = ({ label, children, dark }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: dark ? "#555" : C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: T.body }}>{label}</div>
      <div style={{ background: dark ? "#111" : C.surface, border: `1px solid ${dark ? "#1e1e1e" : C.border}`, borderRadius: 12, padding: "16px 18px" }}>
        {children}
      </div>
    </div>
  );

  const Row = ({ label, value, dark }) => (
    <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${dark ? "#1e1e1e" : C.border}` }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: dark ? "#555" : C.dim, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, fontFamily: T.body }}>{label}</div>
      <div style={{ fontSize: 13, color: dark ? "#aaa" : C.text, lineHeight: 1.7, fontFamily: T.body }}>{value}</div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={onBack} eyebrow={`${inputs.industry} · ${inputs.mood}`} title={brief.title || "Production Brief"}
        action={<button onClick={onRegen} style={{ background: "none", border: "none", color: C.accent, fontSize: 15, cursor: "pointer", fontFamily: T.body }}>Regen</button>} />

      <div style={{ padding: "20px 20px 0" }}>

        {/* Director's Take */}
        <div style={{ background: C.black, borderRadius: 16, padding: "20px", marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, fontFamily: T.body }}>DP's Take</div>
          <div style={{ fontSize: 15, color: "#E8E0D0", fontFamily: T.display, lineHeight: 1.8 }}>{brief.director_take}</div>
        </div>

        {/* Narrative Arc */}
        {brief.narrative_arc && (
          <Block label={`Narrative Arc — ${brief.narrative_arc.name}`}>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.8, fontFamily: T.body, marginBottom: 12 }}>{brief.narrative_arc.arc}</div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, fontFamily: T.body }}>Viewer feels</div>
              <div style={{ fontSize: 13, color: C.muted, fontFamily: T.body, lineHeight: 1.6 }}>{brief.narrative_arc.what_viewer_feels}</div>
            </div>
          </Block>
        )}

        {/* Set Design */}
        {brief.set_design && (
          <Block label="Set Design">
            <Row label="Primary Surface" value={brief.set_design.primary_surface} />
            <Row label="Background" value={brief.set_design.background} />
            <Row label="Props & Elements" value={brief.set_design.props} />
            <Row label="Spatial Relationship" value={brief.set_design.spatial_relationship} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, fontFamily: T.body }}>Avoid</div>
              <div style={{ fontSize: 13, color: C.muted, fontFamily: T.body, lineHeight: 1.6 }}>{brief.set_design.what_to_avoid}</div>
            </div>
          </Block>
        )}

        {/* Color Script */}
        {brief.color_script && (
          <Block label="Color Script">
            <Row label="Foreground Palette" value={brief.color_script.foreground_palette} />
            <Row label="Background Palette" value={brief.color_script.background_palette} />
            <Row label="Grade Direction" value={brief.color_script.grade_direction} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, fontFamily: T.body }}>Avoid</div>
              <div style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{brief.color_script.what_to_avoid}</div>
            </div>
          </Block>
        )}

        {/* Lighting Plan */}
        {brief.lighting_plan && (
          <Block label="Lighting Plan">
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: T.display, marginBottom: 14 }}>{brief.lighting_plan.setup_name} <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, background: C.surfaceAlt, padding: "2px 10px", borderRadius: 20, marginLeft: 8 }}>{brief.lighting_plan.ratio}</span></div>
            <Row label="Key Light" value={brief.lighting_plan.key_light} />
            <Row label="Fill" value={brief.lighting_plan.fill} />
            <Row label="Rim / Separation" value={brief.lighting_plan.rim_or_separation} />
            <Row label="Modifiers" value={brief.lighting_plan.modifiers} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, fontFamily: T.body }}>Texture Insight</div>
              <div style={{ fontSize: 13, color: C.muted, fontFamily: T.body, lineHeight: 1.6 }}>{brief.lighting_plan.what_texture_tells_us}</div>
            </div>
          </Block>
        )}

        {/* Camera Plan */}
        {brief.camera_plan && (
          <Block label="Camera Plan">
            <Row label="Lens" value={brief.camera_plan.lens} />
            <Row label="Distance" value={brief.camera_plan.distance} />
            <Row label="Angle" value={brief.camera_plan.angle} />
            <Row label="Movement" value={brief.camera_plan.movement} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, fontFamily: T.body }}>Depth of Field</div>
              <div style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{brief.camera_plan.dof}</div>
            </div>
          </Block>
        )}

        {/* Shot Sequence */}
        {brief.shot_sequence?.length > 0 && (
          <Block label="Shot Sequence">
            {brief.shot_sequence.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: i < brief.shot_sequence.length - 1 ? 12 : 0, marginBottom: i < brief.shot_sequence.length - 1 ? 12 : 0, borderBottom: i < brief.shot_sequence.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.white, background: C.black, padding: "3px 8px", borderRadius: 6, flexShrink: 0, fontFamily: T.body }}>{s.abbr}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2, fontFamily: T.body }}>{s.shot}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, fontFamily: T.body }}>{s.purpose}</div>
                </div>
              </div>
            ))}
          </Block>
        )}

        {/* Composition */}
        {brief.composition_direction?.length > 0 && (
          <Block label="Composition Direction">
            {brief.composition_direction.map((c, i) => (
              <div key={i} style={{ paddingBottom: i < brief.composition_direction.length - 1 ? 12 : 0, marginBottom: i < brief.composition_direction.length - 1 ? 12 : 0, borderBottom: i < brief.composition_direction.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4, fontFamily: T.body }}>{c.technique}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, fontFamily: T.body }}>{c.application}</div>
              </div>
            ))}
          </Block>
        )}

        {/* Unexpected Idea */}
        {brief.unexpected_idea && (
          <div style={{ background: C.black, borderRadius: 16, padding: "20px", marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, fontFamily: T.body }}>The Bold Idea</div>
            <div style={{ fontSize: 14, color: "#E8E0D0", fontFamily: T.body, lineHeight: 1.8 }}>{brief.unexpected_idea}</div>
          </div>
        )}

        <button onClick={() => onSave && onSave({ ...brief, inputs })} style={{
          width: "100%", padding: "15px", background: C.black, border: "none",
          borderRadius: 12, color: C.white, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: T.body, marginBottom: 10,
        }}>Save to Project</button>
        <button onClick={onRegen} style={{
          width: "100%", padding: "14px", background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 12, color: C.text, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: T.body,
        }}>Regenerate</button>
      </div>
    </div>
  );
}

// ── STORY ENGINE — SMART INTAKE ────────────────────────────
function StoryEngine({ onBack, onSaveBrief }) {
  // Step 0: free description, Step 1: follow-up questions, Step 2: parameters, Step 3: brief output
  const [step, setStep] = useState(0);
  const [description, setDescription] = useState("");
  const [subjectColor, setSubjectColor] = useState("");
  const [subjectTexture, setSubjectTexture] = useState("");
  const [subjectRole, setSubjectRole] = useState("");
  const [subjectEmotion, setSubjectEmotion] = useState("");
  const [industry, setIndustry] = useState("Fashion");
  const [mood, setMood] = useState("");
  const [time, setTime] = useState("");
  const [constraints, setConstraints] = useState("");
  const [shootType, setShootType] = useState("");
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasKey = !!getApiKey();

  const inputs = { description, subjectColor, subjectTexture, subjectRole, subjectEmotion, industry, mood, time, constraints, shootType };

  const generate = async () => {
    if (!mood) return;
    setLoading(true);
    setError(null);
    setStep(3);
    try {
      const result = await generateAIBrief(inputs);
      setBrief(result);
    } catch (err) {
      if (err.message === "NO_KEY") setError("No API key set. Go to Settings to add your Anthropic key.");
      else setError(`Something went wrong: ${err.message}`);
      setStep(2);
    }
    setLoading(false);
  };

  if (step === 3) return (
    <AIBriefOutput
      brief={brief}
      inputs={inputs}
      loading={loading}
      onBack={() => { setBrief(null); setStep(2); }}
      onSave={onSaveBrief}
      onRegen={() => { setBrief(null); generate(); }}
    />
  );

  const SHOOT_TYPES = [
    { id: "still_life", label: "Still Life", sub: "Object as hero" },
    { id: "portrait", label: "Portrait", sub: "Person as subject" },
    { id: "wide_scene", label: "Wide Scene", sub: "Environment + subject" },
    { id: "detail", label: "Detail / Macro", sub: "Texture, close-up" },
    { id: "environmental", label: "Environmental", sub: "Location-driven" },
  ];

  const SUBJECT_ROLES = [
    "Hero product", "Symbolic prop", "Character reveal", "Environmental detail", "Abstract concept"
  ];

  const SUBJECT_EMOTIONS = [
    "Desire", "Nostalgia", "Power", "Fragility", "Mystery", "Joy", "Tension", "Intimacy"
  ];

  // Step 2 — Shoot Parameters
  if (step === 2) return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={() => setStep(1)} eyebrow="Step 3 of 3" title="Shoot Parameters" />
      <div style={{ padding: "24px 20px 0" }}>

        <div style={{ background: C.surface, borderRadius: 12, padding: "14px 16px", marginBottom: 24, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, fontFamily: T.body }}>Your subject</div>
          <div style={{ fontSize: 14, color: C.text, fontFamily: T.body }}>{description}</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Label>Industry / Context</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {INDUSTRIES.map(i => <Chip key={i} active={industry === i} onClick={() => setIndustry(i)}>{i}</Chip>)}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Label>Mood</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {MOODS.map(m => <Chip key={m} active={mood === m} onClick={() => setMood(m === mood ? "" : m)}>{m}</Chip>)}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Label>Time of Day</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TIMES.map(t => <Chip key={t} active={time === t} onClick={() => setTime(t === time ? "" : t)}>{t}</Chip>)}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <Label>Constraints (optional)</Label>
          <input value={constraints} onChange={e => setConstraints(e.target.value)}
            placeholder="One lens, natural light, 35mm film..."
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 14px", color: C.text, fontSize: 15, outline: "none", fontFamily: T.body, boxSizing: "border-box" }} />
        </div>

        {error && (
          <div style={{ background: "#FFF0F0", border: "1px solid #FCA5A5", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#DC2626", fontFamily: T.body, lineHeight: 1.6 }}>{error}</div>
          </div>
        )}

        {!hasKey && (
          <div style={{ background: "#FFF9E6", border: "1px solid #FCD34D", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#92400E", fontFamily: T.body }}>⚠ No API key set — go to Settings to add your key before generating.</div>
          </div>
        )}

        <button onClick={generate} disabled={!mood || !hasKey} style={{
          width: "100%", padding: "16px", background: mood && hasKey ? C.black : C.surfaceAlt,
          border: "none", borderRadius: 12, color: mood && hasKey ? C.white : C.dim,
          fontSize: 15, fontWeight: 600, cursor: mood && hasKey ? "pointer" : "default", fontFamily: T.body,
        }}>
          Build My Production Brief
        </button>
        {!mood && <div style={{ textAlign: "center", fontSize: 13, color: C.dim, marginTop: 10, fontFamily: T.body }}>Select a mood to continue</div>}
      </div>
    </div>
  );

  // Step 1 — Follow-up questions about the subject
  if (step === 1) return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={() => setStep(0)} eyebrow="Step 2 of 3" title="Tell Me More" />
      <div style={{ padding: "24px 20px 0" }}>

        <div style={{ background: C.surface, borderRadius: 12, padding: "14px 16px", marginBottom: 28, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, fontFamily: T.body }}>Your subject</div>
          <div style={{ fontSize: 14, color: C.text, fontFamily: T.body }}>{description}</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Label>What color is it?</Label>
          <input value={subjectColor} onChange={e => setSubjectColor(e.target.value)}
            placeholder="e.g. deep red, matte black, pale gold..."
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 14px", color: C.text, fontSize: 15, outline: "none", fontFamily: T.body, boxSizing: "border-box" }} />
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6, fontFamily: T.body }}>This determines your set palette, backgrounds, and color grade direction.</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Label>What's the surface texture?</Label>
          <input value={subjectTexture} onChange={e => setSubjectTexture(e.target.value)}
            placeholder="e.g. shiny skin, matte fabric, rough stone, glossy..."
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 14px", color: C.text, fontSize: 15, outline: "none", fontFamily: T.body, boxSizing: "border-box" }} />
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6, fontFamily: T.body }}>Texture tells us what lighting modifier to use and where to position the key.</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Label>What is this subject's role in the shoot?</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SUBJECT_ROLES.map(r => <Chip key={r} active={subjectRole === r} onClick={() => setSubjectRole(r === subjectRole ? "" : r)}>{r}</Chip>)}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Label>What feeling should it trigger in the viewer?</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SUBJECT_EMOTIONS.map(e => <Chip key={e} active={subjectEmotion === e} onClick={() => setSubjectEmotion(e === subjectEmotion ? "" : e)}>{e}</Chip>)}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <Label>Type of shoot</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SHOOT_TYPES.map(s => (
              <button key={s.id} onClick={() => setShootType(s.id === shootType ? "" : s.id)} style={{
                background: shootType === s.id ? C.black : C.surface,
                border: `1px solid ${shootType === s.id ? C.black : C.border}`,
                borderRadius: 10, padding: "14px 16px", textAlign: "left", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: shootType === s.id ? C.white : C.text, fontFamily: T.body }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: shootType === s.id ? "rgba(255,255,255,0.6)" : C.muted, fontFamily: T.body }}>{s.sub}</div>
                </div>
                {shootType === s.id && <span style={{ color: C.white, fontSize: 16 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setStep(2)} style={{
          width: "100%", padding: "16px", background: C.black,
          border: "none", borderRadius: 12, color: C.white,
          fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: T.body,
        }}>
          Continue →
        </button>
      </div>
    </div>
  );

  // Step 0 — Free description
  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={onBack} eyebrow="Step 1 of 3" title="What are you shooting?" />
      <div style={{ padding: "24px 20px 0" }}>

        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 15, color: C.muted, fontFamily: T.body, lineHeight: 1.7, margin: "0 0 20px" }}>
            Describe your subject the way you'd describe it to a collaborator. Don't overthink it — just tell me what it is.
          </p>
        </div>

        <div style={{ marginBottom: 8 }}>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder={"e.g. A red apple, shiny skin, medium size\n\ne.g. A woman in a black silk dress, 30s, standing\n\ne.g. An old leather watch, worn and cracked"}
            rows={6}
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px", color: C.text, fontSize: 15, outline: "none", fontFamily: T.body, boxSizing: "border-box", resize: "none", lineHeight: 1.7 }} />
        </div>

        <div style={{ fontSize: 12, color: C.dim, marginBottom: 32, fontFamily: T.body }}>
          The more specific, the smarter the brief. Color, texture, size, feeling — all useful.
        </div>

        <button onClick={() => setStep(1)} disabled={description.trim().length < 5} style={{
          width: "100%", padding: "16px", background: description.trim().length >= 5 ? C.black : C.surfaceAlt,
          border: "none", borderRadius: 12, color: description.trim().length >= 5 ? C.white : C.dim,
          fontSize: 15, fontWeight: 600, cursor: description.trim().length >= 5 ? "pointer" : "default", fontFamily: T.body,
        }}>
          Next — Tell Me More →
        </button>
      </div>
    </div>
  );
}

// ── UI PRIMITIVES ──────────────────────────────────────────
function Label({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, fontFamily: T.body }}>{children}</div>;
}

function Chip({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 14px", borderRadius: 20,
      border: `1px solid ${active ? C.black : C.border}`,
      background: active ? C.black : C.white,
      color: active ? C.white : C.text,
      fontSize: 13, cursor: "pointer", fontFamily: T.body,
      fontWeight: active ? 500 : 400, whiteSpace: "nowrap",
      transition: "all 0.15s ease",
    }}>{children}</button>
  );
}

function Card({ children, style, accent }) {
  return (
    <div style={{
      background: accent ? C.black : C.surface,
      border: `1px solid ${accent ? C.black : C.border}`,
      borderRadius: 12, padding: "16px 18px", ...style,
    }}>{children}</div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "0 0 24px" }} />;
}

function BackHeader({ onBack, eyebrow, title, action }) {
  return (
    <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", gap: 10, background: C.bg, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 10 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.accent, fontSize: 15, cursor: "pointer", padding: "4px 0", fontFamily: T.body, display: "flex", alignItems: "center", gap: 4 }}>
        ‹ Back
      </button>
      <div style={{ flex: 1, textAlign: "center" }}>
        {eyebrow && <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{eyebrow}</div>}
        <div style={{ fontSize: 16, fontWeight: 600, color: C.text, fontFamily: T.display }}>{title}</div>
      </div>
      {action || <div style={{ width: 60 }} />}
    </div>
  );
}

// ── HOME SCREEN ────────────────────────────────────────────
function HomeScreen({ onNavigate }) {
  const modules = [
    { id: "engine", icon: "✦", label: "Story Engine", sub: "Translate feeling into frame", ready: true },
    { id: "lighting", icon: "◐", label: "Lighting Bible", sub: "10 setups, every mood", ready: true },
    { id: "lens", icon: "◎", label: "Lens Guide", sub: "Focal length & emotion", ready: true },
    { id: "composition", icon: "⊞", label: "Composition", sub: "Framework library", ready: true },
    { id: "shotplanner", icon: "▤", label: "Shot Planner", sub: "Build your shot list", ready: true },
    { id: "colorgrade", icon: "◑", label: "Color & Grade", sub: "Palette by mood", ready: true },
  ];
  return (
    <div style={{ padding: "0 0 100px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ padding: "52px 20px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: 0.5, marginBottom: 6, fontFamily: T.body }}>CREATIVE OS</div>
            <h1 style={{ fontSize: 38, fontWeight: 700, color: C.text, margin: "0 0 8px", fontFamily: T.display, letterSpacing: -1 }}>Frame</h1>
            <p style={{ fontSize: 15, color: C.muted, margin: 0, fontFamily: T.body }}>Your visual storytelling environment</p>
          </div>
          <button onClick={() => onNavigate("settings")} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "8px 14px", color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: T.body, marginTop: 8 }}>⚙ Settings</button>
        </div>
      </div>

      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {modules.map((m, i) => (
          <button key={i} onClick={() => m.ready && onNavigate(m.id)} style={{
            background: i === 0 ? C.black : C.surface,
            border: `1px solid ${i === 0 ? C.black : C.border}`,
            borderRadius: 16, padding: "20px 16px", textAlign: "left",
            cursor: m.ready ? "pointer" : "default",
          }}>
            <div style={{ fontSize: 20, marginBottom: 14, color: i === 0 ? C.white : C.text }}>{m.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: i === 0 ? C.white : C.text, fontFamily: T.display, marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 12, color: i === 0 ? "rgba(255,255,255,0.6)" : C.muted, fontFamily: T.body, lineHeight: 1.4 }}>{m.sub}</div>
          </button>
        ))}
      </div>

      <div style={{ margin: "20px 20px 0", padding: "16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10, fontFamily: T.body }}>Tuned for</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Fashion", "Music", "Film"].map(tag => (
            <span key={tag} style={{ fontSize: 13, color: C.text, background: C.white, border: `1px solid ${C.border}`, padding: "5px 12px", borderRadius: 20, fontFamily: T.body }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}



// ── LIGHTING BIBLE ─────────────────────────────────────────
function LightingBible({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const genres = ["All", "Fashion", "Music", "Film", "Commercial"];
  const filtered = filter === "All" ? LIGHTING_SETUPS : LIGHTING_SETUPS.filter(l => l.genre.includes(filter));

  if (selected) return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={() => setSelected(null)} title={selected.name} />
      <div style={{ padding: "24px 20px 0" }}>
        <Card accent style={{ marginBottom: 16 }}>
          <Label>Mood</Label>
          <div style={{ fontSize: 18, fontWeight: 600, color: C.white, fontFamily: T.display }}>{selected.mood}</div>
        </Card>
        <Card style={{ marginBottom: 12 }}>
          <Label>How it works</Label>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8, fontFamily: T.body }}>{selected.description}</div>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Card><Label>Light Ratio</Label><div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: T.display }}>{selected.ratio}</div></Card>
          <Card><Label>Genres</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{selected.genre.map(g => <span key={g} style={{ fontSize: 11, fontWeight: 600, color: C.text, background: C.surfaceAlt, padding: "3px 10px", borderRadius: 20, fontFamily: T.body }}>{g}</span>)}</div></Card>
        </div>
        <Card>
          <Label>Best used for</Label>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, fontFamily: T.body }}>{selected.uses}</div>
        </Card>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={onBack} eyebrow="Module 02" title="Lighting Bible" />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16 }}>
          {genres.map(g => <Chip key={g} active={filter === g} onClick={() => setFilter(g)}>{g}</Chip>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((l, i) => (
            <button key={i} onClick={() => setSelected(l)} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: "16px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: T.display, marginBottom: 4 }}>{l.name}</div>
                <div style={{ fontSize: 13, color: C.muted, fontFamily: T.body }}>{l.mood}</div>
              </div>
              <span style={{ fontSize: 18, color: C.dim }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LENS GUIDE ─────────────────────────────────────────────
function LensGuide({ onBack }) {
  const [selected, setSelected] = useState(null);

  if (selected) return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={() => setSelected(null)} title={selected.fl} eyebrow={selected.type} />
      <div style={{ padding: "24px 20px 0" }}>
        <Card accent style={{ marginBottom: 16 }}>
          <Label>Emotional Quality</Label>
          <div style={{ fontSize: 16, fontWeight: 500, color: C.white, fontFamily: T.display, lineHeight: 1.5 }}>{selected.emotion}</div>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Card><Label>Compression</Label><div style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{selected.compression}</div></Card>
          <Card><Label>Depth of Field</Label><div style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{selected.dof}</div></Card>
        </div>
        <Card style={{ marginBottom: 12 }}>
          <Label>Reference</Label>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: T.body }}>{selected.ref}</div>
        </Card>
        <Card style={{ marginBottom: 12 }}>
          <Label>Key Insight</Label>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, fontFamily: T.body }}>{selected.notes}</div>
        </Card>
        <Card>
          <Label>Best For</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {selected.bestFor.map(b => <span key={b} style={{ fontSize: 13, color: C.text, background: C.surfaceAlt, padding: "5px 12px", borderRadius: 20, fontFamily: T.body }}>{b}</span>)}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={onBack} eyebrow="Module 03" title="Lens Guide" />
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, lineHeight: 1.6, marginBottom: 20 }}>Every focal length carries an emotion. Choose your lens like you choose your words.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LENS_DATA.map((l, i) => (
            <button key={i} onClick={() => setSelected(l)} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: "16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.text, fontFamily: T.display, width: 64, flexShrink: 0 }}>{l.fl}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 3, fontFamily: T.body }}>{l.type}</div>
                <div style={{ fontSize: 12, color: C.muted, fontFamily: T.body }}>{l.emotion.slice(0, 42)}...</div>
              </div>
              <span style={{ fontSize: 18, color: C.dim }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── COMPOSITION ─────────────────────────────────────────────
function CompositionLib({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const types = ["All", "Classic", "Cinematic", "Expressive", "Narrative", "Minimalist", "Dynamic", "Layered", "Formal"];
  const filtered = filter === "All" ? COMPOSITION_LIBRARY : COMPOSITION_LIBRARY.filter(c => c.type === filter);

  if (selected) return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={() => setSelected(null)} eyebrow={selected.type} title={selected.name} />
      <div style={{ padding: "24px 20px 0" }}>
        <Card accent style={{ marginBottom: 16 }}>
          <Label>Story Use</Label>
          <div style={{ fontSize: 14, color: C.white, lineHeight: 1.8, fontFamily: T.body }}>{selected.storyUse}</div>
        </Card>
        <Card>
          <Label>Technical Description</Label>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, fontFamily: T.body }}>{selected.description}</div>
        </Card>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={onBack} eyebrow="Module 04" title="Composition" />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16 }}>
          {types.map(t => <Chip key={t} active={filter === t} onClick={() => setFilter(t)}>{t}</Chip>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((c, i) => (
            <button key={i} onClick={() => setSelected(c)} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: "16px", textAlign: "left", cursor: "pointer",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: T.display }}>{c.name}</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, background: C.surfaceAlt, padding: "3px 10px", borderRadius: 20, fontFamily: T.body }}>{c.type}</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, fontFamily: T.body, lineHeight: 1.5 }}>{c.storyUse.slice(0, 72)}...</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SHOT PLANNER ───────────────────────────────────────────
function ShotPlanner({ onBack, onSaveShots }) {
  const [selectedType, setSelectedType] = useState(null);
  const [shotList, setShotList] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [view, setView] = useState("library"); // library | list

  const addToList = (shot) => {
    setShotList(prev => [...prev, { ...shot, id: Date.now(), notes: "", done: false }]);
  };

  const removeShot = (id) => setShotList(prev => prev.filter(s => s.id !== id));
  const toggleDone = (id) => setShotList(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s));
  const updateNote = (id, notes) => setShotList(prev => prev.map(s => s.id === id ? { ...s, notes } : s));

  if (selectedType) return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={() => setSelectedType(null)} eyebrow={selectedType.abbr} title={selectedType.name} />
      <div style={{ padding: "24px 20px 0" }}>
        <Card accent style={{ marginBottom: 16 }}>
          <Label>Story Purpose</Label>
          <div style={{ fontSize: 14, color: C.white, lineHeight: 1.8, fontFamily: T.body }}>{selectedType.purpose}</div>
        </Card>
        <Card style={{ marginBottom: 24 }}>
          <Label>Best story moment</Label>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, fontFamily: T.body }}>{selectedType.storyMoment}</div>
        </Card>
        <button onClick={() => { addToList(selectedType); setSelectedType(null); setView("list"); }} style={{
          width: "100%", padding: "15px", background: C.black, border: "none",
          borderRadius: 12, color: C.white, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: T.body,
        }}>+ Add to Shot List</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={onBack} eyebrow="Module 05" title="Shot Planner"
        action={
          <button onClick={() => setView(view === "library" ? "list" : "library")} style={{ background: "none", border: "none", color: C.accent, fontSize: 15, cursor: "pointer", fontFamily: T.body }}>
            {view === "library" ? `List${shotList.length > 0 ? ` (${shotList.length})` : ""}` : "Library"}
          </button>
        } />

      {view === "library" && (
        <div style={{ padding: "20px 20px 0" }}>
          <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, lineHeight: 1.6, marginBottom: 20 }}>Tap a shot type to learn it, then add it to your list.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SHOT_TYPES.map((s, i) => (
              <button key={i} onClick={() => setSelectedType(s)} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
                padding: "14px 16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.white, background: C.black, padding: "4px 8px", borderRadius: 6, flexShrink: 0, fontFamily: T.body }}>{s.abbr}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text, fontFamily: T.body }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, fontFamily: T.body, marginTop: 2 }}>{s.storyMoment.slice(0, 50)}...</div>
                </div>
                <span style={{ fontSize: 18, color: C.dim }}>›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === "list" && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ marginBottom: 20 }}>
            <Label>Project Name</Label>
            <input value={projectName} onChange={e => setProjectName(e.target.value)}
              placeholder="e.g. Lagos Fashion Week — Look 3"
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 14px", color: C.text, fontSize: 15, outline: "none", fontFamily: T.body, boxSizing: "border-box" }} />
          </div>
          {shotList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: C.muted }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>▤</div>
              <div style={{ fontSize: 15, fontWeight: 500, fontFamily: T.body, marginBottom: 6 }}>No shots yet</div>
              <div style={{ fontSize: 13, fontFamily: T.body }}>Go to Library to add shot types</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {shotList.map((s, i) => (
                <div key={s.id} style={{ background: s.done ? C.surface : C.bg, border: `1px solid ${s.done ? C.border : C.borderStrong}`, borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <button onClick={() => toggleDone(s.id)} style={{
                      width: 22, height: 22, borderRadius: "50%", border: `2px solid ${s.done ? C.accent : C.border}`,
                      background: s.done ? C.accent : "none", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {s.done && <span style={{ color: C.white, fontSize: 12 }}>✓</span>}
                    </button>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.done ? C.muted : C.white, background: s.done ? C.surfaceAlt : C.black, padding: "3px 8px", borderRadius: 6, fontFamily: T.body }}>{s.abbr}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: s.done ? C.muted : C.text, fontFamily: T.body, textDecoration: s.done ? "line-through" : "none" }}>{s.name}</span>
                    <button onClick={() => removeShot(s.id)} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", marginLeft: "auto", fontSize: 18, lineHeight: 1 }}>×</button>
                  </div>
                  <input value={s.notes} onChange={e => updateNote(s.id, e.target.value)}
                    placeholder="Add notes for this shot..."
                    style={{ width: "100%", background: "none", border: "none", borderTop: `1px solid ${C.border}`, paddingTop: 8, color: C.muted, fontSize: 13, outline: "none", fontFamily: T.body, boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ padding: "12px 0", fontSize: 13, color: C.muted, fontFamily: T.body, textAlign: "center" }}>
                {shotList.filter(s => s.done).length} / {shotList.length} shots captured
              </div>
              {shotList.length > 0 && (
                <button onClick={() => onSaveShots && onSaveShots(shotList)} style={{
                  width: "100%", padding: "14px", background: C.black, border: "none",
                  borderRadius: 12, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: T.body,
                }}>Save Shot List to Project</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── COLOR & GRADE ──────────────────────────────────────────
function ColorGrade({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const genres = ["All", "Fashion", "Music", "Film", "Commercial", "Documentary", "Editorial"];
  const filtered = filter === "All" ? COLOR_GRADES : COLOR_GRADES.filter(c => c.genres.includes(filter));

  if (selected) return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={() => setSelected(null)} title={selected.name} />
      <div style={{ padding: "24px 20px 0" }}>
        <Card accent style={{ marginBottom: 16 }}>
          <Label>Mood</Label>
          <div style={{ fontSize: 18, fontWeight: 600, color: C.white, fontFamily: T.display }}>{selected.mood}</div>
        </Card>
        <Card style={{ marginBottom: 12 }}>
          <Label>What it is</Label>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8, fontFamily: T.body }}>{selected.description}</div>
        </Card>
        <Card style={{ marginBottom: 12 }}>
          <Label>How to achieve it</Label>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8, fontFamily: T.body }}>{selected.howTo}</div>
        </Card>
        <Card style={{ marginBottom: 12 }}>
          <Label>LUT Direction</Label>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, fontFamily: T.body }}>{selected.lut}</div>
        </Card>
        <Card style={{ marginBottom: 12 }}>
          <Label>References</Label>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: T.body }}>{selected.references}</div>
        </Card>
        <Card style={{ background: "#FFF9F0", border: `1px solid #FFE4B5` }}>
          <Label>Watch Out For</Label>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, fontFamily: T.body }}>{selected.avoid}</div>
        </Card>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <BackHeader onBack={onBack} eyebrow="Module 06" title="Color & Grade" />
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 14, color: C.muted, fontFamily: T.body, lineHeight: 1.6, marginBottom: 20 }}>Color is the emotional grammar of your image. Every grade is a decision about how the world feels.</p>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16 }}>
          {genres.map(g => <Chip key={g} active={filter === g} onClick={() => setFilter(g)}>{g}</Chip>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((c, i) => (
            <button key={i} onClick={() => setSelected(c)} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: "16px", textAlign: "left", cursor: "pointer",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: T.display }}>{c.name}</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, background: C.surfaceAlt, padding: "3px 10px", borderRadius: 20, fontFamily: T.body, flexShrink: 0, marginLeft: 8 }}>{c.mood.split(",")[0]}</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, fontFamily: T.body, lineHeight: 1.5 }}>{c.description.slice(0, 72)}...</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── STORAGE HELPERS ────────────────────────────────────────
const STORAGE_KEY = "frame_os_projects";

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveProjects(projects) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch {}
}

// ── SAVE TO PROJECT MODAL ──────────────────────────────────
function SaveToProjectModal({ onSave, onClose, type, data }) {
  const [projects] = useState(loadProjects);
  const [mode, setMode] = useState("choose"); // choose | new
  const [newName, setNewName] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleSave = () => {
    const all = loadProjects();
    if (mode === "new") {
      if (!newName.trim()) return;
      const proj = {
        id: Date.now().toString(),
        name: newName.trim(),
        industry: data.industry || "",
        mood: data.mood || "",
        createdAt: new Date().toISOString(),
        brief: null, shots: [], notes: "", colorRef: "",
      };
      proj[type] = data;
      all.unshift(proj);
      saveProjects(all);
      onSave(proj.id);
    } else {
      if (!selectedId) return;
      const idx = all.findIndex(p => p.id === selectedId);
      if (idx > -1) { all[idx][type] = data; saveProjects(all); }
      onSave(selectedId);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: C.bg, borderRadius: "20px 20px 0 0", padding: "28px 20px 48px", width: "100%", maxWidth: 480 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, fontFamily: T.display, marginBottom: 6 }}>Save to Project</div>
        <div style={{ fontSize: 13, color: C.muted, fontFamily: T.body, marginBottom: 24 }}>Choose an existing project or create a new one.</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <Chip active={mode === "choose"} onClick={() => setMode("choose")}>Existing</Chip>
          <Chip active={mode === "new"} onClick={() => setMode("new")}>New Project</Chip>
        </div>

        {mode === "new" && (
          <input value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Project name e.g. Red Apple Editorial"
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 14px", color: C.text, fontSize: 15, outline: "none", fontFamily: T.body, boxSizing: "border-box", marginBottom: 16 }} />
        )}

        {mode === "choose" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, maxHeight: 200, overflowY: "auto" }}>
            {projects.length === 0
              ? <div style={{ fontSize: 13, color: C.muted, fontFamily: T.body, textAlign: "center", padding: "20px 0" }}>No projects yet — create one</div>
              : projects.map(p => (
                <button key={p.id} onClick={() => setSelectedId(p.id)} style={{
                  background: selectedId === p.id ? C.black : C.surface,
                  border: `1px solid ${selectedId === p.id ? C.black : C.border}`,
                  borderRadius: 10, padding: "12px 14px", textAlign: "left", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: selectedId === p.id ? C.white : C.text, fontFamily: T.body }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: selectedId === p.id ? "rgba(255,255,255,0.5)" : C.muted, fontFamily: T.body }}>{p.industry} {p.mood ? `· ${p.mood}` : ""}</div>
                  </div>
                  {selectedId === p.id && <span style={{ color: C.white }}>✓</span>}
                </button>
              ))
            }
          </div>
        )}

        <button onClick={handleSave} style={{
          width: "100%", padding: "15px", background: C.black, border: "none",
          borderRadius: 12, color: C.white, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: T.body, marginBottom: 10,
        }}>Save</button>
        <button onClick={onClose} style={{
          width: "100%", padding: "13px", background: "none", border: `1px solid ${C.border}`,
          borderRadius: 12, color: C.muted, fontSize: 15, cursor: "pointer", fontFamily: T.body,
        }}>Cancel</button>
      </div>
    </div>
  );
}

// ── PROJECT ROOM ───────────────────────────────────────────
function ProjectRoom({ projectId, onBack, onNavigateTo }) {
  const [project, setProject] = useState(null);
  const [tab, setTab] = useState("brief"); // brief | shots | notes
  const [notes, setNotes] = useState("");

  useState(() => {
    const all = loadProjects();
    const p = all.find(x => x.id === projectId);
    if (p) { setProject(p); setNotes(p.notes || ""); }
  });

  const saveNotes = (val) => {
    setNotes(val);
    const all = loadProjects();
    const idx = all.findIndex(x => x.id === projectId);
    if (idx > -1) { all[idx].notes = val; saveProjects(all); }
  };

  const deleteProject = () => {
    const all = loadProjects().filter(x => x.id !== projectId);
    saveProjects(all);
    onBack();
  };

  if (!project) return null;

  const brief = project.brief;
  const shots = project.shots || [];

  const TABS = [
    { id: "brief", label: "Brief", has: !!brief },
    { id: "shots", label: "Shots", has: shots.length > 0 },
    { id: "notes", label: "Notes", has: !!notes.trim() },
  ];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", paddingBottom: 120 }}>
      {/* Dark cinematic header */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #1e1e1e", padding: "20px 20px 16px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#888", fontSize: 15, cursor: "pointer", fontFamily: T.body }}>‹ Projects</button>
          <button onClick={deleteProject} style={{ background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer", fontFamily: T.body, marginLeft: "auto" }}>Delete</button>
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#444", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6, fontFamily: T.body }}>
          {project.industry}{project.mood ? ` · ${project.mood}` : ""}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#E8E0D0", fontFamily: T.display, letterSpacing: -0.5, marginBottom: 14 }}>{project.name}</div>
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e1e1e" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #E8E0D0" : "2px solid transparent",
              color: tab === t.id ? "#E8E0D0" : "#444", padding: "8px 16px 10px", fontSize: 13,
              fontWeight: 600, cursor: "pointer", fontFamily: T.body, display: "flex", alignItems: "center", gap: 6,
            }}>
              {t.label}
              {t.has && <span style={{ width: 6, height: 6, borderRadius: "50%", background: tab === t.id ? "#E8E0D0" : "#333", display: "inline-block" }} />}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 20px 0" }}>
        {/* BRIEF TAB */}
        {tab === "brief" && (
          brief ? (
            <div>
              {/* Subject */}
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "16px", marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: T.body }}>Subject</div>
                <div style={{ fontSize: 14, color: "#E8E0D0", fontFamily: T.body, lineHeight: 1.6 }}>{brief.description}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {[brief.subjectColor, brief.subjectTexture, brief.subjectRole, brief.subjectEmotion && `→ ${brief.subjectEmotion}`].filter(Boolean).map((tag, i) => (
                    <span key={i} style={{ fontSize: 11, color: "#888", background: "#1a1a1a", border: "1px solid #222", padding: "2px 10px", borderRadius: 20, fontFamily: T.body }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Narrative Arc */}
              {brief.framework && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: T.body }}>Narrative Arc — {brief.framework.name}</div>
                  <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "16px" }}>
                    <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.8, fontFamily: T.body }}>{brief.framework.arc}</div>
                  </div>
                </div>
              )}

              {/* Set Design */}
              {brief.surfaces && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: T.body }}>Set Design</div>
                  <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "16px" }}>
                    <div style={{ fontSize: 13, color: "#aaa", marginBottom: 8, fontFamily: T.body }}>
                      <span style={{ color: "#666", fontSize: 11, fontWeight: 600 }}>SURFACE  </span>{brief.surfaces[0]}, {brief.surfaces[1]}
                    </div>
                    {brief.colorPairing && <>
                      <div style={{ fontSize: 13, color: "#aaa", marginBottom: 8, fontFamily: T.body }}>
                        <span style={{ color: "#666", fontSize: 11, fontWeight: 600 }}>COMPLEMENT  </span>{brief.colorPairing.complement}
                      </div>
                      <div style={{ fontSize: 13, color: "#aaa", fontFamily: T.body }}>
                        <span style={{ color: "#666", fontSize: 11, fontWeight: 600 }}>CONTRAST  </span>{brief.colorPairing.contrast}
                      </div>
                    </>}
                  </div>
                </div>
              )}

              {/* Lighting */}
              {brief.lighting && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: T.body }}>Lighting — {brief.lighting.name}</div>
                  <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#E8E0D0", fontFamily: T.body }}>{brief.lighting.mood}</div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#E8E0D0", background: "#222", padding: "3px 10px", borderRadius: 20, fontFamily: T.body }}>Ratio {brief.lighting.ratio}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.7, fontFamily: T.body }}>{brief.lighting.description}</div>
                    {brief.textureModifier && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #1e1e1e" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#4A9EF5", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, fontFamily: T.body }}>Texture Note</div>
                        <div style={{ fontSize: 12, color: "#888", lineHeight: 1.7, fontFamily: T.body }}>{brief.textureModifier}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Camera */}
              {brief.lens && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: T.body }}>Camera Plan</div>
                  <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "16px" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#E8E0D0", fontFamily: T.display, marginBottom: 6 }}>{brief.lens.fl}</div>
                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, fontFamily: T.body }}>{brief.lens.emotion}</div>
                  </div>
                </div>
              )}

              <button onClick={() => onNavigateTo("engine")} style={{
                width: "100%", padding: "14px", background: "none", border: "1px solid #222",
                borderRadius: 12, color: "#888", fontSize: 13, cursor: "pointer", fontFamily: T.body, marginTop: 8,
              }}>+ Generate New Brief</button>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>✦</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#555", fontFamily: T.body, marginBottom: 8 }}>No brief yet</div>
              <div style={{ fontSize: 13, color: "#333", fontFamily: T.body, marginBottom: 24 }}>Generate a story brief and save it to this project</div>
              <button onClick={() => onNavigateTo("engine")} style={{
                padding: "13px 28px", background: "#E8E0D0", border: "none",
                borderRadius: 12, color: "#0a0a0a", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: T.body,
              }}>Open Story Engine</button>
            </div>
          )
        )}

        {/* SHOTS TAB */}
        {tab === "shots" && (
          <div>
            {shots.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>▤</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#555", fontFamily: T.body, marginBottom: 8 }}>No shots yet</div>
                <div style={{ fontSize: 13, color: "#333", fontFamily: T.body, marginBottom: 24 }}>Build a shot list and save it here</div>
                <button onClick={() => onNavigateTo("shotplanner")} style={{
                  padding: "13px 28px", background: "#E8E0D0", border: "none",
                  borderRadius: 12, color: "#0a0a0a", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: T.body,
                }}>Open Shot Planner</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {shots.map((s, i) => (
                  <div key={i} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#E8E0D0", background: "#222", padding: "3px 8px", borderRadius: 6, flexShrink: 0, fontFamily: T.body }}>{s.abbr}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#E8E0D0", marginBottom: 3, fontFamily: T.body }}>{s.name}</div>
                      {s.notes && <div style={{ fontSize: 12, color: "#666", fontFamily: T.body }}>{s.notes}</div>}
                    </div>
                  </div>
                ))}
                <button onClick={() => onNavigateTo("shotplanner")} style={{
                  width: "100%", padding: "14px", background: "none", border: "1px solid #222",
                  borderRadius: 12, color: "#888", fontSize: 13, cursor: "pointer", fontFamily: T.body, marginTop: 4,
                }}>+ Edit Shot List</button>
              </div>
            )}
          </div>
        )}

        {/* NOTES TAB */}
        {tab === "notes" && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontFamily: T.body }}>Director's Notes</div>
            <textarea value={notes} onChange={e => saveNotes(e.target.value)}
              placeholder={"Write anything here...\n\nReferences, ideas, client notes, set requirements, what you want the viewer to feel..."}
              rows={14}
              style={{ width: "100%", background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "16px", color: "#E8E0D0", fontSize: 14, outline: "none", fontFamily: T.body, boxSizing: "border-box", resize: "none", lineHeight: 1.8 }} />
            <div style={{ fontSize: 11, color: "#333", marginTop: 8, fontFamily: T.body, textAlign: "right" }}>Auto-saved</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PROJECTS SCREEN ────────────────────────────────────────
function ProjectsScreen({ onOpenProject, onNavigateTo }) {
  const [projects, setProjects] = useState(loadProjects);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIndustry, setNewIndustry] = useState("Fashion");

  const createProject = () => {
    if (!newName.trim()) return;
    const proj = {
      id: Date.now().toString(),
      name: newName.trim(),
      industry: newIndustry,
      mood: "",
      createdAt: new Date().toISOString(),
      brief: null, shots: [], notes: "", colorRef: "",
    };
    const all = [proj, ...loadProjects()];
    saveProjects(all);
    setProjects(all);
    setNewName("");
    setShowNew(false);
    onOpenProject(proj.id);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", paddingBottom: 120 }}>
      {/* Header */}
      <div style={{ padding: "52px 20px 24px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#444", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6, fontFamily: T.body }}>Director's Folders</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#E8E0D0", margin: 0, fontFamily: T.display, letterSpacing: -0.5 }}>Projects</h1>
          <button onClick={() => setShowNew(!showNew)} style={{
            background: showNew ? "#E8E0D0" : "none", border: "1px solid #333",
            borderRadius: 20, padding: "8px 16px", color: showNew ? "#0a0a0a" : "#E8E0D0",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.body,
          }}>
            {showNew ? "Cancel" : "+ New"}
          </button>
        </div>
      </div>

      {/* New Project Form */}
      {showNew && (
        <div style={{ margin: "16px 20px", background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "20px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontFamily: T.body }}>New Project</div>
          <input value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Project name..."
            style={{ width: "100%", background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", color: "#E8E0D0", fontSize: 15, outline: "none", fontFamily: T.body, boxSizing: "border-box", marginBottom: 14 }} />
          <div style={{ fontSize: 11, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: T.body }}>Industry</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {INDUSTRIES.map(i => (
              <button key={i} onClick={() => setNewIndustry(i)} style={{
                padding: "6px 14px", borderRadius: 20, border: `1px solid ${newIndustry === i ? "#E8E0D0" : "#222"}`,
                background: newIndustry === i ? "#E8E0D0" : "none",
                color: newIndustry === i ? "#0a0a0a" : "#666",
                fontSize: 12, cursor: "pointer", fontFamily: T.body, fontWeight: newIndustry === i ? 600 : 400,
              }}>{i}</button>
            ))}
          </div>
          <button onClick={createProject} style={{
            width: "100%", padding: "13px", background: "#E8E0D0", border: "none",
            borderRadius: 10, color: "#0a0a0a", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: T.body,
          }}>Create Project</button>
        </div>
      )}

      {/* Project Cards */}
      <div style={{ padding: "16px 20px 0" }}>
        {projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>◎</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#444", fontFamily: T.body, marginBottom: 8 }}>No projects yet</div>
            <div style={{ fontSize: 13, color: "#333", fontFamily: T.body }}>Create your first shoot folder above</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {projects.map((p) => {
              const hasBrief = !!p.brief;
              const hasShots = p.shots && p.shots.length > 0;
              const hasNotes = !!p.notes?.trim();
              return (
                <button key={p.id} onClick={() => onOpenProject(p.id)} style={{
                  background: "#0f0f0f", border: "1px solid #1a1a1a",
                  borderRadius: 16, padding: "20px", textAlign: "left", cursor: "pointer",
                  position: "relative", overflow: "hidden",
                }}>
                  {/* Film frame corners */}
                  {[["0","0","borderTop","borderLeft"],["0","0","borderTop","borderRight"],["auto","0","borderBottom","borderLeft"],["auto","0","borderBottom","borderRight"]].map(([t,b,b1,b2], i) => (
                    <div key={i} style={{ position: "absolute", width: 12, height: 12, top: i < 2 ? 10 : "auto", bottom: i >= 2 ? 10 : "auto", left: i % 2 === 0 ? 10 : "auto", right: i % 2 === 1 ? 10 : "auto", borderColor: "#2a2a2a", borderStyle: "solid", borderWidth: 0, [b1]: "1px", [b2]: "1px" }} />
                  ))}
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#444", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, fontFamily: T.body }}>
                    {p.industry} · {formatDate(p.createdAt)}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#E8E0D0", fontFamily: T.display, marginBottom: 14, letterSpacing: -0.3 }}>{p.name}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["✦", "Brief", hasBrief], ["▤", "Shots", hasShots], ["✎", "Notes", hasNotes]].map(([icon, label, has]) => (
                      <div key={label} style={{
                        display: "flex", alignItems: "center", gap: 4, padding: "4px 10px",
                        background: has ? "#1a1a1a" : "transparent",
                        border: `1px solid ${has ? "#2a2a2a" : "#141414"}`,
                        borderRadius: 20,
                      }}>
                        <span style={{ fontSize: 10, color: has ? "#888" : "#2a2a2a" }}>{icon}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: has ? "#888" : "#2a2a2a", fontFamily: T.body, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── BOTTOM NAV ─────────────────────────────────────────────
function BottomNav({ active, onNav, darkMode }) {
  const items = [
    { id: "home", icon: "⌂", label: "Home" },
    { id: "engine", icon: "✦", label: "Story" },
    { id: "projects", icon: "◫", label: "Projects" },
    { id: "lighting", icon: "◐", label: "Light" },
    { id: "lens", icon: "◎", label: "Lens" },
  ];
  const bg = darkMode ? "rgba(10,10,10,0.95)" : "rgba(255,255,255,0.92)";
  const borderCol = darkMode ? "#1a1a1a" : C.border;
  const activeCol = darkMode ? "#E8E0D0" : C.black;
  const inactiveCol = darkMode ? "#333" : C.dim;
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
      background: bg, borderTop: `1px solid ${borderCol}`,
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      display: "flex", justifyContent: "space-around", padding: "10px 0 20px", zIndex: 100,
    }}>
      {items.map(item => (
        <button key={item.id} onClick={() => onNav(item.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "0 6px",
        }}>
          <span style={{ fontSize: 17, color: active === item.id ? activeCol : inactiveCol }}>{item.icon}</span>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.3, color: active === item.id ? activeCol : inactiveCol, fontFamily: T.body, textTransform: "uppercase" }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [openProjectId, setOpenProjectId] = useState(null);
  const [saveModal, setSaveModal] = useState(null); // { type, data }
  const [savedToProjectId, setSavedToProjectId] = useState(null);

  const darkScreens = ["projects", "projectroom"];
  const isDark = darkScreens.includes(screen);

  const handleSaveBrief = (brief) => setSaveModal({ type: "brief", data: brief });
  const handleSaveShots = (shots) => setSaveModal({ type: "shots", data: shots });

  const handleSaved = (projectId) => {
    setSaveModal(null);
    setSavedToProjectId(projectId);
    setTimeout(() => setSavedToProjectId(null), 2000);
  };

  const navigateTo = (s) => setScreen(s);

  const renderScreen = () => {
    if (screen === "projectroom" && openProjectId) {
      return <ProjectRoom projectId={openProjectId} onBack={() => setScreen("projects")} onNavigateTo={navigateTo} />;
    }
    switch (screen) {
      case "engine": return <StoryEngine onBack={() => setScreen("home")} onSaveBrief={handleSaveBrief} />;
      case "lighting": return <LightingBible onBack={() => setScreen("home")} />;
      case "lens": return <LensGuide onBack={() => setScreen("home")} />;
      case "composition": return <CompositionLib onBack={() => setScreen("home")} />;
      case "shotplanner": return <ShotPlanner onBack={() => setScreen("home")} onSaveShots={handleSaveShots} />;
      case "colorgrade": return <ColorGrade onBack={() => setScreen("home")} />;
      case "settings": return <SettingsScreen onBack={() => setScreen("home")} />;
      default: return <HomeScreen onNavigate={setScreen} />;    }
  };

  return (
    <div style={{ background: isDark ? "#0a0a0a" : C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      {renderScreen()}
      {savedToProjectId && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#1a1a1a", border: "1px solid #333", borderRadius: 20, padding: "10px 20px", zIndex: 300, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#E8E0D0", fontFamily: T.body, fontWeight: 600 }}>✓ Saved to project</span>
        </div>
      )}
      {saveModal && (
        <SaveToProjectModal
          type={saveModal.type}
          data={saveModal.data}
          onSave={handleSaved}
          onClose={() => setSaveModal(null)}
        />
      )}
      <BottomNav active={screen === "projectroom" ? "projects" : screen} onNav={setScreen} darkMode={isDark} />
    </div>
  );
}
