# Arabic Home Services Website Implementation Plan

> **For agentic workers:** Inline execution is authorized by the user's request to build the website. Track the tasks below in order.

**Goal:** Build a complete, premium, Arabic-only static website for Sama Al Khaleej with six responsive pages, a safe booking flow, and foundational technical SEO.

**Architecture:** Six standalone semantic Arabic RTL pages share a CSS design system and focused vanilla JavaScript modules. Navigation/content remain in HTML; the WhatsApp booking integration remains clearly pending until an official company number is configured.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Font Awesome CDN icons, Google Fonts (Tajawal), static hosting.

**Spec:** `docs/superpowers/specs/2026-10-25-sama-al-khaleej-site-design.md`

## Global Constraints

- All visible website copy, form labels, validation, metadata, and documentation must be Arabic; source identifiers and technical syntax remain standard English.
- Every page uses `lang="ar"` and `dir="rtl"`; isolate telephone/URL data as LTR.
- Light mode is default, OS preference is respected until a user choice exists, and explicit choice persists in localStorage.
- Never invent contact information, prices, reviews, guarantees, certifications, years, hours, exact location, team facts, or completed projects.
- Never claim booking submission or save customer details locally. No WhatsApp number is configured; provide a clear pending state.
- Use safe DOM APIs, encoded WhatsApp text, keyboard-operable interactions, reduced-motion support, and relative paths.

---

### Task 1: Build home page and design system

**Files:** Create `index.html`, `css/variables.css`, `css/base.css`, `css/components.css`, `css/layout.css`, `css/responsive.css`, `css/animations.css`, `js/main.js`, `js/theme.js`, `js/navigation.js`.

- [ ] Create global color/type/spacing/radius/shadow tokens and light/dark theme selectors.
- [ ] Build shared Arabic header/footer patterns with navigation, theme toggle, and booking CTA.
- [ ] Implement the homepage hero, services overview, strengths, process, coverage, clearly labeled gallery placeholder, and final CTA.
- [ ] Add responsive layouts, focus styles, reduced-motion behavior, and reveal animation.
- [ ] Ensure mobile navigation and theme toggle work using vanilla JS.

### Task 2: Build services and about pages

**Files:** Create `pages/services.html`, `pages/about.html`.

- [ ] Group all ten supplied categories into cleaning, floors/glass/furnishings, tanks/AC/pest control, and home maintenance groupings.
- [ ] Add booking links with URL-encoded service identifiers for all service cards.
- [ ] Write company overview and approach using only the supplied claims.

### Task 3: Build booking and contact pages

**Files:** Create `pages/booking.html`, `pages/contact.html`, `js/booking.js`.

- [ ] Implement accessible Arabic form labels, required indicators, Saudi mobile validation, Al-Qassim service location, conditional property type, preferred date/time, and notes.
- [ ] Preselect a service from the `?service=` query value using safe value assignment.
- [ ] Present a review confirmation before attempting WhatsApp; keep the official number as a single clearly marked empty config constant.
- [ ] When number is missing, show a clear Arabic pending configuration message and do not open a fake contact or claim success.
- [ ] List only known service region and company identity on contact page; make unavailable contact details explicit as pending.

### Task 4: Build gallery and support pages

**Files:** Create `pages/gallery.html`, `pages/404.html`, `js/gallery.js`.

- [ ] Build an image-focused gallery with visibly marked development placeholders.
- [ ] Implement keyboard-operable dialog/lightbox with previous/next, Escape, and focus return.
- [ ] Add a branded Arabic not-found page.

### Task 5: SEO, deployment docs, and verification

**Files:** Create `robots.txt`, `sitemap.xml`, `README.md`.

- [ ] Add unique Arabic title, description, Open Graph fields, and canonical placeholders for each page without inventing a domain.
- [ ] Add robots and sitemap entries using a clearly marked domain placeholder.
- [ ] Write Arabic setup/deployment guidance and list client-specific values requiring configuration.
- [ ] Verify all relative links, six page routes, Arabic-only visible copy, form validation and pending contact behavior, theme persistence code, gallery controls, reduced-motion behavior, and responsive CSS.
- [ ] Report any verification limitation plainly.
