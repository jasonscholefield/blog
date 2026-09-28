# Deckard Pain — Blog

A personal blog about UX and game design in games (game feel, onboarding,
interface design, monetization UX, etc.). Visual language is deliberately
copied from https://www.chele.bi/ — dark, minimal, monospace-forward,
sticky table-of-contents on post pages. "Deckard Pain" is a placeholder
name/handle (the user's online handle, a Diablo/Deckard Cain pun) — no
final blog title has been chosen yet. It appears in
`src/layouts/BaseLayout.astro` (header + default `<title>`) and
`src/pages/rss.xml.js` (feed title) — update both if the name changes.

## Stack

- **Astro** (static output, content-first) — same choice as another of the
  user's local projects, for consistency
- **Tailwind CSS v4** (`@theme` tokens in `src/styles/global.css`,
  CSS-first, no `tailwind.config.js`)
- **Content collections** (`src/content.config.ts`) — single `blog`
  collection (`src/content/blog/*.md`), glob loader
- **Geist Sans**, self-hosted as a variable woff2 in `public/fonts/`
  (`@font-face` in `global.css`) — used for headings and body copy
  everywhere, one typeface site-wide. The file was copied out of the
  `geist` npm package, which was then uninstalled since nothing imports it.
  The site went Geist → Inter → Geist at the user's request to compare them
  side by side, so switching again is a two-line change (`@font-face` +
  `--font-sans`). `code`/`pre` in post bodies render in a native monospace
  stack (`--font-mono`, no custom file) via `prose-code:font-mono
  prose-pre:font-mono` on the prose wrapper.
- `@tailwindcss/typography` for post body copy (`prose prose-invert`,
  retinted via `--tw-prose-*` custom properties in `global.css` to match
  the site's own tokens rather than the plugin's defaults)
- `@astrojs/rss` for `/rss.xml`

## Design tokens (`src/styles/global.css`)

Dark theme only, no light mode. Near-black background (`--color-bg:
#101010`) and off-white foreground (`--color-fg: #f5f5f5`) — pulled
directly from chele.bi's computed styles, not eyeballed. No accent color
yet (`--color-accent` currently just aliases `--color-fg`); add one if/when
the design wants a highlight color.

## Content

- `src/content/blog/_template.md` — copy this to start a new post
  (underscore-prefixed files are excluded from the collection by the glob
  pattern `!**/*.{md,mdx}`)
- Two placeholder posts exist (`coyote-time-is-invisible-ux.md`,
  `tutorial-island-problem.md`), each closing with an italicized
  "Placeholder post" line — replace or delete them before launch.
  `the-marathon-that-never-got-made.mdx` is the first real post.
- A post that needs to embed an Astro component (not just markdown) must be
  `.mdx`, not `.md` — import the component at the top of the file (below
  the frontmatter, e.g. `import VideoEmbed from
  '../../components/VideoEmbed.astro';`) and use it inline like JSX. The
  content collection glob (`**/*.{md,mdx}`) already covers both.
  `src/components/VideoEmbed.astro` renders a muted clip with native
  controls (`src`, `poster`, `caption` props). Clips play once each, in page
  order: the earliest mostly-visible unfinished clip plays, and when it ends
  the next visible one starts; clips never play off screen, and a finished
  clip replays after leaving and re-entering the viewport. A reader's manual
  pause/play overrides the sequence (IntersectionObserver in the component's
  script; `prefers-reduced-motion` disables autoplay). Pass no `src` and it
  renders a dashed-border placeholder box labeled with the caption.
  `YouTubeEmbed.astro` (`id`, `title`) embeds via youtube-nocookie. Both
  break out to `w-[min(880px,90vw)]` below `lg`, but stay inside the text
  column at `lg`+ so they don't slide under the TOC.
- Clips live in `public/videos/<post>/` as H.264 1080p60 MP4, no audio,
  with a `.jpg` poster from the first frame. Source recordings are 4K and
  huge; encode with `-crf 28 -maxrate 3M -bufsize 6M -movflags +faststart
  -an`. The user's recordings often start on a single black frame — trim it
  (`trim=start_frame=1,setpts=PTS-STARTPTS`) or the poster is black and the
  loop flashes.
- Converting a `.md` post to `.mdx` (or vice versa) requires a dev server
  restart to pick up — Astro's content layer doesn't always hot-reload a
  file **type** change, only edits to an existing file.
- Post images live in `src/assets/blog/` and are referenced with a relative
  markdown path (`![alt](../../assets/blog/name.png)`) so Astro optimizes
  them. The post template styles them as bordered, rounded cards
  (`prose-img:*` on the prose wrapper). If the dev server shows an
  unresolved `__astro_image_` attribute after adding one, restart it; the
  production build is unaffected.
- Frontmatter: `title, summary, date, coverImage?, tags[], draft`
- Only `##` (h2) headings appear in the post-page table of contents
  (`src/components/TOC.astro` filters `depth === 2`) — deeper headings
  render in the body but aren't listed in the sidebar, matching chele.bi's
  flat TOC style

## Pages/components

- `src/pages/index.astro` — bio blurb + full post list (no pagination yet;
  add it if the post count grows)
- `src/pages/blog/[...slug].astro` — post template: meta line (date ·
  reading time · author), title, tag pills, two-column layout with
  `TOC.astro` (sticky, `lg:` breakpoint and up only) beside the prose body
- `src/components/TOC.astro` — active-section highlighting via
  `IntersectionObserver` (vanilla JS, no library). The `<nav>` stretches to
  the article's full height; the inner `<ul>` is what's `sticky` (sticky on
  the stretched nav never engages)
- Every post ends with the handwritten signature (`src/assets/signature.png`,
  white on transparent), rendered by the post template with
  `densities={[1, 2]}` so it stays crisp on scaled displays
- Reading time is computed at render time from word count (`body.split /
  \s+/`, 200wpm) — not stored in frontmatter
- Footer (`src/layouts/BaseLayout.astro`) link row: **deliberately excludes
  anything tied to the user's real name** (no email, no LinkedIn) — this
  blog is meant to stand apart from their real-name-identified work. Only
  Goodreads (under the "Deckard Pain" handle) and the site's own RSS feed
  are linked. Don't add real-name-linked accounts here without asking.

## Bookshelf (`src/components/BookShelf.astro`, `src/data/books.ts`)

Bottom-of-homepage "currently reading" widget copied from a reference
screenshot the user supplied — a fanned row of book covers with a
"Currently reading" caption underneath and a link to the user's Goodreads
profile. No side/label text, per user request (the reference had a
numbered section label next to it that was deliberately left out).
Books are laid out in a `1fr auto 1fr` CSS grid (not a single flex row) so
the `current: true` book's own column always sits at the row's true visual
center regardless of how many books are on each side — a plain centered
flex row drifts off-center whenever the left/right counts differ, which is
what prompted the switch. Each cover slot is a fixed pixel size with
`object-cover` (not each cover's natural aspect ratio) so overlap/spacing
stays predictable across covers with wildly different real dimensions.
Rendered full-bleed via the `left-1/2 -ml-[50vw] w-screen` breakout trick
so it isn't boxed into the `max-w-3xl` homepage column.

Covers come from Open Library's public covers API — most books resolve
from `isbn`, but a few editions had no cover indexed under their ISBN even
though a cover exists under a specific Open Library cover id, so
`Book.coverId` is a fallback for those (see the comment in `books.ts` for
how to look one up). One book (`HIVE`) has no Open Library record at all,
so it uses `Book.coverImageUrl` — a direct hotlink to its Goodreads cover
image — as a last resort.

The current list is the user's real reading order (verified title-by-title
against their Goodreads pages, not guessed from memory), nearest-to-current
placed closest to it on each side, furthest at the ends.

## Known gaps / next steps

- No name chosen yet — see the placeholder note at the top of this file
- No domain yet — `astro.config.mjs` has no `site` set, so `rss.xml.js`
  falls back to `https://example.com` for absolute URLs; set `site` once a
  domain exists
- Not yet a git repository — init one before connecting to Vercel
- `public/favicon.ico` / `favicon.svg` are still Astro's default rocket
  logo — replace with a real mark
- No tagging/filter UI yet — tags render as static pills, not links
- No pagination — fine at 2 posts, will need one eventually

## Development

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`,
and `astro dev logs` — same convention as the portfolio site.
