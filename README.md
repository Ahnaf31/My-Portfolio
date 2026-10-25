# Ahnaf Shikder Arnob — Portfolio 2027

Rebuilt from your original portfolio zip, with the same content, projects,
writing, photos and quotes — restyled for 2027 and with heavier JavaScript.

## What's new

- Dark-first design with a Light mode toggle (saved in the browser)
- Full-width bento layout, big serif display type, glass sticky header
- Scroll progress bar, reveal-on-scroll animations, animated stat counters
- Live clocks: Dhaka, London, New York
- Project filter (All / Shopify / Web), project search (press `/`), and
  Quick-view modals for every project, with 3D tilt on banners
- Click a skill chip in the marquee to filter projects by that skill
- FAQ accordion, copy-email button with toast, back-to-top button
- Cursor glow + magnetic buttons on desktop, reduced-motion respected
- Your original Funky mode is kept — same button, same pool photo, same
  funky quote, same emoji burst

## Files

- `index.html` — home page
- `blog.html` — all posts
- `post-how-shopify-found-me.html`, `post-how-i-came-into-digital-marketing.html`
- `styles.css`, `script.js`
- `images/` — your two photos, unchanged
- `Ahnaf-Shikder-CV.pdf` — swapped to your updated CV (Uttara, Dhaka),
  replacing the older Kishoreganj version that was in the original zip

## Two small corrections made from your CV

1. Coalition Technologies is now dated July 2025 – June 2026, not "Current".
2. GitHub link corrected to https://github.com/ahnaf31
   (your original site had github.com/ahnafarnob in its metadata).

## Content kept exactly as you wrote it

Project blurbs, the "40+ storefronts / 10+ countries" stats, both quotes,
both blog posts, and the skills marquee are unchanged — including
React / TypeScript / Hydrogen in the marquee. Those are not in your CV,
so tell me if you want them removed from the portfolio too.

## Run it / deploy it

No build step. Double-click `index.html`, or drag the whole folder to
Netlify Drop. After an update, hard-refresh (Ctrl/Cmd + Shift + R).

## Add a project

In `script.js`, find the `projects` list and add a line like:

```js
{n:"007",name:"Client Name",kind:"Shopify",url:"https://clientsite.com/",blurb:"What you built."},
```

Project banners are now real screenshots saved in `images/` (project-*.jpg), not generated from a live URL service — so they show even where external images are blocked.
