

# Inspire OKC -- Final Consistency Sweep

This plan fixes all remaining design inconsistencies, dead references, and branding issues across the entire app to deliver a unified neo-brutalist experience.

---

## 1. Fix `shadow-hard-sm` (undefined class) everywhere

Replace all instances of `shadow-hard-sm` with `shadow-brutal-sm` (the class defined in the CSS).

**Files:**
- `src/pages/CheckIn.tsx` (5 instances)
- `src/pages/Quiz.tsx` (1 instance)
- `src/pages/admin/Venues.tsx` (2 instances)
- `src/pages/admin/Events.tsx` (2 instances)
- `src/components/admin/PanelSwitcher.tsx` (1 instance)
- `src/components/chat/LoveBotWidget.tsx` (1 instance)

---

## 2. Fix CheckIn dead link

In `src/pages/CheckIn.tsx` line 254, replace `<a href="/matches">` with React Router `<Link to="/matches">` (add Link import).

---

## 3. Brutal sweep on Chats page

Update `src/pages/Chats.tsx`:
- Add `font-mono-loud` atomic header with icon box (matching Events/Matches pages)
- Update copy: "matched singles" to "your connections"
- Apply `variant="elevated"` and `atomic-border` to conversation cards
- Square avatars: replace `Avatar` rounded styling with `rounded-none border-2 border-foreground`
- Loading skeletons: add `border-2 border-foreground` instead of `rounded-lg`
- Empty state: add atomic icon box

---

## 4. Fix Events page rounded elements

Update `src/pages/Events.tsx`:
- Line 178: Story carousel images -- remove `rounded-full`, use square with `border-2 border-foreground overflow-hidden`
- Line 203: Profile completion icon -- remove `rounded-xl`, use square atomic box
- Line 250: Empty state icon -- remove `rounded-full`, use square atomic box

---

## 5. Fix Matches page notification badges

Update `src/pages/Matches.tsx`:
- Lines 192, 201: Notification count badges -- change `rounded-full` to `rounded-none`
- Line 115: The `bg-gradient-to-t` overlay is acceptable (it's a photo overlay, not decorative gradient) -- keep as-is

---

## 6. Add brutal headers to admin pages

**`src/pages/admin/Venues.tsx`:**
- Add `font-mono-loud uppercase tracking-tight` to h1
- Add atomic icon box (Building2) before title

**`src/pages/admin/Dashboard.tsx`:**
- Add `font-mono-loud` to h1
- Quick action cards: change `border-border` to `border-foreground`

---

## 7. Remove TLCBadge from Social page

Update `src/pages/Social.tsx`:
- Remove `TLCBadge` import (line 11)
- Remove `<TLCBadge variant="block" />` usage (line 231)
- Replace with "Inspire OKC" text or remove entirely

---

## 8. Update lingering "singles" language

**`src/pages/Profile.tsx` line 148:**
- "appear to other singles" becomes "appear to people you meet"

**`src/pages/Chats.tsx` line 121:**
- "matched singles" becomes "your connections"

**`src/pages/Events.tsx` line 164:**
- "meet amazing singles" becomes "meet amazing people"

---

## Summary

12 files touched. No new dependencies, no database changes, no routing changes. Pure styling consistency + copy corrections to fully unify the neo-brutalist design system across every page.

