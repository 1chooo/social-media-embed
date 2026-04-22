import Link from "next/link"
import { ArrowRight, BookOpenText, PlayCircle } from "lucide-react"

import { HomePlaygroundSection } from "@/components/home-playground-section"
import { ThemedEmbedCard } from "embed-card/next-themes"

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

        <div className="min-w-0">
          <ThemedEmbedCard
            theme={{
              accentColor: "#e11d48",
              radius: 20,
            }}
            url={exampleUrl}
          />
        </div>
      </section>

      <HomePlaygroundSection />
    </main>
  )
}
