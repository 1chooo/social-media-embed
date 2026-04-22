"use client"

import type { CSSProperties, ReactNode } from "react"
import {
  EmbedCard,
  RedditEmbedPreview,
  createThemeVariables,
} from "embed-card"

const REDDIT_POST_URL =
  "https://www.reddit.com/r/github/comments/1j6jga7/i_rebuilt_my_personal_portfolio_using_nextjsits/"

function CompareColumn({
  label,
  caption,
  children,
}: {
  label: string
  caption: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div>
        <p className="text-[11px] font-semibold tracking-wide text-fd-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-1 text-sm leading-snug text-fd-muted-foreground">{caption}</p>
      </div>
      <div className="min-w-0 rounded-lg border border-fd-border bg-fd-background p-3">
        {children}
      </div>
    </div>
  )
}

/** Default `EmbedCard` vs themed `EmbedCard` for the same Reddit URL. */
export function CustomRenderingEmbedCardCompare() {
  return (
    <div className="not-prose my-8 grid gap-8 lg:grid-cols-2">
      <CompareColumn
        label="Default"
        caption="`EmbedCard` with no `theme` prop — package defaults, system font."
      >
        <EmbedCard url={REDDIT_POST_URL} />
      </CompareColumn>
      <CompareColumn
        label="Themed"
        caption="Same URL with `theme`: warm accent, tighter radius, and serif `fontFamily`."
      >
        <EmbedCard
          url={REDDIT_POST_URL}
          theme={{
            accentColor: "#c2410c",
            radius: 12,
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        />
      </CompareColumn>
    </div>
  )
}

/** `RedditEmbedPreview` with default CSS variables vs editorial overrides + chrome. */
export function CustomRenderingRedditPreviewCompare() {
  const defaultVars = createThemeVariables()
  const editorialVars = {
    ...createThemeVariables({
      accentColor: "#b91c1c",
      radius: 10,
      fontFamily: "Georgia, 'Times New Roman', serif",
    }),
    "--embed-card-background": "#fff1f2",
    "--embed-card-border": "rgba(185, 28, 28, 0.28)",
    "--embed-card-text": "#450a0a",
    "--embed-card-muted": "rgba(69, 10, 10, 0.65)",
  }

  return (
    <div className="not-prose my-8 grid gap-8 lg:grid-cols-2">
      <CompareColumn
        label="Default"
        caption="`RedditEmbedPreview` with `createThemeVariables()` defaults."
      >
        <div style={defaultVars as CSSProperties}>
          <RedditEmbedPreview postUrl={REDDIT_POST_URL} />
        </div>
      </CompareColumn>
      <CompareColumn
        label="Custom theme"
        caption="Editorial `createThemeVariables({ ... })` on the wrapper, plus `className` and `style` on the preview."
      >
        <div style={editorialVars as CSSProperties}>
          <RedditEmbedPreview
            postUrl={REDDIT_POST_URL}
            className="ring-2 ring-rose-200/80 ring-offset-2 ring-offset-[#fff1f2]"
            style={{ boxShadow: "0 14px 44px rgba(185, 28, 28, 0.1)" }}
          />
        </div>
      </CompareColumn>
    </div>
  )
}
