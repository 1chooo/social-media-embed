"use client"

import { useTheme } from "next-themes"
import { useLayoutEffect, useState } from "react"

import { EmbedCard, type EmbedCardProps } from "./embed-card"
import type { EmbedCardTheme } from "./types"

/**
 * Match next-themes with `attribute: "class"` on &lt;html&gt; (e.g. Fumadocs
 * `RootProvider`). `resolvedTheme` is often unset on the first client pass; the
 * blocking script may already have applied `dark`, so we read the class after
 * commit (no SSR/DOM split during hydration).
 */
function resolveSiteAppearance(
  resolvedTheme: string | undefined,
  explicit: EmbedCardTheme["appearance"]
): EmbedCardTheme["appearance"] {
  if (explicit === "system" || explicit === "dark" || explicit === "light") {
    return explicit
  }
  if (resolvedTheme === "dark") return "dark"
  if (resolvedTheme === "light") return "light"
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return "dark"
  }
  return "light"
}

/**
 * Wraps {@link EmbedCard} and forwards the app theme from `next-themes` as
 * `theme.appearance` so the card matches the site instead of OS-only `system`.
 * An explicit `theme.appearance` on the caller still takes precedence.
 *
 * Install `next-themes` in your app and import from `embed-card/next-themes`.
 */
export function ThemedEmbedCard({ theme, ...props }: EmbedCardProps) {
  const { resolvedTheme } = useTheme()
  const explicit = theme?.appearance

  const [appearance, setAppearance] = useState<EmbedCardTheme["appearance"]>(() => {
    if (explicit === "system" || explicit === "dark" || explicit === "light") {
      return explicit
    }
    return "light"
  })

  useLayoutEffect(() => {
    const next = resolveSiteAppearance(resolvedTheme, explicit)
    queueMicrotask(() => {
      setAppearance((prev) => (prev === next ? prev : next))
    })
  }, [resolvedTheme, explicit])

  return <EmbedCard {...props} theme={{ ...theme, appearance }} />
}
