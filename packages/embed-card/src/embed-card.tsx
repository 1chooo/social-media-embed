"use client"

import type { CSSProperties, HTMLAttributes } from "react"
import { useSyncExternalStore } from "react"

import { RedditEmbedPreview } from "./reddit-embed"
import { resolveEmbed } from "./resolve"
import { createThemeVariables, resolveEmbedCardAppearance } from "./theme"
import type { EmbedCardTheme, EmbedProvider } from "./types"

export interface EmbedCardProps extends HTMLAttributes<HTMLDivElement> {
  url: string
  providers?: readonly EmbedProvider[]
  theme?: EmbedCardTheme
  ctaLabel?: string
}

function cx(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ")
}

function subscribeToColorScheme(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const mq = window.matchMedia("(prefers-color-scheme: dark)")
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}

function getSystemDark(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function getServerDark(): boolean {
  return false
}

const rootStyleBase: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  borderRadius: "var(--embed-card-radius)",
  border: "1px solid color-mix(in srgb, var(--embed-card-border) 82%, var(--embed-card-chrome-tint) 18%)",
  background:
    "radial-gradient(circle at top, color-mix(in srgb, var(--embed-card-accent) 10%, var(--embed-card-chrome-tint) 90%), transparent 50%), var(--embed-card-preview-canvas)",
  boxShadow: "var(--embed-card-shadow)",
}

const iframeStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: "none",
}

const invalidStyle: CSSProperties = {
  display: "grid",
  placeItems: "center",
  padding: "1.5rem",
  minHeight: "180px",
  color: "var(--embed-card-muted)",
  fontSize: "0.95rem",
  textAlign: "center",
}

export function EmbedCard({
  url,
  providers,
  theme,
  ctaLabel,
  className,
  style,
  ...props
}: EmbedCardProps) {
  const systemPrefersDark = useSyncExternalStore(
    theme?.appearance === "system" ? subscribeToColorScheme : (_cb: () => void) => () => {},
    theme?.appearance === "system" ? getSystemDark : getServerDark,
    getServerDark
  )

  const resolved = resolveEmbed(url, { providers })
  const resolvedMode = resolveEmbedCardAppearance(theme?.appearance, systemPrefersDark)

  const themeVars = createThemeVariables(
    { accentColor: resolved.accentColor, ...theme },
    resolvedMode
  )

  const getAriaLabel = () => {
    if (resolved.renderer.type === "iframe") return resolved.title || "Embed"
    if (resolved.renderer.type === "link") return resolved.title || "Link preview"
    if (resolved.renderer.type === "reddit_client") return "Reddit embed"
    return resolved.renderer.message
  }

  if (resolved.renderer.type === "iframe") {
    const combinedStyle = {
      ...themeVars,
      ...rootStyleBase,
      colorScheme: resolvedMode,
      aspectRatio: resolved.renderer.aspectRatio ?? "16 / 9",
      ...(resolved.renderer.minHeight
        ? { minHeight: `min(${resolved.renderer.minHeight}px, 90vmin)` }
        : {}),
      ...style,
    } as CSSProperties

    return (
      <figure
        {...props}
        aria-label={getAriaLabel()}
        className={cx("embed-card", className)}
        data-provider={resolved.provider}
        style={combinedStyle}
      >
        <iframe
          allow={resolved.renderer.allow}
          allowFullScreen={resolved.renderer.allowFullScreen}
          loading="lazy"
          referrerPolicy={resolved.renderer.referrerPolicy}
          sandbox={resolved.renderer.sandbox}
          src={resolved.renderer.src}
          style={iframeStyle}
          title={resolved.renderer.title}
        />
      </figure>
    )
  }

  if (resolved.renderer.type === "reddit_client") {
    const combinedStyle = {
      ...themeVars,
      ...rootStyleBase,
      colorScheme: resolvedMode,
      minHeight: "280px",
      padding: 0,
      background: "var(--embed-card-preview-canvas)",
      ...style,
    } as CSSProperties

    return (
      <figure
        {...props}
        aria-label={getAriaLabel()}
        className={cx("embed-card", className)}
        data-provider={resolved.provider}
        style={combinedStyle}
      >
        <RedditEmbedPreview key={resolved.renderer.postUrl} postUrl={resolved.renderer.postUrl} />
      </figure>
    )
  }

  if (resolved.renderer.type === "link") {
    const combinedStyle = {
      ...themeVars,
      ...rootStyleBase,
      colorScheme: resolvedMode,
      ...style,
    } as CSSProperties

    return (
      <a
        {...(props as HTMLAttributes<HTMLAnchorElement>)}
        className={cx("embed-card", className)}
        data-provider={resolved.provider}
        href={resolved.renderer.href}
        rel="noreferrer"
        style={{
          ...combinedStyle,
          display: "grid",
          gap: "0.75rem",
          padding: "1rem",
          textDecoration: "none",
          color: "inherit",
        }}
        target="_blank"
      >
        <strong style={{ fontSize: "1rem", overflowWrap: "anywhere", color: "var(--embed-card-text)" }}>
          {resolved.displayUrl}
        </strong>
        <span style={{ color: "var(--embed-card-accent)", fontWeight: 600 }}>
          {ctaLabel ?? resolved.renderer.ctaLabel ?? "Open original"}
        </span>
      </a>
    )
  }

  // invalid
  const combinedStyle = {
    ...themeVars,
    ...rootStyleBase,
    colorScheme: resolvedMode,
    ...style,
  } as CSSProperties

  return (
    <figure
      {...props}
      aria-label={getAriaLabel()}
      className={cx("embed-card", className)}
      data-provider={resolved.provider}
      style={{ ...combinedStyle, ...invalidStyle }}
    >
      {resolved.renderer.message}
    </figure>
  )
}
