# N-Store — Premium App & Game Hub

**Live:** https://nitesh99390.github.io/N-store-/

A curated, installable (PWA) hub of hand-crafted HTML5 games and web apps by Nitesh.
Zero installs, zero waiting — tap and play on any device.

## Features

- **Modern UI** — glassmorphism navbar, gradient hero with animated stats, skeleton loaders, light/dark theme (auto-detects system, persisted)
- **Discovery** — instant search (title / tag / category) with highlight, tag chips, sorting (featured, rating, plays, newest, A→Z), grid/list view
- **Top charts** — auto-ranked by plays
- **App detail modal** — rating, plays, size, description, tags, Play / Favourite / Share
- **Favourites** — saved locally, dedicated tab + nav badge
- **Continue playing** — recently played rail
- **Global chat** — Google login (Firebase Auth), realtime messages (Firebase RTDB), delete own messages, unread badge, connection status, day dividers, XSS-safe rendering, rate limiting
- **PWA** — install prompt, offline banner, service worker with network-first HTML + stale-while-revalidate assets, app shortcuts
- **Polish** — toast notifications, scroll progress bar, back-to-top, keyboard shortcuts (`/` to search, `Esc` to close), full ARIA labels, reduced-motion support
- **SEO** — Open Graph / Twitter cards, canonical URL, JSON-LD structured data

## Catalogue

| Title | Type | File |
|---|---|---|
| Tic Tac Toe Pro | Game | `tictoctoe.html` |
| Simon Game | Game | `simon.html` |
| Memory Match | Game | `memorygame.html` |
| Star Bubble Shooter | Game | `hello1.html` |
| Global FM Radio | App | `hello.html` |
| N-OS System | App | `hi.html` |

## Adding a new app

Edit the `myProjects` array in `index.html`:

```js
{
  id: "unique-id", title: "My App", developer: "Nitesh", category: "Game" | "App",
  rating: 4.8, plays: 1200, size: "20 KB", added: "2025-09-07", link: "myapp.html",
  badge: "new" | "hot" | "top",            // optional
  tags: ["Puzzle", "Casual"],
  desc: "Short description shown in the detail modal.",
  iconImg: "https://...png"  /* or */  iconClass: "fa-solid fa-gamepad",
  iconBg: "#hex or linear-gradient(...)"
}
```

Then add the file to `SHELL_ASSETS` in `sw.js` and bump `VERSION`.

## Local development

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No build step — pure static HTML/CSS/JS.
