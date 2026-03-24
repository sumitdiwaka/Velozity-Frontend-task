# Velozity — Multi-View Project Tracker

A fully functional project management interface built with React, TypeScript, and Tailwind CSS v4. Supports three switchable views of the same dataset, custom drag-and-drop, virtual scrolling for 500+ tasks, live collaboration simulation, and URL-synced filters.

---

## Getting Started

### Prerequisites

- Node.js 18 or above
- npm 9 or above

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/velozity-tracker.git
cd velozity-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Or connect the repository directly to Vercel — it auto-detects Vite and deploys with zero config.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3 | UI framework |
| TypeScript | 5.4 | Type safety |
| Vite | 5.3 | Build tool |
| Tailwind CSS | v4 | Utility styling via `@tailwindcss/vite` |
| Zustand | 4.5 | Global state management |

No drag-and-drop libraries. No virtual scrolling libraries. No UI component libraries.

---

## State Management — Why Zustand

I chose **Zustand** over React Context + `useReducer` for three concrete reasons:

**1. No Provider boilerplate.** With Context, every piece of state needs a Provider wrapping the tree. For an app that shares task data, filter state, sort state, drag state, and collaboration state across three completely different views, that wrapper nesting becomes difficult to reason about. Zustand stores are plain functions — any component can subscribe with a single import, no wrapping needed.

**2. Selector-based subscriptions prevent unnecessary re-renders.** This matters a lot at 500+ tasks. With `useReducer` + Context, every consumer of the context re-renders whenever *any* part of the state changes. With Zustand, a component like `TaskCard` can subscribe to only `collabUsers` via `useTaskStore((s) => s.collabUsers)` and will only re-render when that specific slice changes — even if the task list itself is being mutated elsewhere.

**3. `getState()` is available outside React.** The collaboration simulation runs on a `setInterval`. Inside a timer callback, React state is always stale (closure over the initial value). Zustand solves this cleanly with `useTaskStore.getState().collabUsers` — a direct read of current state without hooks, no `useRef` workaround required.

The full store lives in `src/store/useTaskStore.ts` and holds: task list, active view, filter state, sort state, drag state, and collaboration user positions.

---

## Virtual Scrolling — Implementation

The list view renders 520+ tasks without any performance degradation. The implementation lives in `src/hooks/useVirtualScroll.ts` and `src/components/listview/VirtualList.tsx`. No `react-window`, no `react-virtualized`, no external library of any kind.

### How it works

The core idea is simple: only render what the user can actually see.

```
totalHeight = itemCount × itemHeight          // keeps scrollbar accurate
visibleCount = Math.ceil(containerHeight / itemHeight)
startIndex = Math.floor(scrollTop / itemHeight) - buffer
endIndex = startIndex + visibleCount + buffer
offsetY = startIndex × itemHeight             // positions rendered rows correctly
```

The DOM structure has two layers:

1. An **outer scrollable container** with a fixed pixel height (viewport height minus header/filter bar).
2. An **inner spacer div** set to `totalHeight` — this gives the browser the full scroll range and keeps the scrollbar sized correctly, even though only ~20–30 rows are actually in the DOM at any time.
3. Inside the spacer, an **absolutely positioned wrapper** translated by `offsetY` pixels from the top. Only the visible rows are rendered inside this wrapper.

When the user scrolls, `scrollTop` updates via a passive `scroll` event listener, React re-computes `startIndex` / `endIndex`, and only the new visible slice is rendered. Because all rows have a fixed height of 48px, there are no layout reflows — the browser never has to measure anything.

The `buffer = 5` means 5 rows above and below the visible window are kept mounted. This eliminates any blank flash during fast scrolling because by the time a row scrolls into view, its neighbour was already rendered.

Sorting triggers a re-render of the sorted array but does not reset the scroll position unless the filter changes (filter changes reset `scrollTop` to 0 to avoid showing a blank gap).

---

## Drag and Drop — Implementation

Custom implementation using the native HTML5 Drag and Drop API (`dragstart`, `dragover`, `dragleave`, `drop`, `dragend`). No `react-beautiful-dnd`, no `dnd-kit`, no SortableJS.

### How it works

Each `TaskCard` has `draggable={true}` and an `onDragStart` handler that:
- Stores the task ID in `dataTransfer` via `e.dataTransfer.setData('text/plain', taskId)`
- Writes the dragging task ID to the Zustand store (`draggingId`)
- Reads `e.currentTarget.offsetHeight` to capture the card's exact pixel height for the placeholder

Each `KanbanColumn` listens for `onDragOver`, `onDragLeave`, and `onDrop`:
- `dragOver` calls `e.preventDefault()` (required by the browser to allow a drop) and sets `isDragOver = true` for the highlight effect
- `dragLeave` uses `e.currentTarget.contains(e.relatedTarget)` to ignore events fired when hovering over child elements inside the column — without this check the highlight flickers on every child hover
- `drop` reads the task ID from `dataTransfer`, calls `moveTask(taskId, status)` in the store, and clears all drag state

### Placeholder without layout shift

When a drag starts, the card is set to `opacity: 0` (not `display: none` or `visibility: hidden`). The card stays in the DOM at its original position, maintaining column height and preventing any reflow. A separate `<div className="drag-placeholder">` is rendered immediately above the now-invisible card, styled as a dashed border box with the exact same pixel height captured at `dragStart`. The result is a stable placeholder that occupies precisely the space the card left behind.

If the card is dropped outside any valid column, `handleDrop` never fires on any column, so the store is never updated. On `dragEnd`, all local state (`draggingId`, `placeholderHeight`, `isDragOver`) is cleared, the card's `opacity` returns to 1, and it snaps back to its original position — the browser handles the snap-back animation natively.

### Touch support

The HTML5 drag events do not fire on touch devices. Touch support is handled by mapping `touchstart` → `dragstart`, `touchmove` → `dragover`, and `touchend` → `drop` using pointer position to hit-test which column is underneath via `document.elementFromPoint`. This is implemented directly in the `TaskCard` touch handlers.

---

## URL-Synced Filters

Filters are reflected in the URL as query parameters so any filtered view is bookmarkable and shareable. The hook `src/hooks/useUrlFilters.ts` handles the two-way sync:

- **On mount:** reads `?status=todo&priority=high&assignee=u1&from=2025-01-01&to=2025-03-31` from `window.location.search`, parses each param, and restores the store's filter and view state before the first render
- **On change:** whenever filters or view mode change, writes back to the URL using `window.history.replaceState` — no page reload, no scroll reset, just a silent URL update

The active view is also persisted as `?view=kanban|list|timeline`. Hitting the browser back button restores the previous URL, and on the next mount the hook re-reads it, fully restoring the filter state.

---

## Project Structure

```
src/
├── App.tsx                          # Root layout, view switching
├── main.tsx                         # Entry point
├── index.css                        # Tailwind v4 import + :root CSS variables
├── types/
│   └── index.ts                     # All shared TypeScript types
├── data/
│   └── seedData.ts                  # 520-task generator with edge cases
├── store/
│   └── useTaskStore.ts              # Zustand store (tasks, filters, sort, drag, collab)
├── hooks/
│   ├── useVirtualScroll.ts          # Custom virtual scroll — no libraries
│   └── useUrlFilters.ts             # URL ↔ filter state sync
├── utils/
│   └── dateUtils.ts                 # Due date labels, overdue logic, date math
└── components/
    ├── layout/
    │   ├── Header.tsx               # Logo + view switcher
    │   └── CollaborationBar.tsx     # Live presence bar + simulation
    ├── filters/
    │   └── FilterBar.tsx            # Multi-select chips + date range
    ├── kanban/
    │   ├── KanbanBoard.tsx          # Board layout, column orchestration
    │   ├── KanbanColumn.tsx         # Drop zone, column header, card list
    │   └── TaskCard.tsx             # Draggable card with collab indicators
    ├── listview/
    │   ├── ListView.tsx             # Sortable header + table layout
    │   └── VirtualList.tsx          # Virtually scrolled rows, inline status change
    ├── timeline/
    │   └── TimelineView.tsx         # Gantt bars, today line, horizontal scroll
    └── shared/
        ├── Avatar.tsx               # Initials-based avatar with colour coding
        ├── PriorityBadge.tsx        # Colour-coded priority pill
        └── EmptyState.tsx           # Reusable empty/no-results state
```

---

## Seed Data

`src/data/seedData.ts` generates **520 tasks** on every load with fully randomised titles (20 verb prefixes × 50 subject nouns), assignees drawn from a pool of 6 users, priorities, statuses, start dates, and due dates.

Edge cases are seeded explicitly:
- Tasks 0–7: due date = today (`"Due Today"` label)
- Tasks 8–19: overdue by 8–25 days (shows `"Xd overdue"` label), status forced to active
- Tasks 20–29: `startDate = null` (renders as a single-day marker on the timeline)

---

## Lighthouse Score

> Screenshot of Lighthouse desktop report: `docs/lighthouse.png`

Target: 85+ on desktop performance. The main optimisations applied:

- Virtual scrolling in list view means the DOM never exceeds ~40 task rows regardless of dataset size
- Zustand selectors prevent components from re-rendering on unrelated state changes
- No heavy third-party runtime libraries (no DnD lib, no virtualiser, no UI kit)
- Fonts loaded via `<link rel="preconnect">` in `index.html` to eliminate render-blocking
- Vite's default code splitting and tree-shaking keep the initial bundle lean

---

## Explanation Field (150–250 words)

**The hardest UI problem I solved** was the drag-and-drop placeholder behaviour. The naive approach — `display: none` or removing the card from the DOM — causes every subsequent card in the column to shift upward, creating a jarring layout jump that makes precise dropping feel broken. The fix was to keep the card in the DOM at full size but set `opacity: 0`, so it still occupies its space. A separate placeholder `<div>` is rendered immediately above it using the card's `offsetHeight` captured at `dragStart`. The dashed border and subtle background make the intended drop slot legible without being noisy. Because the invisible card and the placeholder stack vertically rather than replacing each other, the column height stays perfectly stable throughout the entire drag.

**How I handled it without layout shift:** At `dragStart`, I read `e.currentTarget.offsetHeight` — the actual rendered height of that specific card — and store it in local state. The placeholder is then rendered as a fixed-height div with exactly that pixel value. This means cards of different content lengths all get correctly sized placeholders. When dragging into a foreign column, the same captured height is reused for the target column's drop indicator.

**One thing I'd refactor with more time:** The `VirtualList` container height is currently calculated as `window.innerHeight - 220`, which is a magic number offset accounting for the header, collaboration bar, filter bar, and table header. I'd replace this with a `ResizeObserver` on a flex container reference so the virtual list height responds correctly to window resizes and any future layout changes without hardcoded arithmetic.