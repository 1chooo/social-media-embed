"use client"

import { useState } from "react"

import { EmbedCard } from "embed-card"

import { demoThemes, sampleEmbeds } from "@/lib/sample-urls"

function pillClassName(isActive: boolean): string {
  return [
    "inline-flex min-h-11 items-center rounded-full border px-4 py-2.5 text-sm font-medium transition",
    isActive
      ? "border-fd-primary bg-fd-primary text-fd-primary-foreground"
      : "border-fd-border bg-white/80 text-fd-foreground hover:bg-fd-muted dark:bg-white/5 dark:hover:bg-white/10",
  ].join(" ")
}

export function EmbedShowcase() {
  const [url, setUrl] = useState<string>(sampleEmbeds[0].url)
  const [themeId, setThemeId] = useState<string>(demoThemes[0].id)

  const activeTheme =
    demoThemes.find((theme) => theme.id === themeId) ?? demoThemes[0]

  const installSnippet = `pnpm add embed-card`
  const componentSnippet = `import { EmbedCard } from "embed-card"

export function SocialEmbed() {
  return <EmbedCard url="${url}" />
}`
  const themeSnippet = `import { EmbedCard } from "embed-card"

export function BrandedEmbed() {
  return (
    <EmbedCard
      url="${url}"
      theme={{
        accentColor: "${activeTheme.theme.accentColor}",
        radius: ${activeTheme.theme.radius},
      }}
    />
  )
}`
  const webComponentSnippet = `import { registerEmbedCard } from "embed-card/web-component"

registerEmbedCard()

<embed-card url="${url}"></embed-card>`

  return (
    <section
      className="grid min-w-0 gap-6 xl:grid-cols-[1.05fr_0.95fr]"
      id="playground"
    >
      <div className="grid min-w-0 gap-6">
        <article className="min-w-0 rounded-[34px] border border-fd-border/70 bg-white/80 p-6 shadow-[0_22px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-white/5 sm:p-8">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
                Live playground
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Try a URL and switch the package theme
              </h2>
            </div>

            <label className="grid min-w-0 gap-2 text-sm font-medium">
              Embed URL
              <input
                className="h-12 w-full min-w-0 rounded-2xl border border-fd-border bg-white px-4 font-mono text-base outline-none transition focus:border-fd-primary focus:ring-4 focus:ring-fd-primary/10 sm:text-sm dark:bg-white/10"
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                spellCheck={false}
                value={url}
              />
            </label>

            <div className="grid gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
                Sample providers
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleEmbeds.map((sample) => (
                  <button
                    className={pillClassName(sample.url === url)}
                    key={sample.label}
                    onClick={() => setUrl(sample.url)}
                    type="button"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
                Theme presets
              </span>
              <div className="flex flex-wrap gap-2">
                {demoThemes.map((theme) => (
                  <button
                    className={pillClassName(theme.id === themeId)}
                    key={theme.id}
                    onClick={() => setThemeId(theme.id)}
                    type="button"
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="min-w-0 rounded-[34px] border border-fd-border/70 bg-gradient-to-br from-white to-white/70 p-5 shadow-[0_28px_90px_rgba(15,23,42,0.08)] dark:from-white/5 dark:to-white/10 sm:p-7">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
                Preview
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                `EmbedCard` rendered from the workspace package
              </h3>
            </div>
            <div className="shrink-0 self-start rounded-full border border-fd-border/70 bg-white px-3 py-1.5 text-xs font-medium text-fd-muted-foreground dark:bg-white/5 sm:self-auto">
              Theme: {activeTheme.label}
            </div>
          </div>

          <div className="w-full min-w-0 break-words">
            <EmbedCard theme={activeTheme.theme} url={url} />
          </div>
        </article>
      </div>

      <div className="grid min-w-0 gap-6">
        <article className="min-w-0 rounded-[34px] border border-white/10 bg-zinc-950 p-6 text-zinc-50 shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            Quick start
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
            Install once, then choose the surface you want
          </h3>

          <pre className="mt-5 min-w-0 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-100">
            <code>{installSnippet}</code>
          </pre>

          <pre className="mt-4 min-w-0 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-100">
            <code>{componentSnippet}</code>
          </pre>

          <pre className="mt-4 min-w-0 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-100">
            <code>{themeSnippet}</code>
          </pre>
        </article>

        <article className="min-w-0 rounded-[34px] border border-fd-border/70 bg-white/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] dark:bg-white/5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
            Framework story
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
            React first, but not React only
          </h3>
          <p className="mt-3 text-sm leading-7 text-fd-muted-foreground">
            The same package exports a React component, a custom element
            registrar, and low-level helpers for manual rendering. That keeps
            the install surface small while still leaving room for Vue, Svelte,
            Astro, or plain HTML integrations.
          </p>

          <pre className="mt-5 min-w-0 overflow-x-auto rounded-2xl border border-fd-border/70 bg-black/[0.03] p-4 text-sm leading-7 dark:bg-white/5">
            <code>{webComponentSnippet}</code>
          </pre>
        </article>
      </div>
    </section>
  )
}
