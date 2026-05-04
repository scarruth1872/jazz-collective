# 🎷 Krystal Harrow & The Jazz Collective

> A premium artist portfolio and booking website for vocalist **Krystal Harrow** and The Jazz Collective — built with pure HTML, CSS, and JavaScript and deployed via Netlify.

**Live Site:** [jazz-collective.netlify.app](https://jazz-collective.netlify.app) *(update once deployed)*  
**Bookings:** [linqapp.com/ynqjcd89o1pi](https://linqapp.com/ynqjcd89o1pi)

---

## ✨ Features

| Section | Description |
|---|---|
| **Hero** | Full-screen cinematic header with staggered image animations |
| **About** | Multi-part biography covering jazz background, characteristics, global reach, and education |
| **Photo Gallery** | CSS Grid masonry layout with 9 performance images and hover overlays |
| **Upcoming Events** | Chronological event schedule linking to tickets & info |
| **Blog / News** | Three-column card grid for news, recaps, and behind-the-scenes stories |
| **Booking Form** | Full inquiry form with client-side validation (name, email, phone, date, event type, message) |
| **Footer** | Full navigation links and direct booking URL |

**Design highlights:**
- Sticky navigation bar with scroll-aware active link highlighting
- Dark/gold premium aesthetic with Playfair Display + Inter typography
- Smooth scroll-triggered `fade-in` and `slide-up` animations via Intersection Observer
- Hamburger menu for mobile responsiveness
- Semantic HTML5 with ARIA labels and accessible form controls
- Security headers + aggressive image caching via `netlify.toml`

---

## 🗂 Project Structure

```
jazz-collective/
├── index.html          # Single-page app — all sections
├── style.css           # Design system, layout, animations
├── script.js           # Nav behavior, scroll animations, form validation
├── netlify.toml        # Netlify build & HTTP header config
├── .gitignore          # Excludes archives, screenshots, OS noise
└── images/
    ├── Photos-3-001/   # Primary photo library (performance shots)
    ├── world_map_gold_*.png
    ├── vintage_mic_collage_*.png
    └── ...             # Supporting generated assets
```

---

## 🚀 Deployment

This is a **static site** — no build step required.

### Local Development

Open `index.html` directly in a browser, or use a simple dev server:

```bash
# VS Code Live Server (recommended)
# Right-click index.html → "Open with Live Server"

# Or with Node.js
npx serve .
```

### Netlify (Production)

The repo is pre-configured for Netlify via `netlify.toml`:

1. Push to the `main` branch on GitHub
2. In [Netlify](https://app.netlify.com), go to **Add new site → Import from Git**
3. Select the `scarruth1872/jazz-collective` repository
4. Leave build command empty — Netlify auto-detects the static setup
5. Click **Deploy** — live in under 60 seconds

Any future `git push` to `main` triggers an automatic redeploy.

---

## 🛠 Tech Stack

- **HTML5** — Semantic markup with ARIA accessibility attributes
- **CSS3** — Custom properties, CSS Grid, Flexbox, `@keyframes` animations
- **Vanilla JavaScript** — Intersection Observer API, form validation
- **Google Fonts** — Playfair Display (headings) + Inter (body)
- **Netlify** — Static hosting, CDN, security headers, caching rules

---

## 📅 Upcoming Events (2026)

| Date | Event | Venue |
|---|---|---|
| Jun 14 | Summer Jazz at the Plaza | Corpening Plaza Amphitheater, Morganton NC |
| Jul 4 | Independence Day Gala | Benton Convention Center, Winston-Salem NC |
| Aug 23 | Fusion Nights — Late Session | The Green Bean, Greensboro NC |
| Sep 7 | Caribbean Jazz Experience | Piedmont Hall, Charlotte NC |
| Oct 19 | Gospel & Jazz Brunch | Mayor's Building Terrace, Winston-Salem NC |

---

## 📬 Contact & Booking

For event bookings, inquiries, or vocal coaching:

- **LinqApp:** [linqapp.com/ynqjcd89o1pi](https://linqapp.com/ynqjcd89o1pi)
- **Booking Form:** Available directly on the site under the *Book Now* section

---

## 📄 License

© 2026 Krystal Harrow Entertainment. All rights reserved.  
Unauthorized reproduction or redistribution of site assets is prohibited.
