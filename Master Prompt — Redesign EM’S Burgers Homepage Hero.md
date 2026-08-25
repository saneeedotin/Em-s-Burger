# MASTER PROMPT — EM’S BURGERS HOMEPAGE REDESIGN

You are working on the existing **EM’S Burgers • Chembur** website.

I am providing you with:
1. Our existing homepage/current implementation.
2. The conversation/context explaining the redesign direction.
3. A visual reference image showing the target design direction.
4. The existing hero image asset containing the burger.

Your job is to **redesign the homepage hero section of the existing website to match the quality, composition, energy, and visual sophistication of the reference design**, while keeping the existing brand identity and preserving all existing functionality.

Do not treat this as a request to build a completely different website. This is a **premium redesign of the existing homepage**, not a rebuild of the business logic.

---

## 1. PRIMARY OBJECTIVE

Transform the current homepage from a relatively conventional/card-based restaurant hero into a **high-end, AWWWARDS-inspired restaurant landing page hero**.

The final result should feel:

- bold
- premium
- editorial
- energetic
- playful
- highly branded
- visually immersive
- modern
- polished
- conversion-focused
- intentionally designed rather than template-driven

The design should look like a real premium restaurant brand website that could plausibly appear in an AWWWARDS portfolio.

The reference image is the **visual direction**, not an instruction to reproduce every element literally.

---

# 2. MOST IMPORTANT DESIGN CHANGE

The current burger presentation uses a large bordered/card-like container.

**Remove that visual treatment.**

The burger must no longer look like:

> "an image sitting inside a card"

Instead, it must feel like:

> "the main hero object around which the entire composition is designed."

The burger should visually dominate the right side of the hero.

The page should read as:

**brand → typography → burger → supporting details**

rather than:

**navbar → text column → image card**

---

# 3. USE THE EXISTING BURGER ASSET CORRECTLY

The provided hero image contains:

- the EM’S logo
- the “MELT DOWN” typography
- the burger
- the red background

Do NOT simply place that complete image into the website.

The burger should be treated as an independent visual asset.

### Required treatment

Extract/use the burger as a **transparent-background cutout**.

Do NOT duplicate the following elements from the image:

- the baked-in EM’S logo
- the baked-in “MELT DOWN” text
- the baked-in red background

Those elements must instead be recreated as independent website layers/components.

If the current project already contains a suitable transparent burger asset, use it.

If the current asset is only available as a flattened image and the environment supports safe image processing, create/use a transparent burger cutout without damaging the burger.

**Do not redraw or replace the burger with a generic stock burger.**

The existing burger photography is one of the strongest elements of the brand and should remain visually faithful.

---

# 4. BRAND IDENTITY — DO NOT CHANGE THE CORE PALETTE

Preserve the existing EM’S visual identity.

Use the current:

- red/orange background
- cream/off-white typography
- yellow CTA/accent color
- green “Pure Veg” accent

Approximate palette direction:

```text
Red / Orange:
#E63B23

Cream:
#FFF0D2

Yellow:
#FFC400

Green:
#16C784
```

Do not radically introduce purple, blue, black-heavy layouts, gradients that change the brand identity, or unrelated colors.

Subtle tonal variation is acceptable, but the overall page must still immediately look like **EM’S Burgers**.

---

# 5. TYPOGRAPHY

Preserve the existing font style and personality.

The typography should remain:

- bold
- chunky
- slightly playful
- highly legible
- cream/off-white
- editorial and oversized

Do not replace the existing brand typography with a generic corporate font unless technically required.

The headline should become much more visually dominant than it currently is.

Target composition:

```text
BURGERS
BUILT TO
HIT.
```

with:

- `BURGERS` → cream
- `BUILT TO` → cream
- `HIT.` → yellow

The headline should feel like a major piece of graphic design, not normal website heading text.

Use responsive `clamp()` sizing or equivalent so it remains visually impressive across screen sizes.

Avoid excessive tracking.

Use a tight line-height.

The heading should occupy a substantial portion of the left side of the hero.

---

# 6. HERO LAYOUT

Use a strong two-part visual composition.

Desktop target:

```text
LEFT ~45%
RIGHT ~55%
```

Conceptually:

```text
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                              │
│                                                     │
│  BADGE                           MELT               │
│                                  DOWN               │
│  BURGERS                            🍔              │
│  BUILT TO                         🍔🍔🍔            │
│  HIT.                            🍔🍔🍔🍔            │
│                                  🍔🍔🍔🍔🍔          │
│                                                     │
│  DESCRIPTION                                        │
│                                                     │
│  [CTA] [SECONDARY CTA]              ◎ FRESH        │
│                                                     │
│  50K+       4.8★       100%                        │
└─────────────────────────────────────────────────────┘
```

The burger should extend naturally beyond the visual boundaries of the right column where appropriate.

Do not constrain it inside a small card.

Do not vertically center everything rigidly.

The composition should have intentional asymmetry and negative space.

---

# 7. BURGER SCALE

The burger should be significantly larger than in the current implementation.

On a typical ~1440px desktop viewport, target approximately:

```text
600–760px visual width
```

Use responsive sizing such as:

```css
width: min(52vw, 760px);
```

or the equivalent in the project's styling system.

The exact number should be adjusted based on the actual viewport and surrounding layout.

The burger must remain the visual focal point.

Do not make it so large that it hides the headline or causes uncontrolled overflow.

Use deliberate overflow where it enhances the composition.

---

# 8. BURGER DEPTH / LAYERING

Create depth through independent layers.

Recommended visual stacking:

```text
1. Background
2. Decorative background graphics
3. “MELT DOWN” background typography
4. Burger pedestal/stage
5. Burger image
6. Foreground badges / accents
```

The burger should appear **in front of** the “MELT DOWN” typography.

This is extremely important.

Conceptually:

```text
        MELT
        DOWN
           ↘
             🍔
           🍔🍔🍔
```

The typography should feel integrated into the composition rather than pasted into a box.

---

# 9. RECREATE “MELT DOWN” AS WEBSITE TYPOGRAPHY

Do not use the typography baked into the original image.

Create it using HTML/CSS/the project's existing typography system.

Place it behind the burger.

Use a darker/translucent variation of the red/brand palette so it has depth without becoming visually louder than the actual burger.

For example:

```css
color: rgba(110, 25, 15, 0.30–0.40);
```

The final result should create the impression that:

> the burger is literally sitting in front of giant “MELT DOWN” typography.

Do not use a bordered rectangular container around it.

---

# 10. HERO BADGE

Add a small premium/editorial badge above the headline.

Suggested copy:

**CHEMBUR’S MOST LOVED BURGER SPOT**

The badge can use a subtle heart/star/icon.

It should feel like a small editorial label, not a large UI component.

Use:

- cream border
- rounded pill
- compact typography
- subtle spacing

Do not over-emphasize it.

---

# 11. CTA BUTTONS

Preserve the existing CTA intent.

Primary CTA:

**EXPLORE FULL MENU →**

Secondary CTA:

**LOCATE EM’S**

The primary CTA should remain yellow.

The secondary CTA should use a transparent/outlined treatment.

The buttons should:

- have strong contrast
- feel tactile
- have rounded/pill shapes
- have subtle hover movement
- maintain excellent accessibility
- preserve existing click/navigation functionality

Do NOT change destinations or business logic unless the existing implementation is broken.

---

# 12. STATS ROW

Use the currently underutilized lower-left space to add a concise credibility row.

Target:

```text
50K+          4.8★          100%
Happy         Google        Pure Veg
Burgerheads   Rating        Promise
```

These should be secondary to the hero headline.

Use yellow for the primary numerical values and cream for supporting labels.

Add subtle dividers only if they improve the composition.

Do not create a large dashboard-like statistics section.

This should feel editorial and compact.

---

# 13. BURGER STAGE / PEDESTAL

Introduce a subtle visual stage underneath the burger.

The purpose is to give the burger:

- physical grounding
- depth
- hierarchy
- premium product-photography energy

The stage should be subtle.

Think:

```text
            🍔
          🍔🍔🍔
        🍔🍔🍔🍔

      ─────────────
         STAGE
```

It should not look like a literal 3D platform from a generic UI kit.

Use subtle gradients/shadows derived from the existing red/orange palette.

---

# 14. FLOATING MICRO-DETAILS

Add a few small decorative elements around the burger.

Examples:

### “MADE FRESH DAILY”

A small circular badge near the burger.

### “MELT MODE ON”

A small hand-drawn/burst-style badge with an arrow pointing toward the burger.

These details should create visual movement.

Do not add so many that the page becomes cluttered.

Every decorative element should serve composition.

---

# 15. BACKGROUND

Keep the current branded patterned background.

However:

**Make the pattern subtler than the current implementation.**

The food icons should be perceived as texture rather than competing content.

Use reduced opacity.

A subtle radial light/glow behind the burger is acceptable.

Example concept:

```css
background:
  radial-gradient(
    circle at 72% 45%,
    rgba(255, 130, 40, 0.25),
    transparent 35%
  ),
  #E63B23;
```

Adapt this to the existing design system.

---

# 16. NAVBAR

Do not completely redesign the navbar.

The current navbar already has a strong identity.

Keep the existing:

- EM’S logo
- navigation links
- Loyalty Club
- Pure Veg
- Login
- Order Online

Improve spacing, hierarchy, alignment, and polish where needed.

The navbar should become visually quieter than the hero.

The burger and headline must receive the majority of the visual attention.

Keep “Order Online” as the strongest navbar action.

---

# 17. REMOVE VISUAL CLUTTER

Audit the current hero and remove anything that feels like:

- unnecessary cards
- excessive borders
- redundant containers
- generic UI styling
- unnecessary boxes around imagery
- competing focal points

Especially remove the large rectangular burger container.

The page should feel more like an advertising campaign and less like a conventional restaurant template.

---

# 18. ANIMATION / INTERACTION

After the static composition is correct, introduce subtle premium motion.

Do NOT animate everything.

Recommended sequence on page load:

```text
1. Background appears
2. Navbar settles in
3. Hero badge fades/slides in
4. Headline reveals upward
5. Description appears
6. CTAs appear
7. Burger scales/fades into position
8. Decorative elements subtly reveal
9. Stats appear
```

The burger should feel like the hero reveal.

Use the animation library already present in the project.

If GSAP is already available, use it.

If GSAP is not available and adding it is reasonable, you may use it.

Otherwise use performant CSS transitions/keyframes.

---

# 19. MOUSE PARALLAX

On desktop, add a very subtle mouse-follow/parallax effect to the hero visual.

The burger can shift by a few pixels based on cursor position.

Keep this extremely subtle.

Example magnitude:

```text
±10–20px
```

Do not create nausea or excessive movement.

The effect should make the hero feel alive, not gimmicky.

Disable or reduce the effect on touch devices.

---

# 20. HOVER STATES

Buttons should have small, premium interactions.

For example:

- slight translateY
- subtle scale
- soft shadow increase
- arrow movement

Do not use huge bounce effects.

All interaction should feel intentional.

---

# 21. SCROLL INDICATOR

Add a minimal indicator near the bottom of the hero.

Example:

```text
01
SCROLL TO EXPLORE
↓
```

or another visually appropriate variation.

It should not compete with the main CTA.

---

# 22. RESPONSIVE BEHAVIOR

This is critical.

Do NOT simply shrink the desktop design.

### Desktop

Use the full editorial composition.

### Tablet

Stack/rebalance the hero while keeping the burger prominent.

### Mobile

Suggested order:

```text
LOGO / MOBILE NAV

BADGE

BURGERS
BUILT TO
HIT.

DESCRIPTION

BURGER IMAGE

PRIMARY CTA

SECONDARY CTA

STATS
```

The burger should remain a major visual.

The typography should remain large and bold.

The page should not feel cramped.

The “MELT DOWN” typography should scale appropriately or reposition behind the burger.

Decorative badges should be reduced or repositioned on smaller screens.

Mouse parallax must be disabled on touch devices.

---

# 23. ACCESSIBILITY

Preserve or improve:

- semantic HTML
- accessible button labels
- image alt text
- sufficient color contrast
- keyboard navigation
- focus states
- reduced-motion support

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

and significantly reduce/disable nonessential animation.

---

# 24. PERFORMANCE

Do not sacrifice page performance for visual effects.

Optimize:

- burger image dimensions
- image format
- loading behavior
- animations
- layout shifts
- unnecessary JavaScript

Do not introduce giant dependencies solely for decorative effects.

Avoid expensive continuous animations.

Prefer transform/opacity-based animations.

Avoid layout thrashing.

The hero should feel premium while remaining fast.

---

# 25. DO NOT BREAK EXISTING FUNCTIONALITY

This is a redesign, not a functional rewrite.

Before modifying anything:

- inspect the existing project structure
- understand the current hero component
- identify existing routes
- identify existing navigation
- identify buttons and their destinations
- identify responsive behavior
- identify existing design tokens/components
- identify any existing animation framework
- identify the source of the logo/font/assets

Preserve all working functionality.

Do not introduce fake links.

Do not replace functional components with static placeholders.

Do not remove working sections from the homepage unless explicitly required.

Do not rewrite backend logic.

Do not change business data.

---

# 26. REUSE EXISTING COMPONENTS WHERE APPROPRIATE

Do not duplicate existing:

- navbar
- buttons
- typography components
- design tokens
- icon components
- responsive utilities

Reuse the project's architecture whenever possible.

Only create new components where the redesign genuinely requires them.

Keep the implementation maintainable.

---

# 27. IMPORTANT — DO NOT HARDCODE THE SCREENSHOT

The reference image is a design target.

Do NOT attempt to reproduce the screenshot using:

- one giant background image
- canvas
- dozens of absolute-positioned text fragments
- manually positioned pixels
- screenshot-as-UI
- an iframe
- image overlays that replace actual HTML content

The final hero must be a real responsive webpage.

The design should be recreated using:

- HTML/components
- CSS/Tailwind/etc.
- actual image assets
- SVGs where appropriate
- actual buttons and links
- proper responsive layouts

---

# 28. DESIGN PRIORITY ORDER

When making design decisions, prioritize in this exact order:

1. Brand identity
2. Burger photography
3. Hero headline
4. Overall composition
5. CTA visibility
6. Readability
7. Depth/layering
8. Supporting details
9. Animation
10. Decorative extras

Do not sacrifice the first seven for decorative effects.

---

# 29. VISUAL QUALITY BAR

Before considering the redesign complete, compare the implementation visually against the provided reference.

Ask:

### Does the burger feel like the hero?

### Is the burger larger and more dominant than before?

### Has the old card/container feeling disappeared?

### Does the headline feel like a piece of graphic design?

### Does the page still unmistakably feel like EM’S Burgers?

### Is there a strong left/right composition?

### Is there enough negative space?

### Does “MELT DOWN” interact with the burger instead of sitting inside a card?

### Do the floating badges add energy without clutter?

### Does the hero feel premium even before animation?

### Does it still work beautifully at tablet and mobile widths?

If the answer to any of these is no, keep iterating.

---

# 30. IMPLEMENTATION PROCESS

Work in this sequence.

## Phase 1 — Audit

Inspect the existing project and identify:

- framework
- entry point
- homepage component
- navbar component
- hero component
- image assets
- fonts
- styling system
- animation library
- responsive breakpoints

Do not modify anything yet.

## Phase 2 — Structural redesign

Rebuild the hero composition into:

```text
Navbar
Hero
 ├── HeroContent
 │    ├── Badge
 │    ├── Heading
 │    ├── Description
 │    ├── CTAs
 │    └── Stats
 │
 └── HeroVisual
      ├── MeltText
      ├── BurgerStage
      ├── Burger
      ├── MeltBadge
      └── FreshBadge
```

## Phase 3 — Asset treatment

Separate the burger from the flattened poster asset where necessary.

Ensure transparent edges are clean.

## Phase 4 — Visual styling

Match the provided reference's:

- scale
- spacing
- typography hierarchy
- depth
- composition
- color relationships

while keeping EM’S branding.

## Phase 5 — Responsive implementation

Tune desktop, tablet and mobile independently.

## Phase 6 — Interaction

Add the subtle motion and hover behavior.

## Phase 7 — QA

Test:

- desktop
- laptop
- tablet
- mobile
- keyboard
- reduced motion
- slow network
- image loading
- button functionality

---

# 31. DO NOT STOP AFTER THE FIRST PASS

The first implementation is not automatically considered finished.

After implementation:

1. Run the project.
2. Inspect the actual rendered page.
3. Compare it visually to the provided reference.
4. Identify spacing, scale, alignment, hierarchy, and overflow issues.
5. Fix them.
6. Check responsive layouts.
7. Re-render.
8. Repeat until the composition is genuinely polished.

Do not simply say “implemented successfully.”

Actually inspect the result.

---

# 32. FINAL TARGET

The final homepage hero should feel like this:

```text
EM'S BURGERS
+
EDITORIAL TYPOGRAPHY
+
GIANT BURGER PHOTOGRAPHY
+
PLAYFUL FOOD BRANDING
+
SUBTLE MOTION
+
PREMIUM COMPOSITION
```

It should feel:

**bold enough to stop the scroll,**

**clean enough to feel premium,**

**playful enough to feel like EM’S,**

and

**polished enough to look portfolio/AWWWARDS-worthy.**

The final result must be a **real responsive production-ready webpage**, not a visual mockup.

Use the attached reference image as the visual north star and the attached/current website as the functional source of truth.