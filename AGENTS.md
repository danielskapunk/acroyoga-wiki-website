# AGENTS.md

Astro 7 static site (Node ≥22.12; `.nvmrc` pins 24): an acroyoga wiki. Almost all content is Markdown in content collections. No server, no DB, no test suite, no linter.

## Commands

- `npm run dev` — dev server at `localhost:4321`
- `npm run build` — **the only real verification**: content-schema (Zod) validation + build + Pagefind index. ~10s, output in `dist/`
- `npm run preview` — serve `dist/`
- `npx prettier --write <files you touched>` — repo is only partially formatted (7 files currently fail `prettier --check .`), so don't reformat the whole tree; `.prettierrc` warns `pluginSearchDirs` is obsolete in Prettier 3, that warning is harmless
- `npx astro sync` — regenerate `.astro/types.d.ts` (gitignored) if TS complains after a fresh clone
- **Don't run `npm run astro check`**: `@astrojs/check` and `typescript` are not dependencies; it hangs on an interactive install prompt

Order: edit → prettier → `npm run build`. `npm run build` failing on frontmatter is the normal failure mode.

## Structure

- `src/content/acro/*.md` — poses → route `/acro/<filename>` (e.g. `bird.md` → `/acro/bird`); images colocated in `src/content/acro/images/`
- `src/content/seq/*.md` — sequences → route `/seq/<filename>`
- `src/content/transitions/*.md` — transition pages → route `/transitions/<filename>`; currently empty (the collection + route exist, links activate when a file appears)
- `src/content.config.ts` — Content Layer collections (`glob()` loaders, `z` from `astro/zod`). Build fails on invalid frontmatter:
  - acro: `name`, `shortName` (optional), `aka[]`, `level` (easy|medium|hard), `image` (relative path, ≥600px wide enforced in `getStaticPaths`, not the schema), `tags[]`, `transitions[]`, `numPeople` (two|three|more); `video` optional
  - seq: same, but no `transitions[]`
  - transitions: `name`, `aka[]` (default `[]`), `tags[]` (default `[]`); `video` optional
- `src/pages/index.astro` — homepage grid + Pagefind search; `src/pages/acro/[slug].astro`, `src/pages/seq/[slug].astro`, `src/pages/transitions/[slug].astro` — entry renderers; `src/layouts/Layout.astro` — shell/global CSS; `src/lib/transitions.ts` — slugify + pose/transition link resolution
- `astro.config.mjs` — registers a custom `remark-directive` plugin: markdown `:::section{.variantes}` becomes an HTML `<section>` (styled by the global CSS at the bottom of `src/pages/acro/[slug].astro`)

## Gotchas

- **Nested git repo**: `src/content/.git` is a second, unregistered repo (remote `danielskapunk/acro-wiki`) with an out-of-sync history; the outer repo tracks the same content files itself. **Commit content changes only in the outer repo.** Never run git inside `src/content/`.
- **Deploy config is contradictory** and neither side is self-consistent: `.github/workflows/deploy.yml` publishes to GitHub Pages on push to `main`, but `site`/`base` are commented out in `astro.config.mjs` (needed for a `/acroyoga-wiki-website` project-page subpath), while `vercel.json` (`cleanUrls`) + `.vercel/` point at a Vercel deploy. Don't uncomment `site`/`base`, and don't delete either deploy file, without asking — builds are unaffected either way.
- `build.format: 'file'` → `dist/acro/bird.html`, not `bird/index.html`.
- **Two search implementations exist.** The real one is Pagefind (`astro-pagefind`), whose index only exists after `npm run build` (`dist/pagefind`). `src/pages/search.astro` is an unfinished fuse.js experiment (hardcoded `fuse.search('ird')`, renders an empty mosaic) — don't wire it up as if it were the product.
- Transitions are **local to the pose page being edited** (`transitions[]` frontmatter): each entry has `name`, optional `aka[]`, `pose` (slug of the _other_ pose — required), `direction` relative to this pose (`in` = other → here, `out` = here → other, `both` = both sections), optional `slug` (transition-page slug override, else derived from `name` via slugify), optional `video`. No graph/normalization — don't add one. A `pose` links to `/acro/<slug>` only when that page exists, else renders as prettified text; a transition `name` links to `/transitions/<slug>` only when `src/content/transitions/<slug>.md` exists (slugify: lowercase, non-alphanumerics → `-`). `aka` renders only on the transition page.
- YouTube URLs in `video`/`transitions[].video` may carry `?t=`/`&start=`; `src/pages/acro/[slug].astro` parses them into the embed `start` param.

## Conventions

- Prettier style (enforced via `.prettierrc`): tabs, single quotes, no semicolons, printWidth 100, Tailwind class sorting. Matches existing files — follow it.
- UI copy is Spanish (Nombre, Transiciones, Variantes, Descripción); keep new UI strings Spanish.
- npm with `package-lock.json` (use `npm ci` for clean installs); `engines.node` is `>=22.12.0` (Astro 7's floor), `.nvmrc` and CI pin 24.
