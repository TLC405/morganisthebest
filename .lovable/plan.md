

# Inspire OKC — Epic Compass Redesign

## Current Issues Found

1. **NotFound page** has zero brutalist styling (plain default look)
2. **Matches page** line 115 still has `bg-gradient-to-t` (prohibited)
3. **Profile page** lines 331-334 still use `rounded-full` dots for interest indicators
4. **Admin nav has 10 links** — overwhelming on mobile, clutters the hamburger menu
5. **Explore page** is functional but generic — needs to be the world-class "compass" you described
6. **Social/About page** duplicates Explore content — should be consolidated or differentiated
7. **No admin sidebar** — admin pages use the same top nav, making 10+ links hard to navigate

---

## The Vision: Unorthodox Compass UI

Transform the Explore page from a standard search+grid into an **interactive compass/radar** — a brutalist command center where you spin through verticals like tuning a dial. No other dating/community app does this.

---

## Changes

### 1. Explore Page → World-Class Compass Hub

Rebuild `src/pages/Explore.tsx` with:
- **Compass rose layout**: Verticals arranged in a circular/radial pattern on desktop, horizontal scroll on mobile — each vertical is a bold brutalist "sector" card with thick borders and offset shadow
- **"Pulse" indicator**: Animated dot showing how many events are live RIGHT NOW in each vertical
- **Command bar**: Replace plain search input with a brutalist "terminal-style" command bar — monospace, blinking cursor, `>_ FIND ANYTHING IN OKC` placeholder
- **Quick-stat row**: Total events, people active, events this week — displayed as brutal stat blocks
- **Vertical cards expand inline**: Tap a vertical → it expands to show its events without leaving the page (accordion-style, not navigation)

### 2. Admin Sidebar Navigation

Create `src/components/admin/AdminSidebar.tsx`:
- Fixed left sidebar (desktop) / drawer (mobile) for admin pages
- All 10 admin links organized into groups: **Community** (Members, Team, Feedback), **Operations** (Events, Venues), **Commerce** (Shop, Coupons, Orders), **Intelligence** (Dashboard, Intel)
- Create `src/components/layout/AdminLayout.tsx` wrapping Layout + sidebar
- Update all 11 admin pages to use `AdminLayout` instead of `Layout`

### 3. Fix Remaining Style Violations

| File | Fix |
|------|-----|
| `src/pages/NotFound.tsx` | Full brutal redesign with atomic borders, compass icon, mono typography |
| `src/pages/Matches.tsx` line 115 | Replace `bg-gradient-to-t` with solid `bg-foreground/80` overlay |
| `src/pages/Profile.tsx` lines 331-334 | Replace `rounded-full` dots with `rounded-none` squares |
| `src/pages/Social.tsx` | Differentiate from Explore — make it a pure marketing/about page with no event grid duplication |

### 4. Mobile Bottom Nav for Admin

Update `src/components/layout/MobileBottomNav.tsx`:
- Admin mobile nav currently shows only 4 of 10 admin pages
- Add a "More" tab that opens a bottom sheet with all admin sections grouped

### 5. Consolidate Routes

In `App.tsx`:
- Remove `/social` redirect — `/about` is the canonical marketing page
- Ensure `/about` uses a differentiated design (brand story, how-it-works, trust features) with no event grid

---

## Technical Details

### Files to create:
- `src/components/admin/AdminSidebar.tsx` — sidebar nav for admin
- `src/components/layout/AdminLayout.tsx` — layout wrapper with sidebar

### Files to modify:
| File | Change |
|------|--------|
| `src/pages/Explore.tsx` | Complete rebuild — compass UI with command bar, radial verticals, live pulse, inline expansion |
| `src/pages/NotFound.tsx` | Brutal redesign |
| `src/pages/Matches.tsx` | Remove gradient |
| `src/pages/Profile.tsx` | Fix rounded dots |
| `src/pages/Social.tsx` | Remove event grid, pure brand/about content |
| `src/pages/admin/Dashboard.tsx` | Use AdminLayout |
| `src/pages/admin/Members.tsx` | Use AdminLayout |
| `src/pages/admin/Events.tsx` | Use AdminLayout |
| `src/pages/admin/Venues.tsx` | Use AdminLayout |
| `src/pages/admin/Feedback.tsx` | Use AdminLayout |
| `src/pages/admin/Team.tsx` | Use AdminLayout |
| `src/pages/admin/Shop.tsx` | Use AdminLayout |
| `src/pages/admin/Coupons.tsx` | Use AdminLayout |
| `src/pages/admin/Orders.tsx` | Use AdminLayout |
| `src/pages/admin/MarketIntel.tsx` | Use AdminLayout |
| `src/pages/admin/Users.tsx` | Use AdminLayout |
| `src/components/layout/MobileBottomNav.tsx` | Add "More" drawer for admin |
| `src/App.tsx` | Clean up `/social` redirect |

### No new dependencies needed.

---

## Summary

The Explore page becomes a one-of-a-kind **compass command center** — not a generic search page. The admin panel gets a proper sidebar so all 10+ admin pages are easily reachable. Every remaining style violation (gradients, rounded elements, unstyled pages) gets fixed. The result is a cohesive, world-class brutalist platform where every page speaks the same design language.

