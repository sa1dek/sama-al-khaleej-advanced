# Sama Al Khaleej Home Services Website — Design

## Goal
Build a polished, booking-first Arabic website for مؤسسة سما الخليج المتقدمة للخدمات المنزلية serving Ar Rass and the Al-Qassim Region. The site is static, responsive, RTL, accessible, and uses only verified business facts.

## Architecture
- Six standalone semantic HTML pages: home, services, about, gallery, contact, and booking.
- Shared design system in CSS using variables for color, spacing, typography, surfaces, and light/dark themes. Common navigation and footer markup stays in each page so content and links render without JavaScript.
- Vanilla JavaScript modules handle navigation, theme preference, WhatsApp booking preparation, and gallery lightbox.
- Relative links and asset URLs keep the site hostable as static files. SEO includes per-page Arabic metadata, robots.txt, sitemap.xml, and a deployment README.

## Booking and contact flow
The form validates name, Saudi phone format, service, Al-Qassim location, property type where relevant, preferred date/time, and optional notes. It presents a review/confirmation step, encodes the message before opening WhatsApp, and guards repeat submission. Since no official WhatsApp number is supplied, the booking page clearly communicates that integration is pending and does not claim submission. No customer details are persisted.

## Visual and language direction
Use a restrained charcoal, warm off-white, and muted emerald palette with subtle glass surfaces, readable contrast, and restrained motion. Arabic is the only language; all pages use `lang="ar"` and `dir="rtl"`, with LTR isolation for phone numbers and URLs. Light mode is the first-visit default while respecting system preference; explicit choices persist in localStorage.

## Content integrity
Use the ten supplied service categories and the stated strengths and region only. Do not invent prices, certifications, guarantees, testimonials, business hours, exact map location, staff facts, or contact details. Gallery development placeholders must be visibly identified as placeholders and never presented as company work.

## Accessibility and performance
Use semantic landmarks, keyboard-operable navigation and lightbox, visible focus, field labels and Arabic validation messages, reduced-motion support, responsive images, and lazy loading below the fold. Keep dependencies to Font Awesome and an Arabic web font where available; core layout and actions remain usable without JavaScript.

## Acceptance checks
Review all six pages, internal links, theme behavior, responsive layouts, form validation and pending WhatsApp state, gallery keyboard behavior, SEO files, and Arabic-only content. Do not claim the booking was received unless a configured WhatsApp handoff is actually opened.
