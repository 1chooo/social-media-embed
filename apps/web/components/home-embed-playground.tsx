"use client"

import { useMemo, useState } from "react"

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

import { buildUrlOnlySnippet, pillClassName } from "@/components/embed-playground-shared"
import { sampleEmbeds } from "@/lib/sample-urls"
import { ThemedEmbedCard } from "embed-card/next-themes"

export type HomeEmbedPlaygroundProps = {
  /** Initial sample URL when the block mounts. */
  url?: string
  /** Wider breakout on small viewports (matches docs playground bleed). */
  bleed?: boolean
}

export function HomeEmbedPlayground({
  url: initialUrl = sampleEmbeds[0].url,
  bleed = false,
}: HomeEmbedPlaygroundProps) {
  const [url, setUrl] = useState<string>(initialUrl)

  const snippet = useMemo(() => buildUrlOnlySnippet(url), [url])

  const outerClass = [
    "not-prose flex min-h-0 min-w-0 flex-col border border-fd-border bg-fd-background lg:flex-row lg:rounded-sm",
    bleed ? "-mx-4 lg:-mx-6" : "overflow-hidden rounded-sm shadow-sm",
  ].join(" ")

  return (
    <div className={outerClass}>
      <div className="flex min-h-[260px] flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 lg:min-h-[min(440px,calc(100dvh-20rem))]">
        <div className="w-full max-w-3xl min-w-0">
          <ThemedEmbedCard
            theme={{
              accentColor: "#e11d48",
              radius: 8,
            }}
            url={url}
          />
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-5 border-t border-fd-border bg-fd-background px-4 py-5 sm:px-5 lg:w-[min(100%,400px)] lg:border-t-0 lg:border-l lg:py-6">
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

        <DynamicCodeBlock
          code={snippet}
          lang="tsx"
          codeblock={{
            className:
              "not-prose my-0 max-h-64 overflow-auto rounded-sm border border-fd-border bg-fd-muted/30 text-[11px] leading-relaxed text-fd-foreground",
          }}
        />
      </aside>
    </div>
  )
}
