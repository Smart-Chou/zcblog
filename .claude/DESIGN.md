---
name: "Marx's Blog"
description: "A developer's personal blog — warm editorial craft with playful personality, built on Astro."
colors:
  vermillion: "#c2413b"
  vermillion-deep: "#8b3a36"
  vermillion-dark: "#e8736a"
  vermillion-dark-glow: "#f0a8a2"
  warm-paper-bg: "#fbf8f4"
  warm-paper-surface: "#fffcf8"
  warm-paper-secondary: "#f3eee7"
  warm-paper-hover: "#f5f1ea"
  charcoal-ink: "#2d2822"
  charcoal-heading: "#1a1714"
  charcoal-muted: "#635d59"
  charcoal-dimmed: "#736d67"
  dark-charcoal-bg: "#1c1917"
  dark-charcoal-surface: "#262220"
  dark-charcoal-secondary: "#302b28"
  dark-charcoal-hover: "#2d2a27"
  warm-ink: "#e8e3de"
  warm-ink-heading: "#faf7f2"
  warm-ink-muted: "#a8a19b"
  warm-ink-dimmed: "#938c85"
  border-light: "rgba(45, 40, 34, 0.12)"
  border-dark: "rgba(232, 227, 222, 0.14)"
  code-bg: "#ece4d9"
  code-bg-dark: "#403930"
  selection-light: "#fde8e5"
  selection-dark: "#3d1815"
  success: "#4d7c4d"
  warning: "#b0803c"
  error: "#c2413b"
typography:
  display:
    fontFamily: "DM Serif Display, Playfair Display, Georgia, Times New Roman, Source Han Serif SC, Noto Serif CJK SC, serif"
    fontSize: "var(--text-4xl)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "DM Serif Display, Playfair Display, Georgia, Times New Roman, Source Han Serif SC, Noto Serif CJK SC, serif"
    fontSize: "var(--text-3xl)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "DM Serif Display, Playfair Display, Georgia, Times New Roman, Source Han Serif SC, Noto Serif CJK SC, serif"
    fontSize: "var(--text-2xl)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, Source Han Sans SC, Noto Sans CJK SC, Sarasa Gothic SC, Microsoft YaHei, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "DM Sans, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, Source Han Sans SC, Noto Sans CJK SC, Sarasa Gothic SC, Microsoft YaHei, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.05em"
  mono:
    fontFamily: "JetBrains Mono, IBM Plex Mono, Ubuntu Mono, Consolas, Liberation Mono, Menlo, monospace"
    fontSize: "0.9em"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "2px"
  md: "4px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  "2xs": "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
  "3xl": "64px"
components:
  button-primary:
    backgroundColor: "{colors.vermillion}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.vermillion-deep}"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.vermillion}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.vermillion}"
    textColor: "#ffffff"
  tag-chip:
    backgroundColor: "{colors.warm-paper-bg}"
    textColor: "{colors.charcoal-muted}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
  tag-chip-hover:
    textColor: "{colors.vermillion}"
  content-box:
    backgroundColor: "{colors.warm-paper-surface}"
    rounded: "{rounded.md}"
    padding: "var(--space)"
---

# Design System: Marx's Blog

> **同步约定**：本文件（含 frontmatter 令牌定义）与 `src/styles/variables.css` 保持同步——修改设计 token 后请回来更新此处数值。最近校准：2026-10-06。

## 1. Overview

**Creative North Star: "The Worn Notebook"**

A developer's well-loved notebook — ink-stained, dog-eared, warm from use. Not precious, not polished. The blog feels like a familiar object handed to a friend, not a publication pushed through a CMS. Vermillion ink on warm paper; serif headlines that speak rather than shout; generous whitespace that invites lingering. Dark mode is the same notebook read by lamplight — the paper deepens to charcoal, the ink lifts to warm white, the vermillion glows softer.

The system is editorial without stiffness, playful without chaos. Emojis live in navigation alongside serif headings. Code blocks sit in tinted containers, not cold gray boxes. Every surface earns its place — no card grids for card-grid's sake, no decoration that doesn't serve reading.

This system explicitly rejects: corporate SaaS blog aesthetics (blue/white, stock photos, marketing CTAs), platform-generic reading experiences (Medium/Dev.to chrome), and overdesigned portfolio flexes (excessive scroll animations, form over function). It is a personal space first, a blog second, and a design object only incidentally.

**Key Characteristics:**
- Vermillion accent carries the personality; used sparingly on ≤10% of any surface
- Serif headings + sans body = editorial warmth without preciousness
- Tinted warm-paper surfaces replace generic white/gray
- Subtle shadows with border treatments create magazine-like depth
- Dark mode is a first-class citizen, not an afterthought
- Motion is restrained — state transitions and gentle lift on hover, nothing choreographed

## 2. Colors

The palette is built around a single saturated accent (Vermillion) against a family of warm-tinted neutrals (Warm Paper → Charcoal Ink). Light mode reads as ink on paper; dark mode inverts to warm light on deep charcoal. The accent is the only saturated color on most surfaces; its rarity is the point.

### Primary

- **Vermillion** (#c2413b / dark: #e8736a): The accent. Used for links, primary buttons, selection highlights, active nav states, and the PWA theme color. Appears on ≤10% of any given screen. In dark mode it shifts lighter and warmer to maintain visibility against dark surfaces.
- **Vermillion Deep** (#8b3a36 / dark: #f0a8a2): Inline code color. A muted, darker red that reads as "accent-adjacent" without competing with links.
- **Selection** (#fde8e5 / dark: #3d1815): Text selection highlight. A very light tint (light mode) or deep saturated background (dark mode).

### Neutral

- **Warm Paper BG** (#fbf8f4 / dark: #1c1917): Page background. A near-white with the faintest warmth — not cream, not gray. In dark mode: deep warm charcoal.
- **Warm Paper Surface** (#fffcf8 / dark: #262220): Card and container backgrounds. One step lighter than the page bg in light mode; one step lighter than the page bg in dark mode.
- **Warm Paper Secondary** (#f3eee7 / dark: #302b28): Secondary surfaces — section tints and secondary hover states.
- **Code BG** (#ece4d9 / dark: #403930): Inline-code chips and table headers. Must stay clearly distinguishable from Warm Paper Surface — contrast ≥1.2 in light mode, ≥1.35 in dark mode (baseline tuned 2026-10; below this the chip visually disappears).
- **Warm Paper Hover** (#f5f1ea / dark: #2d2a27): Interactive hover background for light surfaces.
- **Charcoal Ink** (#2d2822 / dark: #e8e3de): Body text. Dark brown-charcoal, not pure black — softer on the eyes. Dark mode: warm off-white.
- **Charcoal Heading** (#1a1714 / dark: #faf7f2): Headings and titles. Deeper than body text for clear hierarchy.
- **Charcoal Muted** (#635d59 / dark: #a8a19b): Secondary text — meta information, captions, dates.
- **Charcoal Dimmed** (#736d67 / dark: #938c85): Tertiary text — placeholders, disabled states, the quietest text on the page.
- **Border** (rgba(45,40,34,0.12) / dark: rgba(232,227,222,0.14)): Semitransparent borders. Uses the body text color at 12% (light) / 14% (dark) opacity so it harmonizes automatically across modes.

### Semantic

- **Success** (#4d7c4d): Positive states, completion indicators.
- **Warning** (#b0803c): Caution states, deprecation notices.
- **Error** (#c2413b): Error states — reuses Vermillion to keep the palette small.

### Named Rules

**The One Accent Rule.** Vermillion is the only saturated color on content surfaces. Its power comes from scarcity — if every element competes for attention, nothing is emphasized. A page with zero vermillion should still feel complete; the accent is spice, not structure.

**The Ink-and-Paper Rule.** Light mode is dark ink on light paper; dark mode is light ink on dark paper. Text colors are always derived from the paper tone, not from a generic gray ramp. This is why body text is warm charcoal (#2d2822), not #333.

## 3. Typography

**Display Font:** DM Serif Display (with Playfair Display, Georgia, Times New Roman, Source Han Serif SC, Noto Serif CJK SC fallbacks)
**Body Font:** DM Sans (with Inter, system sans-serif, Source Han Sans SC, Noto Sans CJK SC fallbacks)
**Mono Font:** JetBrains Mono (with IBM Plex Mono, Ubuntu Mono, Consolas fallbacks)

**Character:** A classic editorial pairing — serif for authority and warmth, humanist sans for readability. The serif carries the personality; the sans gets out of the way. Both families feel contemporary, not museum-piece. CJK fallbacks preserve the editorial character for Chinese readers. The mono stack prioritizes coding comfort with ligature-rich JetBrains Mono.

### Hierarchy

- **Display** (700, 36px / 30px mobile, 1.3): H1 — article titles, page heroes. The loudest voice on the page. Always serif, always bold.
- **Headline** (600, 30px / 24px mobile, 1.3): H2 — major section breaks within content. Serif.
- **Title** (600, 24px / 20px mobile, 1.3): H3 — subsection headings, card titles. Serif.
- **Heading 4** (600, 20px / 18px mobile, 1.3): H4 — nested headings. Serif.
- **Label Heading** (600, 18px, 1.3): H5 — the smallest heading tier. Sans-serif, uppercase, tracked at 0.05em. Used for metadata labels, not content hierarchy.
- **Body** (400, 16px, 1.75): Paragraphs, lists, table cells. Max line length 65-75ch on desktop. Sans-serif.
- **Small Body** (400, 14px / 12px, 1.75): Captions, meta, footnotes. Sans-serif.
- **Mono** (400, 0.9em, 1.5): Code blocks and inline code. Monospace.

### Named Rules

**The Two-Font Rule.** Serif for headings, sans for body, mono for code. Never introduce a fourth family. The pairing works because the contrast is strong — if the fonts were closer (two sans-serifs, two serifs), the system would read as indecisive rather than deliberate.

**The Scale Integrity Rule.** The type scale is a 1.25 Major Third (12 → 14 → 16 → 18 → 20 → 24 → 30 → 36). Never insert a size between these steps. If a heading feels too large or too small, the problem is the step assignment, not the scale.

## 4. Elevation

**Layered Editorial.** Depth is conveyed through a combination of subtle shadows and border treatments — like the layers of a printed magazine spread where paper weight, ink density, and physical overlap create hierarchy. Surfaces at rest carry a light ambient shadow (shadow-sm) and a 1px semitransparent border. Interactive surfaces lift on hover with a deeper shadow (shadow-lg) and a subtle translateY. The border remains present at all elevations, grounding each layer in the paper metaphor.

There is no "flat" mode and no "floating" mode — every surface sits somewhere on the editorial depth stack. The border is the constant; the shadow is the variable.

### Shadow Vocabulary

- **Ambient** (`0 1px 2px 0 rgba(0,0,0,0.04)`): The baseline. Applied to content boxes and cards at rest. Barely perceptible; its job is to distinguish surface from background, not to "lift."
- **Subtle** (`0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.03)`): Slightly more presence. Used for the navigation pill at rest.
- **Medium** (`0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.03)`): Dropdown panels, the nav pill when scrolled.
- **Deep** (`0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -4px rgba(0,0,0,0.03)`): Card hover state. The deepest regular-use shadow.
- **Heavy** (`0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.03)`): Reserved for modals, toasts — surfaces that must read as "above everything."

### Named Rules

**The Border Ground Rule.** Every elevated surface has a 1px border matching the page's text color at 12% (light) / 14% (dark) opacity. The border is what makes the surface feel like paper, not like a CSS box. Remove the border and the surface floats untethered; add a heavier border and it becomes a button. These ratios are fixed — don't adjust them per surface.

## 5. Components

### Buttons

- **Shape:** Rounded-rectangle with 8px radius (--radius-lg). Clean, contemporary, confident.
- **Primary:** Vermillion background (#c2413b), white text, 12px 24px padding. 2px transparent border for consistent sizing with secondary.
- **Secondary:** Transparent background, Vermillion border and text. On hover: fills to Vermillion, text becomes white.
- **Hover:** Both variants lift 2px on translateY with a custom box-shadow (0 4px 12px rgba(0,0,0,0.15)). Transition is 300ms ease-out.
- **Typography:** 500 weight, 16px, DM Sans. Never uppercase; the blog's voice is conversational, not commanding.

### Cards / Containers

- **Content Box:** The primary content container. Warm Paper Surface background, 1px border, 4px radius (--radius), ambient shadow. Padding is --space (56px desktop, scales down on mobile). Used for article bodies, page sections, archive lists.
- **Post Card:** Article preview card in lists. Same surface color and border as content box. On hover: lifts 3px (translateY) and deepens to shadow-lg. Contains a 12:5 aspect-ratio cover image, serif title, and positioned full-card link. Content-visibility: auto for render performance on long lists.
- **No nested cards.** A card inside a card is always wrong for this system. If content needs grouping inside a surface, use spacing and typographic hierarchy, not another bordered box.

### Chips / Tags

- **Style:** Warm Paper BG background, Charcoal Muted text, 1px border, 4px radius, 4px 12px padding. Font size 0.8em (≈13px).
- **Hover:** Text shifts to Vermillion, border shifts to Vermillion. No background change — the border and text carry the state.
- **Usage:** Article tags, filter pills, category indicators. Never use as primary actions (that's what buttons are for).

### Navigation

- **Nav Shell:** The fixed header pill. 72px tall (52px mobile), 46px border-radius (pill shape), 92% opaque Warm Paper Surface background (color-mix for translucency), 1px border, medium shadow. Pads to 0 36px (16px mobile). Contains logo, search, language switcher, nav toggle, and theme toggle.
- **Nav Dropdown:** Fixed-position dropdown panel triggered by the hamburger toggle. 90% opaque surface with 24px backdrop-blur, 28px border-radius, deep shadow. Links are 1.05em, 600 weight, pill-shaped (10px radius) on hover with accent color shift. Active link is vermillion.
- **Nav Toggle (Hamburger):** Three 2px bars, 18px wide, 4px gap. Animate to X on open: top bar rotates 45°, middle fades, bottom rotates -45°. 0.3s transition.

### Named Rules

**The No Nested Cards Rule.** Cards may contain text, images, buttons, and chips. They may never contain other cards. If content hierarchy demands subdivision, use whitespace and typography — a ruled heading, a section gap, a background tint shift. Nested cards are the fastest path to the "dashboard made of boxes" anti-pattern.

**The Pill or Square Rule.** Interactive surfaces are either pill-shaped (nav shell: 46px radius, dropdown: 28px, nav links: 10px) or gently rounded (cards: 4px, buttons: 8px, chips: 4px). Never ship a sharp-cornered interactive element — 2px is the floor (inline code, code block corners). Sharp corners belong to print; this is a warm screen.

## 6. Do's and Don'ts

### Do:

- **Do** use Vermillion as the only saturated accent on content pages. One color carries the personality.
- **Do** keep body text at Charcoal Ink (#2d2822) on Warm Paper BG (#fbf8f4) — the warmth is in the undertone, not in reduced contrast.
- **Do** pair every elevated surface with a 1px semitransparent border. The border is the paper metaphor; without it, surfaces float.
- **Do** use DM Serif Display for all content headings (h1-h4). The pairing with DM Sans body is the system's signature.
- **Do** treat dark mode as a first-class surface — every color has a dark variant, every interactive state is tested in both modes.
- **Do** let content own the surface. Navigation, sidebars, and chrome recede; the reading experience leads.
- **Do** use emojis and casual language to carry the "playful" personality. The visual system is editorial; the voice is human.
- **Do** respect WCAG AA contrast minimums — body text ≥4.5:1, large text ≥3:1.

### Don't:

- **Don't** introduce a second saturated accent color. If you need another semantic color, use the existing Success (#4d7c4d) and Warning (#b0803c), or extend the neutral ramp.
- **Don't** use corporate SaaS patterns: blue/white palettes, stock photography, marketing CTAs, sanitized tone.
- **Don't** clone Medium/Dev.to reading experiences — this is a personal space, not a platform template.
- **Don't** add scroll-driven choreography or flashy entrance animations. Motion is restrained: state transitions, hover lifts, theme switches. Nothing that says "look what I can do."
- **Don't** nest cards inside cards. If you're about to, use whitespace and a heading instead.
- **Don't** use border-left or border-right greater than 1px as a colored accent stripe on any element. Use full borders, background tints, or leading markers instead.
- **Don't** use gradient text (background-clip: text). Emphasis comes from weight, size, or color — never from a gradient fill.
- **Don't** add a fourth font family. Serif headings + sans body + mono code = the complete set.
- **Don't** use the hero-metric template (big number, small label, gradient accent). This is a blog, not a SaaS dashboard.
- **Don't** let gray text on tinted backgrounds go unchecked. Muted text on Warm Paper must still clear 4.5:1 contrast — if it's close, bump toward Charcoal Ink.
