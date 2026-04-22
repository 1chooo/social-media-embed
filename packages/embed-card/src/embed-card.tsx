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

// Subscriptions for prefers-color-scheme (shared across component instances).
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
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  display: "grid",
  gap: "1rem",
  padding: "1.25rem",
  borderRadius: "var(--embed-card-radius)",
  border: "1px solid var(--embed-card-border)",
  background:
    "linear-gradient(160deg, color-mix(in srgb, var(--embed-card-background) 94%, var(--embed-card-chrome-tint) 6%), var(--embed-card-background))",
  color: "var(--embed-card-text)",
  boxShadow: "var(--embed-card-shadow)",
  backdropFilter: "blur(18px)",
}

const previewStyleBase: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  borderRadius: "calc(var(--embed-card-radius) - 8px)",
  border: "1px solid color-mix(in srgb, var(--embed-card-border) 82%, var(--embed-card-chrome-tint) 18%)",
  background:
    "radial-gradient(circle at top, color-mix(in srgb, var(--embed-card-accent) 22%, var(--embed-card-chrome-tint) 78%), transparent 58%), var(--embed-card-preview-canvas)",
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

  const combinedStyle = {
    ...themeVars,
    ...rootStyleBase,
    colorScheme: resolvedMode,
    ...style,
  } as CSSProperties

  return (
    <article
      {...props}
      className={cx("embed-card", className)}
      data-provider={resolved.provider}
      style={combinedStyle}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "0.35rem",
            minWidth: 0,
            flex: "1 1 0%",
          }}
        >
          <span
            style={{
              color: "var(--embed-card-muted)",
              fontSize: "0.82rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {resolved.providerLabel}
          </span>
          {resolved.renderer.type !== "reddit_client" ? (
            <h3
              style={{
                margin: 0,
                fontSize: "1.25rem",
                lineHeight: 1.15,
                fontWeight: 700,
                overflowWrap: "anywhere",
              }}
            >
              {resolved.title}
            </h3>
          ) : null}
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            borderRadius: "999px",
            border: "1px solid color-mix(in srgb, var(--embed-card-accent) 24%, var(--embed-card-chrome-tint) 76%)",
            background: "color-mix(in srgb, var(--embed-card-accent) 12%, var(--embed-card-chrome-tint) 88%)",
            color: "var(--embed-card-accent)",
            padding: "0.35rem 0.7rem",
            fontSize: "0.78rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {resolved.site}
        </span>
      </header>

      {resolved.renderer.type !== "reddit_client" ? (
        <p
          style={{
            margin: 0,
            color: "var(--embed-card-muted)",
            lineHeight: 1.6,
            fontSize: "0.96rem",
            overflowWrap: "anywhere",
          }}
        >
          {resolved.description}
        </p>
      ) : null}

      {resolved.renderer.type === "iframe" ? (
        <div
          style={{
            ...previewStyleBase,
            aspectRatio: resolved.renderer.aspectRatio ?? "16 / 9",
            minHeight: resolved.renderer.minHeight
              ? `min(${resolved.renderer.minHeight}px, 90vmin)`
              : undefined,
          }}
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
        </div>
      ) : null}

      {resolved.renderer.type === "reddit_client" ? (
        <div
          style={{
            ...previewStyleBase,
            minHeight: "280px",
            padding: 0,
            background: "var(--embed-card-preview-canvas)",
          }}
        >
          <RedditEmbedPreview key={resolved.renderer.postUrl} postUrl={resolved.renderer.postUrl} />
        </div>
      ) : null}

      {resolved.renderer.type === "link" ? (
        <a
          href={resolved.renderer.href}
          rel="noreferrer"
          style={{
            ...previewStyleBase,
            display: "grid",
            gap: "0.75rem",
            padding: "1rem",
            textDecoration: "none",
            color: "inherit",
          }}
          target="_blank"
        >
          <span
            style={{
              color: "var(--embed-card-muted)",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Fallback preview
          </span>
          <strong style={{ fontSize: "1rem", overflowWrap: "anywhere" }}>
            {resolved.displayUrl}
          </strong>
          <span style={{ color: "var(--embed-card-accent)", fontWeight: 600 }}>
            {ctaLabel ?? resolved.renderer.ctaLabel ?? "Open original"}
          </span>
        </a>
      ) : null}

      {resolved.renderer.type === "invalid" ? (
        <div style={{ ...previewStyleBase, ...invalidStyle }}>{resolved.renderer.message}</div>
      ) : null}

      <footer
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid color-mix(in srgb, var(--embed-card-border) 80%, var(--embed-card-chrome-tint) 20%)",
          paddingTop: "0.9rem",
          minWidth: 0,
        }}
      >
        <span
          style={{
            color: "var(--embed-card-muted)",
            fontSize: "0.88rem",
            overflowWrap: "anywhere",
            minWidth: 0,
          }}
        >
          {resolved.displayUrl}
        </span>
        {resolved.renderer.type !== "invalid" ? (
          <a
            href={resolved.url}
            rel="noreferrer"
            style={{
              color: "var(--embed-card-accent)",
              fontSize: "0.92rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
            target="_blank"
          >
            {ctaLabel ?? "Open original"}
          </a>
        ) : null}
      </footer>
    </article>
  )
}
