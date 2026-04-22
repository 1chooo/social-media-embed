"use client"

import { useCallback, useMemo, useState } from "react"

import type { EmbedCardTheme } from "embed-card"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

import { buildSnippet, pillClassName } from "@/components/embed-playground-shared"
import { demoThemes, sampleEmbeds } from "@/lib/sample-urls"
import { ThemedEmbedCard } from "embed-card/next-themes"

export type HomeEmbedPlaygroundProps = {
  /** Match docs playground: false = contained card on the marketing page. */
  bleed?: boolean
}

export function HomeEmbedPlayground({ bleed = false }: HomeEmbedPlaygroundProps) {
  const [url, setUrl] = useState<string>(sampleEmbeds[0].url)
  const [presetId, setPresetId] = useState<(typeof demoThemes)[number]["id"]>(
    demoThemes[0].id
  )
  const [copied, setCopied] = useState(false)

  const cardTheme = useMemo((): EmbedCardTheme => {
    const entry = demoThemes.find((d) => d.id === presetId) ?? demoThemes[0]
    return {
      radius: entry.theme.radius,
    }
  }, [presetId])

  const snippet = useMemo(
    () => buildSnippet(url, cardTheme),
    [url, cardTheme]
  )

  const copySnippet = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [snippet])

  const reset = useCallback(() => {
    setUrl(sampleEmbeds[0].url)
    setPresetId(demoThemes[0].id)
  }, [])

  const outerClass = [
    "not-prose flex min-h-0 min-w-0 flex-col border border-fd-border bg-fd-background lg:flex-row lg:rounded-lg",
    bleed ? "-mx-4 lg:-mx-6" : "overflow-hidden rounded-xl shadow-sm",
  ].join(" ")

  return (
    <div className={outerClass}>
      <div className="flex min-h-[280px] flex-1 flex-col lg:min-h-[min(520px,calc(100dvh-16rem))]">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-6 lg:px-10">
          <div className="w-full max-w-3xl min-w-0">
            <ThemedEmbedCard theme={cardTheme} url={url} />
          </div>
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-0 border-t border-fd-border bg-fd-background lg:w-[min(100%,400px)] lg:border-t-0 lg:border-l lg:overflow-y-auto lg:self-start">
        <div className="flex items-center justify-between gap-2 border-b border-fd-border px-4 py-3 sm:px-5">
          <span className="text-xs font-semibold text-fd-foreground">
            Options
          </span>
          <div className="flex shrink-0 gap-2">
            <button
              className="rounded-md border border-fd-border px-2.5 py-1.5 text-[11px] font-medium text-fd-muted-foreground transition hover:bg-fd-muted/50 hover:text-fd-foreground"
              onClick={reset}
              type="button"
            >
              Reset
            </button>
            <button
              className="rounded-md border border-fd-border bg-fd-primary px-2.5 py-1.5 text-[11px] font-medium text-fd-primary-foreground transition hover:opacity-90"
              onClick={copySnippet}
              type="button"
            >
              {copied ? "Copied" : "Copy code"}
            </button>
          </div>
        </div>

        <div className="space-y-8 px-4 py-6 sm:px-5">
          <div>
            <p className="text-xs font-semibold text-fd-foreground">Source</p>
            <label className="mt-3 block text-[11px] font-medium text-fd-muted-foreground">
              URL
              <input
                className="mt-1.5 h-10 w-full rounded-md border border-fd-border bg-fd-background px-3 font-mono text-xs text-fd-foreground outline-none transition placeholder:text-fd-muted-foreground focus-visible:border-fd-primary focus-visible:ring-2 focus-visible:ring-fd-primary/25"
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                spellCheck={false}
                value={url}
              />
            </label>
            <p className="mt-3 text-[11px] font-medium text-fd-muted-foreground">
              Samples
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
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

          <div>
            <p className="text-xs font-semibold text-fd-foreground">
              Presets
            </p>
            <p className="mt-1 text-[11px] text-fd-muted-foreground">
              Pick a shape preset.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {demoThemes.map((preset) => (
                <button
                  className={pillClassName(presetId === preset.id)}
                  key={preset.id}
                  onClick={() => setPresetId(preset.id)}
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-fd-border pt-6">
            <p className="text-xs font-semibold text-fd-foreground">
              React snippet
            </p>
            <DynamicCodeBlock
              code={snippet}
              lang="tsx"
              codeblock={{
                allowCopy: false,
                className:
                  "not-prose my-0 mt-3 max-h-56 overflow-auto rounded-md border border-fd-border bg-fd-muted/30 text-[11px] leading-relaxed text-fd-foreground",
              }}
            />
          </div>
        </div>
      </aside>
    </div>
  )
}
