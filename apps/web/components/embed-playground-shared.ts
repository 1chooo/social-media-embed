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

export function mixTowardWhite(
  hex: string,
  /** 0 = white, 1 = full accent */
  amount: number
): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return "#ffffff"
  const t = Math.min(1, Math.max(0, amount))
  const mix = (c: number) => Math.round(255 + (c - 255) * t)
  return `rgb(${mix(rgb.r)}, ${mix(rgb.g)}, ${mix(rgb.b)})`
}

export function rgbaAlpha(cssColor: string): number | null {
  const m = cssColor.match(
    /rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/i
  )
  if (!m?.[1]) return null
  return Math.round(Number.parseFloat(m[1]) * 100)
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
  radius: 28,
  borderAlpha: 22,
  shadowAlpha: 0,
  shadowSpread: 72,
  bgTint: 8,
  mutedStrength: 40,
}

export function buildSnippet(url: string, theme: EmbedCardTheme): string {
  const r = theme.radius
  const radiusLine =
    typeof r === "number"
      ? `        radius: ${r},`
      : `        radius: ${JSON.stringify(r ?? "24px")},`
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
        background: ${JSON.stringify(theme.background ?? "rgba(255,255,255,0.98)")},
        borderColor: ${JSON.stringify(theme.borderColor ?? "rgba(15,23,42,0.12)")},
        mutedColor: ${JSON.stringify(theme.mutedColor ?? "rgba(15,23,42,0.62)")},
${radiusLine}${shadowLine}${appearanceLine}
      }}
    />
  )
}`
}
