

# Fix: Blank Preview

## Problem
The preview is blank — React isn't rendering. The code looks syntactically correct, so this is likely a runtime crash during render. The most probable causes:

1. **CSS `animate-glow-pulse` class** — used in line 244 as `animate-glow-pulse`, and while it IS defined in tailwind.config.ts, there could be a Tailwind compilation issue
2. **A silent runtime error** from framer-motion or embla-carousel that crashes the entire React tree (no ErrorBoundary)

## Plan

1. **Add an ErrorBoundary** wrapper in `App.tsx` to catch and display render errors instead of showing a blank screen
2. **Force a clean re-render** by making a small safe edit to `src/pages/Index.tsx` (e.g., add a comment) to trigger Vite HMR rebuild — this often fixes stale build states
3. If still blank, **temporarily simplify** the Index page to isolate which component is causing the crash (remove ScrollRevealText and TestimonialsCarousel, then add them back one by one)

## Technical Details

- The blank preview with no console errors typically means the build itself failed silently or a top-level import crashes before React mounts
- Adding an ErrorBoundary will make future crashes visible
- A forced rebuild via minor edit is the quickest diagnostic step

