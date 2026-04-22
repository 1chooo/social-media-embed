# embed-card

URL embed cards for **YouTube, X, Reddit, Vimeo, Google Maps**, and a link-preview fallback—usable from **React** or as a **web component**. This repo is a **pnpm + Turborepo** monorepo: the publishable package lives in `packages/embed-card`, and `apps/web` is the [live demo and docs](https://1chooo.com/embed-card).

**Requirements:** [Node](https://nodejs.org/) 20+ and [pnpm](https://pnpm.io/) 9 (see `packageManager` in the root `package.json`).

## Workspace layout

```txt
apps/web/          Next.js site + docs playground (URL samples, preview, snippet copy)
packages/embed-card/   npm package: embed cards + providers
packages/ui/           Shared shadcn/ui
examples/              Standalone apps (Next, Vite+React, Vue, Svelte, vanilla)
```

## Install & quick start (React)

```bash
pnpm add embed-card
```

```tsx
import { EmbedCard } from "embed-card"

export function Demo() {
  return <EmbedCard url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
}
```

**Other entry points:** `embed-card/manual` (resolve/render without the full card UI), `embed-card/web-component` (custom element + `registerEmbedCard()`). See `packages/embed-card` and [`examples/`](examples/) for more.

## What the package exposes

- `EmbedCard` — styled card for React / Next.js (`"use client"` where needed)
- `registerEmbedCard()` / custom element — use without React
- `resolveEmbed()` and provider helpers — built-ins plus custom `EmbedProvider`s

## Monorepo commands

```bash
pnpm install
pnpm dev        # docs app (web) only
pnpm build
pnpm lint
pnpm typecheck
pnpm format
```

Run a single workspace:

```bash
pnpm --filter web dev
```

Publish the `embed-card` package (maintainers): `pnpm publish:embed-card` from the repo root.

## License

`embed-card` is published under the [MIT License](packages/embed-card/LICENSE).

![npm downloads](https://33fa1ur95-jz5ocwq7r-1chooo.vercel.app/api/npm/chart?package=embed-card&period=7d&color=%232563eb&width=800&height=300&theme=light)
