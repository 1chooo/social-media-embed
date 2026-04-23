const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com", "m.instagram.com"])

const PERMALINK_RE = /^\/(p|reel|tv)\/([A-Za-z0-9_-]+)\/?$/

export function isInstagramHost(hostname: string): boolean {
  return INSTAGRAM_HOSTS.has(hostname)
}

export type InstagramPermalinkKind = "p" | "reel" | "tv"

export interface InstagramPermalink {
  kind: InstagramPermalinkKind
  shortcode: string
}

/**
 * Parse `/p/{code}`, `/reel/{code}`, or `/tv/{code}` from an Instagram URL pathname.
 * Query strings and hashes are ignored.
 */
export function parseInstagramPermalink(url: URL): InstagramPermalink | null {
  if (!isInstagramHost(url.hostname)) {
    return null
  }

  const match = url.pathname.match(PERMALINK_RE)
  if (!match) {
    return null
  }

  const kind = match[1] as InstagramPermalinkKind
  const shortcode = match[2]
  if (!shortcode) {
    return null
  }

  return { kind, shortcode }
}

export function instagramEmbedSrc(permalink: InstagramPermalink): string {
  const segment = permalink.kind === "p" ? "p" : permalink.kind
  return `https://www.instagram.com/${segment}/${permalink.shortcode}/embed/`
}
