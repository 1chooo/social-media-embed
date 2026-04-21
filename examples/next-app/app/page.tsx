"use client"

import { EmbedCard } from "embed-card"

const DEMO_URL =
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ" as const

const DEMO_THEME = {
  accentColor: "#e11d48",
  background: "rgba(255,255,255,0.97)",
  borderColor: "rgba(225,29,72,0.18)",
  mutedColor: "rgba(17,24,39,0.62)",
  radius: 28,
  shadow: "0 28px 100px rgba(225,29,72,0.14)",
} as const

export default function Page() {
  return (
    <main
      style={{
        margin: "0 auto",
        maxWidth: "42rem",
        padding: "2.5rem 1.5rem 4rem",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#64748b",
        }}
      >
        embed-card · Next.js (App Router)
      </p>
      <h1
        style={{
          margin: "0.75rem 0 0",
          fontSize: "1.75rem",
          fontWeight: 600,
          letterSpacing: "-0.03em",
        }}
      >
        Turn a URL into a rich embed card
      </h1>
      <p style={{ margin: "0.75rem 0 1.75rem", color: "#475569" }}>
        This page imports <code>EmbedCard</code> from{" "}
        <code>embed-card</code>. Swap <code>DEMO_URL</code> for your own link.
      </p>
      <EmbedCard theme={DEMO_THEME} url={DEMO_URL} />
    </main>
  )
}
