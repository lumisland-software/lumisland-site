---
version: alpha
name: "Lumisland"
description: "Estúdio independente de web design e desenvolvimento full stack."
colors:
  primary: "#3159DC"
  primary-hover: "#2345BD"
  ink: "#17213B"
  midnight: "#0D1730"
  background: "#F5F7FB"
  surface: "#FFFFFF"
  line: "#DBE2EF"
  muted: "#5D6980"
  ice: "#C5D5FF"
typography:
  sans:
    fontFamily: "DM Sans, Arial, sans-serif"
  display:
    fontFamily: "Outfit, Arial, sans-serif"
  mono:
    fontFamily: "IBM Plex Mono, Consolas, monospace"
rounded:
  DEFAULT: "12px"
  lg: "24px"
  pill: "999px"
spacing:
  section-gap: "110px"
  page-max: "1280px"
components:
  button: {}
  navigation: {}
  project: {}
  form: {}
---

# Lumisland Design System

## Overview

### Creative North Star

A digital design studio presented as a curated product gallery. Precise typography,
cool white surfaces and an original blue parametric sculpture connect creative
work with engineering. The sculpture is the expressive signature; the rest of the
site is deliberately quiet, readable and grounded in existing products.

### Product context and register

- Brand/marketing site, not an authenticated application. Portuguese businesses
  choosing a website, bespoke software or operational automation.
- Portuguese (Portugal); TVDE preserves its existing language switcher and copy.
- Evidence: existing service pages, product links, founder biography and README.
- Primary visitor journey: understand the expertise, explore a product, contact.
- No invented clients, testimonials, awards, growth metrics or experience claims.
- The lighthouse mark and founder photograph remain identifiable.
- Runtime owner: `css/premium.css` variables. This file documents those values;
  no generated theme or separate token library. Existing product styles are loaded
  first, then the shared premium layer, on every public HTML page.
- Brand permission: user requested a complete premium redesign on 2026-09-23.

## Colors

Cool white is the main canvas. Ink carries typography; blue carries interactive
emphasis. Midnight separates the process and contact sections. Product previews
retain contextual lilac, workshop blue and fleet green, with labels explaining
that the homepage previews are illustrative. Product commercial claims, pricing,
signup destinations and legal text retain their existing source content.

## Typography

Outfit 400/500 for expressive headings, DM Sans 400–700 for readable copy, IBM
Plex Mono for small editorial labels. Use sentence case, meaningful labels and
Portuguese accents. Display headings scale down at 760px. Body copy is generally
15–17px; compact preview data is illustrative and hidden from assistive technology.
Fonts use Google Fonts with swap and system fallbacks; no font-dependent controls.

## Layout

Maximum container 1280px; desktop gutters 48px, tablet 32px, mobile 20px. Hero pairs
three lines of headline with the sculpture. Projects lead the narrative; expertise,
process, founder and contact follow. Grids collapse without changing reading order.
Section spacing is 110px desktop and 76px mobile. The fixed header is 88px/76px;
anchor offsets reserve 112px. The document owns scrolling.

## Elevation & Depth

Depth comes from the sculpture, product surfaces and modest shadows. Frosted header
and floating consent notice are the only persistent elevated chrome. Never stack
WhatsApp over consent actions. Product visual containers clip their decorative
previews, not interactive controls or narrative content.

## Shapes

12px base radius, 20–24px feature surfaces, pill navigation actions. The existing
lighthouse logo remains unchanged except for the final shape's contrast against
the light header. Use fine cool borders rather than heavy card shadows.

## Components

### Foundational visual states

Links/buttons use native semantics, visible focus, hover and active feedback.
Disabled submit buttons keep their width and expose busy state. Forced colors
retain system scrollbars and control borders.

### Buttons and actions

Solid blue primary actions, ink header CTA, quiet text links. Avoid several primary
actions competing in one section. Controls are at least 44px where practical.

### Navigation and data display

Desktop links become a disclosure menu below 1001px. Escape closes it and restores
focus; outside click, navigation and focus leaving close it. Existing native
product dropdowns, FAQ disclosures and TVDE language controls retain their behavior.

### Forms and overlays

Existing FormSubmit action, hidden fields, consent and success destination are
preserved. JavaScript adds inline validation, focuses the first invalid field,
retains values and prevents duplicate submits. Without JS, native validation works.
Native selects intentionally retain platform-owned popup behavior. Textareas grow
with content. No invented local success message; delivery remains FormSubmit-owned.

### Iconography

Existing lighthouse SVG, simple arrows and line-based WhatsApp icon. Decorative
marks are hidden from assistive technology. Icon-only links have explicit names.

### Motion

The original knot rotates at a capped 25fps using Canvas 2D; no external 3D library.
Pause/Resume is visible. The animation stops outside the viewport and in hidden
tabs. Reduced motion starts it paused; visitors can explicitly resume it. Static
SVG fallback survives disabled JS or unavailable canvas. Existing scroll reveals
remain progressive enhancements, with all content visible without JS or with
reduced motion. Hover lift is 200–650ms and disabled under reduced motion.

### Content and data visualization

Specific products and capabilities replace abstract service counts. Homepage
previews use illustrative schedules/workflows, not customer data or claimed results.
Keep the contact human, direct and practical. Preserve the substance of privacy,
cookies, pricing and commercial conditions when editing presentation.

## Solution pages — 25 September 2026

The four routes linked from Sobre use `css/solutions.css`, loaded after the shared
brand layer. `.solution-page` scopes every override; other public pages retain
their existing presentation. The new stage composition pairs editorial type with
an illustrative product preview, followed by lighter feature lists and clear
commercial sections. Pricing, trial terms, destinations and form contracts stay
unchanged.

- Oficina and Websites: cobalt `#3159dc`, tint `#e9efff`, deep `#193b98`.
- Áurea: plum `#834465`, tint `#f3e9f0`, deep `#522b41`; photography and an
  illustrative day card introduce the product, followed by sector portraits.
- TVDE: green `#187861`, tint `#e5f3ed`, deep `#124a3d`; preview, workflows and
  commercial modes share the same accent.
- Website illustration: original HTML/CSS desktop and mobile design study,
  explicitly labelled illustrative. No fabricated customer project or metric.
- Hero stages use a 30px radius (20px mobile); h1 scales 41–76px. Two columns
  become one below 1000px, with all four pages verified down to 320px.
- Motion reuses existing progressive scroll reveals and adds restrained hover
  movement; reduced motion disables solution animations/transitions.
- TVDE language choice is a native, labelled select with a 44px control height.
  The OS owns its popup. The existing six catalogs and saved-locale key remain
  unchanged; `translate="no"` protects product marks and language names.

## Do's and Don'ts

- Do make implemented Lumisland products visible proof of capability.
- Do reuse the shared brand layer across all public pages.
- Do keep the sculpture optional and stop work when it is not visible.
- Don't add fake statistics, testimonials, clients or performance guarantees.
- Don't introduce frameworks or heavy visual dependencies to this static site.
- Don't publish to production without the user's release authorization.
