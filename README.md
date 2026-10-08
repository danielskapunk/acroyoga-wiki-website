# Acroyoga Wiki

A static, searchable wiki of acroyoga poses and sequences: names (including aliases), difficulty, cover images, videos, and the transitions that link pose to pose.

- **Pose pages** — `/acro/<file>` (e.g. `/acro/bird`): info table (Nombre, Otros Nombres, Dificultad, Num Personas), cover image, transition list with links and videos, timestamp-aware YouTube embed, plus free-form Markdown (Drills, Variantes, …).
- **Sequence pages** — `/seq/<file>` (e.g. `/seq/ninja-star`).
- **Homepage** — mosaic of every pose with full-text search (Pagefind).

Built with Astro 3 + Tailwind + MDX. Output is fully static (`dist/`) — no server, no database, no test suite.

## Data lives in a nested git repository

All wiki content (Markdown + images) is under `src/content/`, which is **its own git repository**: a clone of [`danielskapunk/acro-wiki`](https://github.com/danielskapunk/acro-wiki) embedded in this repo. It is _not_ a submodule — there is no `.gitmodules`.

What that means in practice:

- This (website) repo also tracks the same content files directly (123 of them), and it is **ahead** of `acro-wiki`: that repo is missing 15 files (e.g. `std-hammock.md`, `hs1-3.png`) and has uncommitted local changes of its own.
- **Commit content changes in this repo only.** Never run `git` inside `src/content/` — you would be committing to the wrong repository.
- If the standalone `acro-wiki` data source needs updating, do it deliberately (copy and commit the files there). It is _not_ synced automatically.

### Adding or editing content

1. Poses: create/edit `src/content/acro/<slug>.md` — the slug is the URL (`bird.md` → `/acro/bird`). Images go in `src/content/acro/images/` and are referenced relatively: `image: './images/foo.png'`.
2. Frontmatter is validated by Zod in `src/content/config.ts`; **the build fails if it is wrong**:
   - required: `name`, `aka: []`, `level` (`easy` | `medium` | `hard`), `image` (must be ≥ 600px wide), `tags: []`, `to: []`, `numPeople` (`two` | `three` | `more`); `video` is optional.
   - `to[].slug` must equal the target file's name without `.md` for the transition to render as a link; leave it empty for plain text.
3. Sequences: same schema but without `to`, in `src/content/seq/<slug>.md`.
4. Verify with `npm run build`.

## Commands

| Command                    | Action                                                                  |
| :------------------------- | :---------------------------------------------------------------------- |
| `npm ci`                   | Install dependencies (npm, `package-lock.json`)                         |
| `npm run dev`              | Dev server → <http://localhost:4321>                                    |
| `npm run build`            | Validate content schemas + build `dist/` + Pagefind search index (~10s) |
| `npm run preview`          | Serve the built `dist/` locally                                         |
| `npx prettier --write <f>` | Format changed files (tabs, single quotes, no semicolons)               |

There is no linter and no test runner: **`npm run build` is the verification step** (it fails on invalid frontmatter). Don't run `npm run astro check` — it prompts interactively to install packages that aren't dependencies.

## Deploying

**GitHub Pages (CI)** — `.github/workflows/deploy.yml` builds with `withastro/action` and publishes to GitHub Pages on every push to `main`.

- Requires repo settings → Pages → Source: **GitHub Actions**.
- Caveat: `site` and `base` are commented out in `astro.config.mjs`. The project-page URL is `https://danielskapunk.github.io/acroyoga-wiki-website/`, so without `base: '/acroyoga-wiki-website'` every internal link and asset resolves to the domain root and 404s. Uncomment both (keeping them in sync with the repo name) if you deploy there.

**Vercel** — this checkout is linked to a Vercel project (`.vercel/`, gitignored), and `vercel.json` sets `cleanUrls: true`.

### Build, check, deploy pre-built
`npm run build` , `npm run preview`, test, `npx vercel --prebuilt`

### Deploy to staging
- this deploys to staging: `npx vercel`
then can either upstage to prod via vercel web or cli npx vercel --prod
- this deploys to prod: `npx vercel --prod`. (this deploys to production!)

### about vercel.json cleanUrls:
- `cleanUrls` matters because `build.format: 'file'` emits `dist/acro/bird.html` instead of `dist/acro/bird/index.html`.

## Manual to other server
— `npm run build`, then host `dist/` on any static host that serves `/acro/bird` from `bird.html` (otherwise add redirects or drop `build.format: 'file'`).

## Repo layout

- `src/content/` — the data (nested repository, see above)
- `src/pages/` — `index.astro` (home + search), `acro/[slug].astro`, `seq/[slug].astro`, `search.astro` (unfinished fuse.js experiment, not the live search)
- `src/components/`, `src/layouts/` — UI; global CSS lives in `src/layouts/Layout.astro` and at the bottom of `src/pages/acro/[slug].astro`
- `astro.config.mjs` — integrations (MDX, Tailwind, Pagefind) plus a custom `remark-directive` plugin that turns `:::section{.variantes}` in Markdown into styled HTML sections
- `AGENTS.md` — working notes for AI agents on this repo

## License

MIT — see [LICENSE](LICENSE).
