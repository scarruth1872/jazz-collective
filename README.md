# 🎷 Krystal Harrow & The Jazz Collective

> A premium artist portfolio and booking website for vocalist **Krystal Harrow** and The Jazz Collective — built with pure HTML, CSS, and JavaScript. Features a headless CMS admin panel with localStorage persistence and JSON export for static deployment via Netlify.

**Live Site:** [jazz-collective.netlify.app](https://jazz-collective.netlify.app) *(update once deployed)*  
**Bookings:** [linqapp.com/ynqjcd89o1pi](https://linqapp.com/ynqjcd89o1pi)  
**Admin Panel:** `/admin.html` (password: `jazzcollective2026`)

---

## ✨ Features

### Public Site

| Section | Description |
|---|---|
| **Hero** | Full-screen cinematic header with auto-rotating background slideshow |
| **About** | Multi-part biography (Introduction, Jazz Characteristics, Banner, Modern & Fusion, Around the World, Global Map, Education) |
| **Photo Gallery** | CSS Grid masonry layout with 9 performance images, hover overlays, and lightbox viewer |
| **Upcoming Events** | Chronological event schedule with date blocks, venue info, and ticket links |
| **Blog / News** | Three-column card grid with tag filtering and full-post modal overlay |
| **Testimonials** | Client reviews with star ratings |
| **Instagram / Social** | Instagram section with follow link and embed-ready placeholder |
| **Newsletter** | Email signup form (custom or embed code from Mailchimp/others) |
| **Booking Form** | Full inquiry form with client-side validation (name, email, phone, date, event type, message), Formspree integration |
| **Footer** | Navigation links, social media, booking URL, and credits |
| **Press Kit (EPK)** | Password-protected electronic press kit with bio and downloadable assets. Access via `#/press-kit` hash route |

### Admin CMS (`/admin.html`)

The entire site is editable through a password-protected admin panel with 15 management tabs:

| Tab | Features |
|---|---|
| **General** | Site title, meta description, booking URL, contact email, Google Analytics ID, social media links, footer text |
| **Hero** | Headline text + slideshow image manager (add/remove/reorder) |
| **Menu** | Navigation items with labels, URLs, section targeting, and CTA styling |
| **About** | All 7 about sub-sections with rich text and image pickers (drag & drop upload) |
| **Sections** | Toggle visibility of About, Gallery, Events, Blog, Contact sections |
| **Gallery** | Photo grid manager — add/remove/reorder images with span styles (tall/wide/normal) |
| **Events** | Event schedule manager with month, day, title, venue, city, ticket URL |
| **Blog** | Blog post editor with date, tag, title, summary, full HTML content, and image |
| **Reviews** | Testimonials manager with name, quote, and star rating |
| **EPK** | Press kit assets manager (bio + downloadable files) |
| **Marketing** | Newsletter heading, body, button text, and custom embed code |
| **SEO** | Open Graph title, description, and share image for social previews |
| **Security** | Press kit password protection toggle and password field |
| **Contact** | Booking section copy, LinqApp URL/button text, and contact photo |
| **Theme** | Full color palette editor (6 color pickers) + custom CSS injection |
| **Data** | Export/import JSON, change admin password, reset to defaults |

**Design highlights:**
- Sticky navigation bar with scroll-aware active link highlighting
- Admin & RSS feed links (⚙ 📡 icons) in the nav bar for quick access
- Dark/gold premium aesthetic with Playfair Display + Inter typography
- Smooth scroll-triggered `fade-in` animations via Intersection Observer
- Lightbox for images with keyboard navigation (arrow keys, Escape) and touch swipe support
- Hamburger menu for mobile responsiveness
- Semantic HTML5 with ARIA labels and accessible form controls
- Skip-to-content link for keyboard navigation
- Security headers + aggressive image caching via `netlify.toml`
- Blog modal overlay with full post content support
- RSS 2.0 feed with auto-discovery for blog subscribers

---

## 🗂 Project Structure

```
jazz-collective/
├── index.html              # Single-page public site
├── style.css               # Design system, layout, animations (~900 lines)
├── script.js               # Public site JS (content renderer, nav, animations, forms, lightbox, modals)
├── content.js              # CMS data layer (defaults + localStorage persistence)
├── content-data.json       # Exported content defaults (deploy this to publish)
├── admin.html              # Admin CMS panel (15 management tabs)
├── admin.css               # Admin panel styles
├── admin.js                # Admin panel logic (CRUD for all content types)
├── sw.js                   # Service worker (offline caching, PWA support)
├── manifest.json           # Web App Manifest (PWA install, theme color, icons)
├── feed.xml                # RSS 2.0 feed (blog auto-discovery for subscribers)
├── netlify.toml            # Netlify build config, security headers, cache rules
├── .gitignore              # Excludes archives, screenshots, OS noise
├── README.md               # You are here
└── images/
    ├── Photos-3-001/       # Primary photo library (22 performance/headshot images)
    ├── world_map_gold_*.png
    ├── vintage_mic_collage_*.png
    ├── band_rehearsal_*.png
    ├── hero_*.png
    ├── intro_singer_*.png
    └── ...                 # Supporting generated assets
```

---

## 🚀 Local Development

This is a **static site** — no build step required.

```bash
# Start a local server (choose one)
npx serve . -l 5173
python -m SimpleHTTPServer 5173
python3 -m http.server 5173

# Then open in browser
open http://localhost:5173
# Admin panel: http://localhost:5173/admin.html
```

**Default admin password:** `jazzcollective2026`

---

## 🚀 Deployment

### Netlify (Recommended)

The repo is pre-configured via `netlify.toml`:

1. Push the repository to GitHub
2. In [Netlify](https://app.netlify.com), go to **Add new site → Import from Git**
3. Select your repository
4. Leave build command empty — Netlify auto-detects the static setup
5. Click **Deploy**

Any future `git push` triggers an automatic redeploy.

### To Publish Content Changes

1. Make edits in the admin panel (`/admin.html`)
2. Go to the **Data** tab and click **Export JSON**
3. Replace `content-data.json` in your repository with the downloaded file
4. Commit and push — Netlify redeploys automatically

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic markup with ARIA accessibility attributes |
| **CSS3** | Custom properties, CSS Grid, Flexbox, `@keyframes` animations, responsive design |
| **Vanilla JavaScript** | Intersection Observer API, form validation, localStorage CMS, lightbox, image upload (FileReader/DataURL) |
| **Google Fonts** | Playfair Display (headings) + Inter (body) |
| **Netlify** | Static hosting, CDN, security headers, caching rules |
| **Formspree** | Contact form backend (configured via admin panel) |
| **Mailchimp / any** | Newsletter embed support (paste any provider's form HTML) |

---

## 🗄️ CMS Architecture

```
User → Admin Panel (admin.html)
         ↓
    localStorage ('jc_content')
         ↓
    Export JSON (content-data.json)
         ↓
    Commit to GitHub → Netlify redeploys
         ↓
    Public site reads from content-data.json (via content.js defaults)
```

- **Offline-capable**: All edits save to localStorage immediately
- **No database required**: Content ships as static JSON with the site
- **Easy rollback**: Import previous JSON exports from the Data tab

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

## ✅ Status & Next Steps

### ✅ Recently Completed
- [x] Full site structure (Hero, About, Gallery, Events, Blog, Testimonials, Newsletter, Contact, Footer)
- [x] Admin CMS panel with 15 management tabs
- [x] Content data layer with localStorage persistence + JSON export
- [x] Protected Press Kit (EPK) with password gate
- [x] Image lightbox with keyboard/touch navigation
- [x] Blog modal overlay with full post content
- [x] Responsive design (mobile, tablet, desktop)
- [x] Lightbox zoom-in cursor on all images
- [x] Fixed duplicate blog rendering bug
- [x] Fixed JavaScript syntax error (dangling brace in content renderer)
- [x] **JSON-LD Structured Data (SEO)** — Schema.org MusicGroup, Person, Organization, WebSite + all 5 Events
- [x] **PWA / Offline support** — Service worker (`/sw.js`) + Web App Manifest (`/manifest.json`) with gold theme color
- [x] **Blog RSS feed** — `/feed.xml` with all 3 posts, RSS 2.0 compliant
- [x] **Social media feed section** — Instagram section with follow link on main page
- [x] **Accessibility improvements** — Skip-to-content link, focusable admin link, ARIA labels
- [x] **Performance optimizations** — Preconnect hints (LinqApp, Google Fonts), DNS prefetch, `fetchpriority="high"` on hero image, `font-display: swap`
- [x] **Admin & RSS links** — ⚙ and 📡 icons in sticky nav bar
- [x] **CLS Prevention** — Aspect-ratio on all image containers + explicit width/height on gallery/blog images
- [x] **Service worker fix** — Filters out non-http(s) requests (chrome-extension:, etc.)

### 🚧 Remaining (Manual / Credentials Required)
- [ ] **WebP/AVIF conversion** — Run images through Sharp, Squoosh, or ImageMagick
- [ ] **Cross-browser testing** — Verify on Safari, Firefox, Edge, mobile browsers
- [ ] **Form backend** — Enter a real Formspree endpoint in Admin > General > Contact Form Email
- [ ] **Analytics** — Enter a Google Analytics Measurement ID in Admin > General

---

## 🚀 Deployment Checklist

Before going live on Netlify:

1. [ ] **Update social media URLs** — Admin > General tab (Instagram, Facebook, YouTube)
2. [ ] **Set contact email** — Admin > General > Contact Form Email (Formspree endpoint)
3. [ ] **Add Google Analytics** — Admin > General > Google Analytics Measurement ID
4. [ ] **Review content** — All text, events, photos in the admin panel
5. [ ] **Set admin password** — Admin > Data > Change Admin Password (default: `jazzcollective2026`)
6. [ ] **Export & commit** — Admin > Data > Export JSON, replace `content-data.json`, commit to GitHub
7. [ ] **Update live URL** — Replace `jazz-collective.netlify.app` in `index.html`, `feed.xml`, `manifest.json` with your actual Netlify domain
8. [ ] **Test forms** — Submit a test booking to confirm Formspree delivers to your email
9. [ ] **Test admin** — Navigate to `/admin.html` on the live site, confirm login works
10. [ ] **Verify SSL** — Netlify provisions auto-SSL; confirm the padlock shows in browser

---

## 📬 Contact & Booking

For event bookings, inquiries, or vocal coaching:

- **LinqApp:** [linqapp.com/ynqjcd89o1pi](https://linqapp.com/ynqjcd89o1pi)
- **Booking Form:** Available directly on the site under the *Book Now* section
- **Admin:** `/admin.html` — Edit all site content in one place

---

## 📄 License

© 2026 Krystal Harrow Entertainment. All rights reserved.  
Unauthorized reproduction or redistribution of site assets is prohibited.
