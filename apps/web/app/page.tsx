import Link from "next/link"
import {
  ArrowRight,
  BookOpenText,
  Boxes,
  Code2,
  PlayCircle,
} from "lucide-react"

import { EmbedCard } from "embed-card"

import { EmbedShowcase } from "@/components/embed-showcase"

const exampleUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-14 px-6 py-10 md:px-10 lg:gap-16 lg:py-14">
      <section className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="min-w-0 space-y-6">
          <div className="inline-flex rounded-full border border-fd-border/70 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground dark:bg-white/5">
            One app for docs and demos
          </div>
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              Ship the package docs and the live playground from the same
              Next.js app.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-fd-muted-foreground">
              `embed-card` now has a single home in the workspace: the
              documentation lives under `/docs`, and the interactive playground
              lives right here on the homepage.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-3 text-sm font-semibold text-fd-primary-foreground transition hover:opacity-90"
              href="/docs/getting-started"
            >
              Read the docs
              <ArrowRight className="size-4" />
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-fd-border/70 bg-white/75 px-5 py-3 text-sm text-fd-muted-foreground transition hover:bg-fd-muted dark:bg-white/5 dark:hover:bg-white/10"
              href="#playground"
            >
              <PlayCircle className="size-4" />
              Jump to the playground
            </Link>
          </div>
          <div className="rounded-[28px] border border-fd-border/70 bg-white/75 p-5 dark:bg-white/5">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <BookOpenText className="size-4 text-rose-500" />
              What ships today
            </div>
            <ul className="mt-4 grid gap-3 text-sm leading-7 text-fd-muted-foreground">
              <li>One publishable `embed-card` package in `packages/embed-card`.</li>
              <li>Docs pages and the live playground inside `apps/web`.</li>
              <li>React, web component, and manual rendering examples in one place.</li>
              <li>Interactive provider and theme demos wired to the real workspace package.</li>
            </ul>
          </div>
        </div>

        <div className="min-w-0 rounded-[34px] border border-fd-border/70 bg-white/80 p-5 shadow-[0_28px_90px_rgba(15,23,42,0.12)] dark:bg-white/5 sm:p-7">
          <div className="w-full min-w-0">
            <EmbedCard
              theme={{
                accentColor: "#e11d48",
                borderColor: "rgba(225, 29, 72, 0.2)",
                radius: 30,
                shadow: "0 28px 100px rgba(225, 29, 72, 0.16)",
              }}
              url={exampleUrl}
            />
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-4 md:grid-cols-3">
        <article className="rounded-[28px] border border-fd-border/70 bg-white/70 p-5 dark:bg-white/5">
          <Boxes className="size-5 text-rose-500" />
          <h2 className="mt-4 text-lg font-semibold">One surface</h2>
          <p className="mt-2 text-sm leading-7 text-fd-muted-foreground">
            The demo no longer lives in a separate app, so the docs and the
            playground evolve together.
          </p>
        </article>
        <article className="rounded-[28px] border border-fd-border/70 bg-white/70 p-5 dark:bg-white/5">
          <Code2 className="size-5 text-sky-500" />
          <h2 className="mt-4 text-lg font-semibold">Real package imports</h2>
          <p className="mt-2 text-sm leading-7 text-fd-muted-foreground">
            The homepage preview renders `embed-card` directly from the
            workspace package, so breakages show up early.
          </p>
        </article>
        <article className="rounded-[28px] border border-fd-border/70 bg-white/70 p-5 dark:bg-white/5">
          <PlayCircle className="size-5 text-emerald-500" />
          <h2 className="mt-4 text-lg font-semibold">Provider coverage</h2>
          <p className="mt-2 text-sm leading-7 text-fd-muted-foreground">
            You can switch between YouTube, X, Reddit, Google Maps, and Vimeo
            without leaving the landing page.
          </p>
        </article>
      </section>

      <EmbedShowcase />
    </main>
  )
}
