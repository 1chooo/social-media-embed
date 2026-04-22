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
    display: grid;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: var(--embed-card-radius);
    border: 1px solid var(--embed-card-border);
    background: linear-gradient(160deg, color-mix(in srgb, var(--embed-card-background) 94%, var(--embed-card-chrome-tint) 6%), var(--embed-card-background));
    color: var(--embed-card-text);
    box-shadow: var(--embed-card-shadow);
    backdrop-filter: blur(18px);
    font-family: inherit;
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    min-width: 0;
  }

  .header > div:first-child {
    min-width: 0;
    flex: 1 1 12rem;
  }

  .eyebrow,
  .description,
  .muted {
    color: var(--embed-card-muted);
  }

  .eyebrow {
    font-size: 0.82rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .title {
    margin: 0.35rem 0 0;
    font-size: 1.25rem;
    line-height: 1.15;
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  .badge {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--embed-card-accent) 24%, var(--embed-card-chrome-tint) 76%);
    background: color-mix(in srgb, var(--embed-card-accent) 12%, var(--embed-card-chrome-tint) 88%);
    color: var(--embed-card-accent);
    font-size: 0.78rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .description {
    margin: 0;
    line-height: 1.6;
    font-size: 0.96rem;
    overflow-wrap: anywhere;
  }

  .preview {
    position: relative;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    border-radius: calc(var(--embed-card-radius) - 8px);
    border: 1px solid color-mix(in srgb, var(--embed-card-border) 82%, var(--embed-card-chrome-tint) 18%);
    background: radial-gradient(circle at top, color-mix(in srgb, var(--embed-card-accent) 22%, var(--embed-card-chrome-tint) 78%), transparent 58%), var(--embed-card-preview-canvas);
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
  }

  .footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-top: 1px solid color-mix(in srgb, var(--embed-card-border) 80%, var(--embed-card-chrome-tint) 20%);
    padding-top: 0.9rem;
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
    background: element.getAttribute("background") ?? undefined,
    borderColor: element.getAttribute("border-color") ?? undefined,
    textColor: element.getAttribute("text-color") ?? undefined,
    mutedColor: element.getAttribute("muted-color") ?? undefined,
    radius: element.getAttribute("radius") ?? undefined,
    shadow: element.getAttribute("shadow") ?? undefined,
    appearance,
  }
}

function renderPreview(resolved: ResolvedEmbed): string {
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
      <div class="preview" part="preview" style="${size}">
        <iframe
          allow="${escapeHtml(resolved.renderer.allow ?? "")}"
          ${resolved.renderer.allowFullScreen ? "allowfullscreen" : ""}
          loading="lazy"
          referrerpolicy="${escapeHtml(resolved.renderer.referrerPolicy ?? "strict-origin-when-cross-origin")}"
          ${resolved.renderer.sandbox ? `sandbox="${escapeHtml(resolved.renderer.sandbox)}"` : ""}
          src="${escapeHtml(resolved.renderer.src)}"
          title="${escapeHtml(resolved.renderer.title)}"
        ></iframe>
      </div>
    `
  }

  if (resolved.renderer.type === "link") {
    return `
      <a class="preview fallback" href="${escapeHtml(resolved.renderer.href)}" rel="noreferrer" target="_blank">
        <span class="eyebrow">Fallback preview</span>
        <strong>${escapeHtml(resolved.displayUrl)}</strong>
        <span>${escapeHtml(resolved.renderer.ctaLabel ?? "Open original")}</span>
      </a>
    `
  }

  if (resolved.renderer.type === "reddit_client") {
    return `
      <div class="preview" part="preview" style="min-height:280px;padding:0;background:var(--embed-card-preview-canvas);">
        <div data-reddit-mount style="min-height:260px;padding:1.5rem;">
          <div style="height:10px;width:33%;border-radius:6px;background:color-mix(in srgb,var(--embed-card-border) 55%,transparent);margin-bottom:10px"></div>
          <div style="height:14px;width:75%;border-radius:6px;background:color-mix(in srgb,var(--embed-card-border) 45%,transparent);margin-bottom:10px"></div>
          <div style="height:14px;width:50%;border-radius:6px;background:color-mix(in srgb,var(--embed-card-border) 35%,transparent)"></div>
        </div>
      </div>
    `
  }

  return `
    <div class="preview invalid" part="invalid">
      ${escapeHtml(resolved.renderer.message)}
    </div>
  `
}

function renderHeaderAndDescription(resolved: ResolvedEmbed): string {
  const isReddit = resolved.renderer.type === "reddit_client"
  const titleHtml = isReddit
    ? ""
    : `<h3 class="title">${escapeHtml(resolved.title)}</h3>`
  const descHtml = isReddit
    ? ""
    : `<p class="description">${escapeHtml(resolved.description)}</p>`
  return `
        <div class="header" part="header">
          <div>
            <span class="eyebrow">${escapeHtml(resolved.providerLabel)}</span>
            ${titleHtml}
          </div>
          <span class="badge">${escapeHtml(resolved.site)}</span>
        </div>
        ${descHtml}
  `
}

export class EmbedCardElement extends HTMLElement {
  private redditHydrateAbort: AbortController | null = null
  private colorSchemeAbort: AbortController | null = null

  static observedAttributes = [
    "url",
    "accent-color",
    "appearance",
    "background",
    "border-color",
    "text-color",
    "muted-color",
    "radius",
    "shadow",
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

    this.shadowRoot.innerHTML = `
      <style>${componentStyles}</style>
      <article class="root" part="root" data-provider="${escapeHtml(resolved.provider)}" style="color-scheme:${resolvedMode};${variablesToInlineStyle(variables)}">
        ${renderHeaderAndDescription(resolved)}
        ${renderPreview(resolved)}
        <div class="footer" part="footer">
          <span class="muted">${escapeHtml(resolved.displayUrl)}</span>
          ${
            resolved.renderer.type === "invalid"
              ? ""
              : `<a href="${escapeHtml(resolved.url)}" rel="noreferrer" target="_blank">Open original</a>`
          }
        </div>
      </article>
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
