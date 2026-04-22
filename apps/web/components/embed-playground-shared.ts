import type { EmbedCardTheme } from "embed-card"
import { EMBED_CARD_DEFAULT_SHADOW } from "embed-card"

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "")
  if (normalized.length !== 6) return null
  const n = Number.parseInt(normalized, 16)
  if (!Number.isFinite(n)) return null
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  }
}


/** Aligned with Reset / Copy code in the Options/Controls bar (rounded-md, 11px). */
export function pillClassName(isActive: boolean): string {
  return [
    "inline-flex min-h-0 items-center justify-center rounded-md border border-fd-border px-2.5 py-1.5 text-[11px] font-medium transition active:scale-[0.98]",
    isActive
      ? "bg-fd-primary text-fd-primary-foreground hover:opacity-90"
      : "text-fd-muted-foreground hover:bg-fd-muted/50 hover:text-fd-foreground",
  ].join(" ")
}

export const DEFAULTS = {
  accentHex: "#e11d48",
  radius: 24,
  shadowAlpha: 0,
}

export function buildSnippet(url: string, theme: EmbedCardTheme): string {
  const r = theme.radius
  const radiusStr =
    typeof r === "number" ? String(r) : JSON.stringify(r ?? "24px")
  const includeShadow =
    theme.shadow != null && theme.shadow !== EMBED_CARD_DEFAULT_SHADOW
  const shadowLine = includeShadow
    ? `        shadow: ${JSON.stringify(theme.shadow)},\n`
    : ""
  const appearanceLine =
    theme.appearance != null
      ? `        appearance: ${JSON.stringify(theme.appearance)},\n`
      : ""

  return `import { EmbedCard } from "embed-card"

export function Example() {
  return (
    <EmbedCard
      url={${JSON.stringify(url)}}
      theme={{
        accentColor: ${JSON.stringify(theme.accentColor ?? "#111827")},
        radius: ${radiusStr},
${shadowLine}${appearanceLine}      }}
    />
  )
}`
}
