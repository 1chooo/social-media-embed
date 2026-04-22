export type EmbedReferrerPolicy =
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url"

export interface EmbedCardTheme {
  accentColor?: string
  background?: string
  borderColor?: string
  textColor?: string
  mutedColor?: string
  radius?: number | string
  /** Any valid CSS `box-shadow`. Omit to use the package default (no shadow). */
  shadow?: string
  /** Any valid CSS `font-family` value. Defaults to system-ui sans-serif stack. */
  fontFamily?: string
  /**
   * Controls chrome surface colors (gradients, preview panel, borders).
   * - `"light"` — always use the default light palette (default when omitted).
   * - `"dark"`  — always use a dark palette.
   * - `"system"` — follow `prefers-color-scheme` at runtime; falls back to light on SSR.
   */
  appearance?: "light" | "dark" | "system"
}

export interface IframeEmbedRenderer {
  type: "iframe"
  src: string
  title: string
  aspectRatio?: string
  minHeight?: number
  allow?: string
  allowFullScreen?: boolean
  referrerPolicy?: EmbedReferrerPolicy
  sandbox?: string
}

export interface LinkEmbedRenderer {
  type: "link"
  href: string
  ctaLabel?: string
}

export interface InvalidEmbedRenderer {
  type: "invalid"
  message: string
}

export interface RedditClientEmbedRenderer {
  type: "reddit_client"
  /** Canonical thread URL used for `fetch(url + ".json")` (no trailing slash). */
  postUrl: string
}

export type EmbedRenderer =
  | IframeEmbedRenderer
  | LinkEmbedRenderer
  | InvalidEmbedRenderer
  | RedditClientEmbedRenderer

export interface ResolvedEmbed {
  provider: string
  providerLabel: string
  accentColor: string
  title: string
  description: string
  site: string
  url: string
  displayUrl: string
  renderer: EmbedRenderer
}

export interface EmbedProvider {
  id: string
  label: string
  accentColor: string
  match: (url: URL) => boolean
  resolve: (url: URL) => ResolvedEmbed | null
}

export interface ResolveEmbedOptions {
  providers?: readonly EmbedProvider[]
  includeFallback?: boolean
}
