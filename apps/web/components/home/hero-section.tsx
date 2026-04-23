import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, BookOpenText, PlayCircle } from "lucide-react"
import { InstallCommand } from "@/components/home/install-command"

export type HeroSectionProps = {
  preview: ReactNode
}

export function HeroSection({ preview }: HeroSectionProps) {
  return (
    <section className="grid min-w-0 gap-10 px-5 py-10 sm:gap-12 sm:px-8 sm:py-12 lg:grid-cols-[1fr_minmax(0,1.05fr)] lg:items-center lg:gap-14">
      <div className="min-w-0 space-y-8">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2">
            <span className="rounded-sm border border-fd-border bg-fd-muted/50 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-fd-muted-foreground uppercase">
              Open source
            </span>
            <span className="text-[11px] font-medium text-fd-muted-foreground">
              npm package
            </span>
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tighter text-fd-foreground sm:text-5xl lg:text-[3.15rem] lg:leading-[1.08]">
            Embed cards from a single URL
          </h1>
          <p className="max-w-lg text-base leading-7 text-fd-muted-foreground">
            Pass a URL to <code className="font-mono text-sm">EmbedCard</code>{" "}
            and get YouTube, X, Reddit, Google Maps, Vimeo, and more, with a
            sensible fallback when nothing matches.
          </p>
        </div>
        <div className="mt-3">
          <InstallCommand />
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-sm bg-fd-primary px-4 text-sm font-medium text-fd-primary-foreground shadow-sm transition hover:opacity-90"
            href="/docs/getting-started"
          >
            <BookOpenText className="size-4" aria-hidden />
            Documentation
            <ArrowRight className="size-4 opacity-90" aria-hidden />
          </Link>
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-sm border border-fd-border bg-fd-background px-4 text-sm font-medium text-fd-foreground shadow-sm transition hover:bg-fd-muted/50"
            href="#playground"
          >
            <PlayCircle className="size-4" aria-hidden />
            Playground
          </Link>
        </div>
      </div>

      <div className="min-w-0">
        <div className="rounded-sm border border-fd-border bg-fd-card/60 p-4 shadow-sm ring-1 ring-fd-border/40 sm:p-5">
          {preview}
        </div>
      </div>
    </section>
  )
}
