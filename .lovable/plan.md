# INSPIRE OKLAHOMA CITY -- Complete Rebrand and Redesign

## Vision

Transform "Social Singles OKC" into **Inspire Oklahoma City** -- a multi-vertical community platform to cure isolation. Not just dating, but fitness, faith, LGBTQ+, general meetups, and personal training. All wrapped in a world-class **Brutal Skeuomorphism 2.0 / Neo-Brutalist** design system with zero gradients, zero defaults, zero premium/glass effects.

---

## Phase 1: Brand Rename (All Touchpoints)

Every reference to "Social Singles OKC", "SSOKC", "" gets replaced with  **Inspire Oklahoma City**.

### Files to update:


| File                                        | What changes                                                                           |
| ------------------------------------------- | -------------------------------------------------------------------------------------- |
| `index.html`                                | Title, meta tags, OG tags -- all become "Inspire Oklahoma City"                        |
| `src/pages/Landing.tsx`                     | "SOCIAL SINGLES OKC" -> "INSPIRE OKLAHOMA CITY", remove TLC references                 |
| `src/components/brand/FloatingLogo.tsx`     | "SOCIAL SINGLES" -> "INSPIRE", "OKC" stays, tagline becomes "Cure Isolation. Get Out." |
| `src/components/brand/TLCBadge.tsx`         | Remove or rebrand to "Inspire OKC" attribution                                         |
| `src/components/brand/TLCWatermark.tsx`     | Update watermark text                                                                  |
| `src/components/layout/Footer.tsx`          | "SOCIAL SINGLES OKC" -> "INSPIRE OKC", remove TLC                                      |
| `src/components/layout/RoleBasedNavbar.tsx` | Brand logo text "SSOKC" -> "INSPIRE"                                                   |
| `src/components/BrandedSplash.tsx`          | Update splash text                                                                     |
| `src/pages/Auth.tsx`                        | Remove TLC badges, update copy                                                         |
| `src/pages/Social.tsx`                      | Complete rebrand of hero, features, copy                                               |


---

## Phase 2: Login-First Architecture

Currently: Landing -> Social -> Auth (optional). 

New flow: `**/` = Auth (login/signup)** -> After login -> `/explore` (the main hub).

### Route changes in `App.tsx`:

- `/` -> Auth page (login first)
- `/explore` -> New main hub (replaces `/social`)  
- Landing page becomes optional marketing at `/about`
- All other routes stay protected

---

## Phase 3: Multi-Vertical Community Channels

The core innovation: **Inspire OKC** is not one app, it's a **compass/search engine** for finding real-life community across verticals.

### New Navigation Structure (replaces 5-tab singles nav):


| Tab     | Route    | Purpose                                                     |
| ------- | -------- | ----------------------------------------------------------- |
| Explore | /explore | Search engine / compass -- find events across ALL verticals |
| Events  | /events  | Browse/RSVP (all categories)                                |
| Connect | /matches | Matches, waves, connections                                 |
| Chats   | /chats   | Conversations                                               |
| Me      | /profile | Profile, quiz, settings                                     |


### Event Categories (verticals):

- **Singles OKC** -- dating events, mixers, speed dating
- **Workout OKC** -- fitness classes, group runs, gym meetups  
- **InPerson OKC** -- general social meetups, networking
- **Fitness OKC** -- wellness, yoga, outdoor activities
- **Faith OKC** -- faith-based community gatherings
- **LGBTQ+ OKC** -- inclusive community events
- **TLC APPS** -- host your own events on the platform

These become filterable categories on the Explore page with a world-class search/compass UI.

---

## Phase 4: Brutal Skeuomorphism 2.0 Design System

Complete CSS overhaul. Remove ALL gradients, glassmorphism, soft shadows, blur orbs, champagne effects. Replace with:

### Design Language:

- **Borders**: 2-3px solid black borders on everything. No rounded corners (border-radius: 0 or 2px max)
- **Shadows**: Hard offset shadows only (e.g., `4px 4px 0 #000`). No soft/blur shadows
- **Typography**: Bold mono headers (`Space Grotesk` or `JetBrains Mono`), clean sans body (`Inter`)
- **Colors**: High contrast. Pure white backgrounds, pure black text, one bold accent color per vertical
- **Texture**: Subtle noise/grain overlays, dotted grid backgrounds, paper-like feel
- **Depth**: Layered cards that look "stacked" with offset borders, not floating glass
- **Buttons**: Rectangular, thick borders, hard shadow on hover that lifts, pressed state that removes shadow
- **Icons**: Outlined, not filled. Sharp, geometric
- **No**: gradients, glassmorphism, blur, glow, orbs, champagne, mesh, aurora, shimmer

### CSS Changes (`src/index.css`):

- Strip all gradient utilities (gradient-champagne, gradient-mesh, etc.)
- Strip all glass utilities (glass-cream, glass-card, etc.)  
- Strip all blur-orb utilities
- Strip all glow shadows
- Update `--radius` to `2px` (near-zero rounding)
- New palette: stark white `--background`, pure black `--foreground`, bold accent `--primary`
- New shadow utilities: `shadow-brutal` (hard offset), `shadow-brutal-sm`, `shadow-brutal-hover`
- New texture utilities: `bg-noise`, `bg-dots`, `bg-paper`

### Component Updates:


| Component    | Changes                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------- |
| `button.tsx` | Remove `rounded-full`, add `rounded-none`, brutal borders, hard shadows, no gradients     |
| `card.tsx`   | Remove all glass/champagne/spotlight variants. New variants: `brutal`, `stacked`, `inset` |
| `input.tsx`  | `rounded-none`, thick border, no hover glow                                               |
| `badge.tsx`  | Rectangular, monospace, thick border                                                      |
| `tabs.tsx`   | Brutal tab indicators (underline or inverted block)                                       |
| `dialog.tsx` | Square corners, thick border, hard shadow                                                 |


### Font Stack Update (`index.html` + `tailwind.config.ts`):

- Add `JetBrains Mono` for headings/labels (the neo-brutalist standard)
- Keep `Inter` for body text (clean readability)
- Add `Space Mono` as fallback mono
- Remove Playfair Display, Sora, DM Sans, Poppins (too soft/premium)

---

## Phase 5: Explore Page -- The Compass/Search Engine

New `src/pages/Explore.tsx` -- the heart of Inspire OKC.

### Features:

- **Search bar** at top: "What do you want to do in OKC?" -- full-text search across events
- **Vertical pills**: Singles | Workout | InPerson | Fitness | Faith | LGBTQ+ | All
- **Map or grid view toggle** for nearby events
- **"Happening Now"** section for live/active events
- **"This Week"** section for upcoming
- **"Host an Event"** CTA for community-created events

### Design:

- Brutal search bar with thick black border, monospace placeholder
- Category pills with hard shadows, active state = inverted (black bg, white text)
- Event cards in brutal style: stacked paper look, thick borders, hard shadows
- No images initially -- text-forward, information-dense, editorial layout

---

## Phase 6: Page-by-Page Atomic Sweep

Every existing page gets the brutal treatment:

### Auth page (`Auth.tsx`):

- Remove all champagne/glass/blur effects
- Stark white card, thick black border, hard shadow
- Monospace "INSPIRE OKC" header
- Input fields with thick borders, no rounding
- Sign-in button: black bg, white text, hard shadow

### Events page (`Events.tsx`):

- Brutal header with stacked text
- Category filters as brutal pills
- Event cards: no images, text-first, brutal borders
- RSVP dialog: square, brutal, no glassmorphism

### Matches page (`Matches.tsx`):

- Brutal tabs (inverted active state)
- Match cards with thick borders, no rounded avatars (square)
- Compatibility shown as bold number, not ring/gradient

### Chats page (`Chats.tsx`):

- Brutal conversation list
- Square avatars, monospace timestamps
- Thick border separators

### Profile page (`Profile.tsx`):

- Brutal stat cards (thick borders, hard shadows)
- Square photo area with thick border
- Interest pills: brutal rectangles
- Save button: full-width brutal black

### CheckIn page (`CheckIn.tsx`):

- Fix dead `/connections` link -> `/matches`
- Brutal check-in cards

### Quiz page (`Quiz.tsx`):

- "Build Your Profile" header
- "Save Profile" submit button
- Brutal progress bar

---

## Phase 7: Admin Panel Consistency

Admin pages already use Layout but need brutal treatment on their internal cards, stat widgets, and tables. Apply the same border/shadow/typography rules.

---

## Implementation Order


| Step | Task                                                                                  | Files                                                                       |
| ---- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1    | Design system overhaul -- CSS variables, remove gradients/glass, add brutal utilities | `src/index.css`, `tailwind.config.ts`                                       |
| 2    | Update fonts in HTML and Tailwind config                                              | `index.html`, `tailwind.config.ts`                                          |
| 3    | Rebrand all components (button, card, input, badge) to brutal style                   | `src/components/ui/button.tsx`, `card.tsx`, `input.tsx`                     |
| 4    | Rebrand all brand components                                                          | `FloatingLogo.tsx`, `TLCBadge.tsx`, `TLCWatermark.tsx`, `BrandedSplash.tsx` |
| 5    | Rebrand nav + footer                                                                  | `RoleBasedNavbar.tsx`, `MobileBottomNav.tsx`, `Footer.tsx`                  |
| 6    | Login-first routing + Auth page redesign                                              | `App.tsx`, `Auth.tsx`                                                       |
| 7    | Create Explore page (compass/search engine)                                           | New: `src/pages/Explore.tsx`                                                |
| 8    | Update Landing -> About page                                                          | `Landing.tsx`                                                               |
| 9    | Brutal sweep on Events, Matches, Chats, Profile                                       | All page files                                                              |
| 10   | Fix dead links (CheckIn `/connections` -> `/matches`, Quiz copy)                      | `CheckIn.tsx`, `Quiz.tsx`                                                   |
| 11   | Update `index.html` meta tags                                                         | `index.html`                                                                |


---

## Summary

This transforms the app from a single-purpose dating app with two competing design languages into a **multi-vertical community platform** with a singular, world-class neo-brutalist identity. Every pixel will be intentional -- thick borders, hard shadows, bold typography, zero filler. The Explore page becomes the "compass" -- a search engine for real-life connection in Oklahoma City.