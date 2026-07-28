# Design System (v2 — Dark Theme)
## EM's Burgers — Website Mockup

**Supersedes the earlier light/cream `design.md`.** The client's real signage and marketing photography (neon shop sign, "THE GOOD DECISION" poster, in-store cricket-night photo) show a darker, moodier, more confident brand than the earlier pastel-cafe direction — closer to a stylish neighborhood burger-and-cricket pub than a "cute" daytime cafe. This version rebuilds the palette and type direction from what's actually in the client's photography rather than from the logo file alone.

Colors below were sampled directly from the three reference images supplied (neon signage, poster, in-store photo) — not invented — so they should match the real signage closely.

---

## 1. Color palette (sampled from actual brand photography)

| Token | Hex | Sampled from | Usage |
|---|---|---|---|
| `--color-bg` (Near-black) | `#0B0704` | Background of neon sign photo & poster backdrop | Page background, nav bar, footer — the dominant surface |
| `--color-surface` (Espresso) | `#1C0F09` | Shadow areas around the neon sign box | Elevated cards, panels, dashboard tiles — one step up from page background |
| `--color-red` (Ember Red) | `#B7301A` | In-store wall paint behind the "BUILT TO HIT" sign | Section backgrounds, primary buttons, dividers, brand badge — the dominant *color* (not the background) |
| `--color-amber` (Neon Amber) | `#F2A020` | Glowing neon tube color in "EM'S CHEMBUR" sign & "BUILT TO HIT" sign | Primary accent — CTAs, headline highlights, loyalty badges, neon-glow treatments |
| `--color-cream` (Warm White) | `#F5EDE0` | Poster title text | Primary text on dark backgrounds — warm off-white, never stark `#FFFFFF` |
| `--color-muted` (Ash) | `#B8ACA0` | — | Secondary/body text on dark backgrounds, captions, metadata |

**Usage rule (flipped from v1):** dark near-black now carries the *majority* of the UI as the base surface. Ember red is the dominant brand color for blocks/sections (nav, banners, footer, buttons) — not a background wash across the whole page. Neon amber is still an accent, but a **brighter, more electric one** than the old mustard — it should genuinely glow (see §5 glow spec), because that's what the real signage does.

Do not reintroduce the old light cream-dominant palette from v1 — this is a full swap, not a lightening.

---

## 2. Typography

The client's own photography uses two distinct type registers — a soft rounded logotype for the wordmark itself, and a bold, high-impact condensed poster face for everything else. Match both:

- **Logo/wordmark:** the "EM'S" mark is a chunky, rounded, tube-like custom lettering (as seen in the neon sign) — **treat this as a fixed logo asset**, don't try to recreate it in a system font. Use the supplied logo file/SVG as-is.
- **Display/hero headings:** the poster's "DECISION" treatment is a heavy, condensed, high-contrast poster face — this is the new headline register. Use **Anton**, **Archivo Black**, or **Bebas Neue** (all free on Google Fonts) for H1/hero moments and big statement text. This should feel like a poster or a stadium jumbotron, not a soft app UI.
- **Secondary headings (H2/H3):** a slightly softer bold sans so every heading isn't shouting — **Poppins SemiBold/Bold** or **Montserrat Bold** works well as a bridge between the poster face and body text.
- **Body text:** clean, highly legible sans on dark backgrounds — **Inter** or **Work Sans**, set in `--color-muted` or `--color-cream`, never pure white.
- **Tagline/badge text** (e.g. "BUILT TO HIT," "CHEMBUR"): condensed bold caps with slight letter-spacing, matching the sign's sub-line — pairs well with Bebas Neue or Oswald.
- **Scale:** H1 44–64px (bigger than v1 — poster headlines want room to breathe) / H2 28–34px / H3 20–24px / Body 16px / Small 13–14px. Mobile scales down ~20%.

---

## 3. Logo & signage treatment

- Primary logo: the rounded "EM'S" burger-bun mark + "CHEMBUR" sub-line, as supplied — amber-on-dark, matching the neon sign exactly.
- Keep the logo's neon-glow quality when placed on dark backgrounds: a soft outer glow in `--color-amber` at low opacity (see §5) rather than a flat drop shadow.
- On red (`--color-red`) backgrounds, the logo can sit in cream or amber, matching the in-store sign-on-wall photo.
- Maintain clear space equal to the height of the bun icon. Do not recolor outside the established palette; do not stretch or skew.
- Secondary badge mark: a small circular patch badge (seen on the jersey in the poster photo) can be adapted as a loyalty/reward badge motif — round, bordered, embroidered-patch feel.

---

## 4. Imagery style

- **Moody, cinematic, high-contrast food and lifestyle photography** — this is the biggest shift from v1. Reference: the "THE GOOD DECISION" poster (shallow depth of field, single warm light source, dramatic falloff to black) and the in-store cricket-night shot (Edison-bulb warmth, red wall, glowing signage, a lived-in pub energy).
- Food shots: glossy, close, dramatic single-source lighting (not bright/flat daylight food photography) — the burger should look like it's lit by the same warm bulbs as the room.
- Lifestyle/ambience shots: real moments — friends watching a match, string/Edison bulbs, neon glow reflected on surfaces, a bit of grain — not sterile stock photography.
- Sports/culture Easter eggs are on-brand (the client's own material references cricket/IPL culture — "Built to Hit") — occasional playful nods here fit, but shouldn't overwhelm the food-first focus.
- Until real photography is supplied for pages beyond what's already provided, use placeholder images graded to match this darker, warmer mood (not the brighter placeholders implied in v1) and still clearly labeled "sample image."

---

## 5. UI components (dark theme)

- **Buttons:** pill-shaped (rounded-full) as before, but now: amber fill + near-black text as primary (the "glowing" CTA), or outlined amber-on-transparent as secondary. Primary buttons get a subtle outer glow (`box-shadow: 0 0 20px rgba(242,160,32,0.35)`) to echo the neon signage — this is the one place glow effects are encouraged.
- **Cards** (menu items, dashboard tiles): `--color-surface` background (not pure black, not cream), soft rounded corners (16–20px), a thin `--color-red` or amber hairline border instead of a drop shadow — shadows read poorly on dark UI, borders/glow read better.
- **Loyalty punch card:** dark surface base; filled slots in neon amber with a glow; empty slots outlined in muted ash on the dark surface; the 10th "free" slot gets the strongest glow + a small badge, echoing the jersey patch motif from §3.
- **Nav bar:** near-black or ember-red background, amber or cream logo + links, mobile menu expands as a dark full-screen overlay with amber highlights — not a light overlay.
- **Dividers/section breaks:** thin amber or red glowing hairlines work well against the dark background in place of the heavier color-block dividers used in v1.

---

## 6. Layout & spacing

- Generous whitespace still applies, but "whitespace" here reads as **generous dark space** — let the near-black background breathe around glowing elements rather than filling it with color blocks (dark backgrounds get visually heavy fast if over-filled).
- Rounded corners throughout, matching the logo's soft lettering — unchanged from v1.
- Grid: 12-column desktop, single column mobile; menu items 3-column desktop, 1-column mobile — unchanged from v1.
- Use amber/red glow sparingly as a spotlight technique — one glowing focal point per section (a CTA, a badge, a hero image edge) rather than glow everywhere, or it stops reading as special.

---

## 7. Tone of voice

- Still fun and a little cheeky, but now with a touch more **swagger/confidence** to match the poster's bold "THE GOOD DECISION" framing and the cricket-night energy — think stadium hype, not just cafe cuteness.
- Short, punchy sentences over long descriptive copy — unchanged.
- Avoid generic fast-food language ("delicious," "tasty") in favor of specific, playful, slightly bold descriptions — unchanged from v1, just delivered with more confidence.

---

**Note:** this palette was sampled directly from the client's supplied signage/poster/in-store photos, so it should already be close to the real brand — but exact hex values and final photography direction should still be confirmed with the client before production.
