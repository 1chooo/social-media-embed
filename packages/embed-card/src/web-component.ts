import { fetchRedditPost } from "./reddit-data"
import { buildRedditCardElement } from "./reddit-shadow-dom"
import { resolveEmbed } from "./resolve"
import {
  createThemeVariables,
  resolveEmbedCardAppearance,
  variablesToInlineStyle,
} from "./theme"
import type { EmbedCardTheme, ResolvedEmbed } from "./types"

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

const componentStyles = `
  :host {
    display: block;
    width: 100%;
  }

  .root {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    border-radius: var(--embed-card-radius);
    border: 1px solid color-mix(in srgb, var(--embed-card-border) 82%, var(--embed-card-chrome-tint) 18%);
    background: radial-gradient(circle at top, color-mix(in srgb, var(--embed-card-accent) 10%, var(--embed-card-chrome-tint) 90%), transparent 50%), var(--embed-card-preview-canvas);
    box-shadow: var(--embed-card-shadow);
    font-family: inherit;
  }

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  .fallback {
    display: grid;
    gap: 0.75rem;
    padding: 1rem;
    text-decoration: none;
    color: inherit;
  }

  .invalid {
    display: grid;
    place-items: center;
    min-height: 180px;
    padding: 1.5rem;
    text-align: center;
    font-size: 0.95rem;
    color: var(--embed-card-muted);
  }

  a {
    color: var(--embed-card-accent);
    font-weight: 700;
    text-decoration: none;
  }
`

function getThemeFromAttributes(element: HTMLElement): EmbedCardTheme {
  const rawAppearance = element.getAttribute("appearance")
  const appearance =
    rawAppearance === "dark" || rawAppearance === "light" || rawAppearance === "system"
      ? rawAppearance
      : undefined
  return {
    accentColor: element.getAttribute("accent-color") ?? undefined,
    radius: element.getAttribute("radius") ?? undefined,
    shadow: element.getAttribute("shadow") ?? undefined,
    fontFamily: element.getAttribute("font-family") ?? undefined,
    appearance,
  }
}

function renderContent(resolved: ResolvedEmbed, ctaLabel?: string): string {
  if (resolved.renderer.type === "iframe") {
    const size = [
      `aspect-ratio:${resolved.renderer.aspectRatio ?? "16 / 9"}`,
      resolved.renderer.minHeight
        ? `min-height:min(${resolved.renderer.minHeight}px,90vmin)`
        : "",
    ]
      .filter(Boolean)
      .join(";")

    return `
      <iframe
        allow="${escapeHtml(resolved.renderer.allow ?? "")}"
        ${resolved.renderer.allowFullScreen ? "allowfullscreen" : ""}
        loading="lazy"
        referrerpolicy="${escapeHtml(resolved.renderer.referrerPolicy ?? "strict-origin-when-cross-origin")}"
        ${resolved.renderer.sandbox ? `sandbox="${escapeHtml(resolved.renderer.sandbox)}"` : ""}
        src="${escapeHtml(resolved.renderer.src)}"
        style="${size}"
        title="${escapeHtml(resolved.renderer.title)}"
      ></iframe>
    `
  }

  if (resolved.renderer.type === "link") {
    const cta = ctaLabel ?? resolved.renderer.ctaLabel ?? "Open original"
    return `
      <a class="fallback" href="${escapeHtml(resolved.renderer.href)}" rel="noreferrer" target="_blank">
        <strong style="font-size:1rem;overflow-wrap:anywhere;color:var(--embed-card-text)">${escapeHtml(resolved.displayUrl)}</strong>
        <span>${escapeHtml(cta)}</span>
      </a>
    `
  }

  if (resolved.renderer.type === "reddit_client") {
    return `
      <div data-reddit-mount style="min-height:260px;padding:1.5rem;">
        <div style="height:10px;width:33%;border-radius:6px;background:color-mix(in srgb,var(--embed-card-border) 55%,transparent);margin-bottom:10px"></div>
        <div style="height:14px;width:75%;border-radius:6px;background:color-mix(in srgb,var(--embed-card-border) 45%,transparent);margin-bottom:10px"></div>
        <div style="height:14px;width:50%;border-radius:6px;background:color-mix(in srgb,var(--embed-card-border) 35%,transparent)"></div>
      </div>
    `
  }

  return `<div class="invalid">${escapeHtml(resolved.renderer.message)}</div>`
}

export class EmbedCardElement extends HTMLElement {
  private redditHydrateAbort: AbortController | null = null
  private colorSchemeAbort: AbortController | null = null

  static observedAttributes = [
    "url",
    "accent-color",
    "appearance",
    "radius",
    "shadow",
    "font-family",
    "cta-label",
  ]

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" })
    }

    this.syncColorSchemeListener()
    this.render()
  }

  disconnectedCallback(): void {
    this.colorSchemeAbort?.abort()
    this.colorSchemeAbort = null
  }

  attributeChangedCallback(): void {
    this.syncColorSchemeListener()
    this.render()
  }

  private syncColorSchemeListener(): void {
    const isSystem = this.getAttribute("appearance") === "system"
    if (!isSystem) {
      this.colorSchemeAbort?.abort()
      this.colorSchemeAbort = null
      return
    }
    if (this.colorSchemeAbort) {
      return
    }
    const ac = new AbortController()
    this.colorSchemeAbort = ac
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => this.render(), { signal: ac.signal })
  }

  private render(): void {
    if (!this.shadowRoot) {
      return
    }

    const url = this.getAttribute("url") ?? ""
    const resolved = resolveEmbed(url)
    const theme = getThemeFromAttributes(this)
    const resolvedMode = resolveEmbedCardAppearance(
      theme.appearance,
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : false
    )
    const variables = createThemeVariables(
      { accentColor: resolved.accentColor, ...theme },
      resolvedMode
    )

    this.redditHydrateAbort?.abort()
    this.redditHydrateAbort = null

    const ctaLabel = this.getAttribute("cta-label") ?? undefined
    const ariaLabel =
      resolved.renderer.type === "iframe"
        ? resolved.title || "Embed"
        : resolved.renderer.type === "link"
          ? resolved.title || "Link preview"
          : resolved.renderer.type === "reddit_client"
            ? "Reddit embed"
            : resolved.renderer.message

    const rootStyle = resolved.renderer.type === "reddit_client"
      ? `color-scheme:${resolvedMode};min-height:280px;padding:0;background:var(--embed-card-preview-canvas);${variablesToInlineStyle(variables)}`
      : `color-scheme:${resolvedMode};${variablesToInlineStyle(variables)}`

    this.shadowRoot.innerHTML = `
      <style>${componentStyles}</style>
      <figure class="root" part="root" data-provider="${escapeHtml(resolved.provider)}" aria-label="${escapeHtml(ariaLabel)}" style="${rootStyle}">
        ${renderContent(resolved, ctaLabel)}
      </figure>
    `

    this.scheduleRedditHydration(resolved)
  }

  private scheduleRedditHydration(resolved: ResolvedEmbed): void {
    if (resolved.renderer.type !== "reddit_client") {
      return
    }

    const ac = new AbortController()
    this.redditHydrateAbort = ac
    const postUrl = resolved.renderer.postUrl
    const root = this.shadowRoot
    if (!root) {
      return
    }

    queueMicrotask(() => {
      void this.hydrateRedditPost(root, postUrl, ac)
    })
  }

  private async hydrateRedditPost(
    root: ShadowRoot,
    postUrl: string,
    ac: AbortController
  ): Promise<void> {
    const mount = root.querySelector("[data-reddit-mount]")
    if (!(mount instanceof HTMLElement)) {
      return
    }

    const post = await fetchRedditPost(postUrl, { signal: ac.signal })
    if (ac.signal.aborted) {
      return
    }

    if (!post) {
      mount.replaceChildren()
      mount.style.padding = "2rem"
      mount.style.textAlign = "center"
      mount.style.color = "var(--embed-card-muted)"
      mount.style.fontSize = "0.9rem"
      mount.textContent = "Post unavailable."
      return
    }

    const card = buildRedditCardElement(root.ownerDocument, post)
    mount.replaceChildren(card)
  }
}

export function registerEmbedCard(tagName = "embed-card"): void {
  if (typeof window === "undefined" || customElements.get(tagName)) {
    return
  }

  customElements.define(tagName, EmbedCardElement)
}

declare global {
  interface HTMLElementTagNameMap {
    "embed-card": EmbedCardElement
  }
}
