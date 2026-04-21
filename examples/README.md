# Examples

Each folder is a **standalone app** (similar in spirit to [Next.js examples](https://github.com/vercel/next.js/tree/canary/examples)) that depends on `embed-card` and shows the same demo with the same layout across stacks.

## Run one example locally

```bash
cd examples/<name>
pnpm install
pnpm dev
```

## Monorepo checks (Turborepo)

Examples are listed in the root `pnpm-workspace.yaml`, so they participate in root scripts:

- `pnpm build` — runs `build` in every workspace package that defines it, including all examples (after `embed-card` builds via `^build`).
- `pnpm typecheck` — runs `typecheck` in each example (after dependency packages have finished `typecheck` and `build`, so `embed-card`’s `dist/` is available).
- `pnpm lint` — unchanged; examples do not define `lint`, so Turbo skips them for that task.

Root `pnpm dev` is scoped to the docs app only (`turbo dev --filter=web`) so example `dev` scripts do not start extra dev servers when you run the monorepo default dev command.
