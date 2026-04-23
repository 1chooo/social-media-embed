import Link from "next/link"
import { PanelRight } from "lucide-react"

import { HomeEmbedPlayground } from "@/components/home-embed-playground"
import { InstallCommand } from "@/components/home/install-command"

const btnOutline =
  "inline-flex items-center justify-center rounded-sm border border-fd-border px-2.5 py-1.5 text-[11px] font-medium text-fd-muted-foreground transition hover:bg-fd-muted/50 hover:text-fd-foreground"
const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-sm border border-fd-border bg-fd-primary px-2.5 py-1.5 text-[11px] font-medium text-fd-primary-foreground transition hover:opacity-90"

/**
 * Centered block + wide demo, matching the Chat docs “Event-driven by design”
 * {@link https://github.com/vercel/chat/blob/main/apps/docs/app/%5Blang%5D/(home)/page.tsx home layout} pattern.
 */
export function HomePlaygroundSection() {
  return (
    <section
      className="scroll-mt-24 border-t border-fd-border"
      id="playground"
    >
      <div className="grid gap-10 overflow-hidden px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto grid max-w-2xl gap-4 text-center">
          <h2 className="text-balance text-xl font-semibold tracking-tight text-fd-foreground sm:text-2xl md:text-3xl lg:text-[2.15rem] lg:leading-tight">
            Playground
          </h2>
          <p className="text-balance text-base leading-relaxed text-fd-muted-foreground sm:text-lg">
            Live preview on the left; pick a sample to swap the embed and
            snippet on the right. For URL input, reset, and the full docs
            chrome, open{" "}
            <Link
              className="font-medium text-fd-foreground underline-offset-2 hover:underline"
              href="/docs/playground"
            >
              /docs/playground
            </Link>
            .
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <Link className={btnOutline} href="/docs">
              Browse docs
            </Link>
            <Link className={btnPrimary} href="/docs/playground">
              <PanelRight className="size-3.5 opacity-90" aria-hidden />
              Full controls
            </Link>
          </div>

          <div className="mx-auto w-full max-w-xl border-t border-fd-border pt-6 text-left">
            <p className="text-[11px] font-semibold tracking-wider text-fd-muted-foreground uppercase">
              Install
            </p>
            <div className="mt-3">
              <InstallCommand />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <HomeEmbedPlayground bleed={false} />
        </div>
      </div>
    </section>
  )
}
