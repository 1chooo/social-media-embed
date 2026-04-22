import type { EmbedCardTheme } from "./types"

/** Default `theme.shadow` when the field is omitted. Single source of truth for docs and tools. */
export const EMBED_CARD_DEFAULT_SHADOW = "none" as const

/** Default `theme.fontFamily` when the field is omitted. */
export const EMBED_CARD_DEFAULT_FONT_FAMILY =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' as const

export interface EmbedCardCssVariables {
  "--embed-card-accent": string
  "--embed-card-background": string
  "--embed-card-border": string
  "--embed-card-text": string
  "--embed-card-muted": string
  "--embed-card-radius": string
  "--embed-card-shadow": string
  "--embed-card-font-family": string
  /**
   * The color mixed into gradients and borders as the "light" partner.
   * White in light mode; a near-black slate in dark mode.
   */
  "--embed-card-chrome-tint": string
  /**
   * Background used behind the iframe / preview panel radial gradient.
   * White in light mode; a dark surface in dark mode.
   */
  "--embed-card-preview-canvas": string
}

const lightDefaults = {
  accentColor: "#111827",
  background: "rgba(255, 255, 255, 0.98)",
  borderColor: "rgba(15, 23, 42, 0.12)",
  textColor: "#0f172a",
  mutedColor: "rgba(15, 23, 42, 0.62)",
  chromeTint: "#ffffff",
  previewCanvas: "#ffffff",
} as const

const darkDefaults = {
  accentColor: "#e2e8f0",
  background: "rgba(15, 23, 42, 0.97)",
  borderColor: "rgba(226, 232, 240, 0.12)",
  textColor: "#f1f5f9",
  mutedColor: "rgba(226, 232, 240, 0.55)",
  chromeTint: "#0f172a",
  previewCanvas: "#0d1420",
} as const

const sharedDefaults = {
  radius: "24px",
  shadow: EMBED_CARD_DEFAULT_SHADOW,
  fontFamily: EMBED_CARD_DEFAULT_FONT_FAMILY,
} as const

/**
 * Resolve the effective `"light" | "dark"` mode for a given theme.
 * `systemPrefersDark` should come from `matchMedia("(prefers-color-scheme: dark)").matches`
 * (pass `false` for SSR).
 */
export function resolveEmbedCardAppearance(
  appearance: EmbedCardTheme["appearance"],
  systemPrefersDark = false
): "light" | "dark" {
  if (appearance === "dark") return "dark"
  if (appearance === "system") return systemPrefersDark ? "dark" : "light"
  return "light"
}

function toSize(value: number | string | undefined, fallback: string): string {
  if (typeof value === "number") {
    return `${value}px`
  }
  return value ?? fallback
}

/**
 * Derive a subtle rgba border color from a hex accent string.
 * Falls back to `null` when the accent is not a parseable hex so the caller
 * can use the mode default instead.
 */
function accentToBorder(hex: string): string | null {
  const clean = hex.trim().replace("#", "")
  let expanded = clean
  if (clean.length === 3) {
    expanded = clean.split("").map((c) => c + c).join("")
  }
  if (expanded.length !== 6) return null
  const n = Number.parseInt(expanded, 16)
  if (!Number.isFinite(n)) return null
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, 0.16)`
}

export function createThemeVariables(
  theme: EmbedCardTheme = {},
  resolvedMode: "light" | "dark" = "light"
): EmbedCardCssVariables {
  const d = resolvedMode === "dark" ? darkDefaults : lightDefaults
  const derivedBorder = theme.accentColor ? accentToBorder(theme.accentColor) : null
  return {
    "--embed-card-accent": theme.accentColor ?? d.accentColor,
    "--embed-card-background": d.background,
    "--embed-card-border": derivedBorder ?? d.borderColor,
    "--embed-card-text": d.textColor,
    "--embed-card-muted": d.mutedColor,
    "--embed-card-radius": toSize(theme.radius, sharedDefaults.radius),
    "--embed-card-shadow": theme.shadow ?? sharedDefaults.shadow,
    "--embed-card-font-family": theme.fontFamily ?? sharedDefaults.fontFamily,
    "--embed-card-chrome-tint": d.chromeTint,
    "--embed-card-preview-canvas": d.previewCanvas,
  }
}

export function variablesToInlineStyle(
  variables: EmbedCardCssVariables
): string {
  return Object.entries(variables)
    .map(([key, value]) => `${key}:${value}`)
    .join(";")
}
