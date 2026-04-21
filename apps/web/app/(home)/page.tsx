import Link from "next/link"
import { ArrowRight, BookOpenText, PlayCircle } from "lucide-react"

import { EmbedCard } from "embed-card"

import { EmbedPlayground } from "@/components/embed-playground"

const exampleUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-16 px-6 py-16 md:px-10 md:py-20">
      <section className="grid min-w-0 gap-12 lg:grid-cols-[1fr_minmax(0,1.05fr)] lg:items-center lg:gap-14">
        <div className="min-w-0 space-y-8">
          <div className="space-y-5">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-fd-foreground sm:text-5xl">
              Embed cards from a single URL
            </h1>
            <p className="max-w-lg text-base leading-7 text-fd-muted-foreground">
              Pass a URL to <code className="text-sm">EmbedCard</code> and get
              YouTube, X, Reddit, Google Maps, Vimeo, and more, with a sensible
              fallback when nothing matches.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-md bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition hover:opacity-90"
              href="/docs/getting-started"
            >
              <BookOpenText className="size-4" />
              Documentation
              <ArrowRight className="size-4" />
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-md border border-fd-border px-4 py-2.5 text-sm text-fd-foreground transition hover:bg-fd-muted/50"
              href="#playground"
            >
              <PlayCircle className="size-4" />
              Playground
            </Link>
          </div>
          <p className="max-w-lg text-sm leading-6 text-fd-muted-foreground">
            React, web component, and manual rendering paths ship from one
            package. Examples live in the repo under{" "}
            <code className="text-xs">examples/</code>. The same playground also
            lives under{" "}
            <Link
              className="font-medium text-fd-foreground underline-offset-2 hover:underline"
              href="/docs/playground"
            >
              /docs/playground
            </Link>{" "}
            if you prefer the docs layout.
          </p>
        </div>

        <div className="min-w-0 rounded-lg p-5 md:p-6">
          <div className="w-full min-w-0">
            <EmbedCard
              theme={{
                accentColor: "#e11d48",
                borderColor: "rgba(225, 29, 72, 0.18)",
                radius: 20,
                shadow: "0 20px 60px rgba(225, 29, 72, 0.12)",
              }}
              url={exampleUrl}
            />
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-24 border-t border-fd-border pt-16"
        id="playground"
      >
        <div className="mb-8 max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-fd-foreground">
            Playground
          </h2>
          <p className="text-sm leading-6 text-fd-muted-foreground">
            Choose a sample URL and a theme preset—the preview updates right
            away. Copy the React snippet for your app, or open{" "}
            <Link
              className="font-medium text-fd-foreground underline-offset-2 hover:underline"
              href="/docs/playground"
            >
              /docs/playground
            </Link>{" "}
            for full slider controls.
          </p>
        </div>
        <EmbedPlayground bleed={false} defaultSnippetOpen={false} mode="simple" />
      </section>
    </main>
  )
}
