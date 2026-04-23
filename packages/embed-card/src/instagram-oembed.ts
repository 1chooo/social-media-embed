/**
 * Server-side helper for Instagram oEmbed via the Graph API.
 * Do not call from the browser: requires a secret-bearing access token and is subject to CORS.
 *
 * @see https://developers.facebook.com/docs/instagram/oembed/
 */

const INSTAGRAM_OEMBED_BASE = "https://graph.facebook.com/v18.0/instagram_oembed"

export interface InstagramOEmbedResult {
  /** Raw HTML snippet from Instagram (often an iframe). */
  html?: string
  /** Optional dimensions when provided by the API. */
  width?: number
  height?: number
  title?: string
  author_name?: string
  author_url?: string
  provider_name?: string
  provider_url?: string
  thumbnail_url?: string
  thumbnail_width?: number
  thumbnail_height?: number
  /** Present on error responses from Graph. */
  error?: { message: string; type: string; code: number }
}

/**
 * Fetches oEmbed metadata for an Instagram permalink using a Graph API access token.
 *
 * @param permalink Public Instagram media URL (e.g. `https://www.instagram.com/p/.../`).
 * @param options.accessToken App access token or client token permitted for `instagram_oembed`.
 */
export async function fetchInstagramOEmbed(
  permalink: string,
  options: { accessToken: string; signal?: AbortSignal }
): Promise<InstagramOEmbedResult | null> {
  const url = new URL(INSTAGRAM_OEMBED_BASE)
  url.searchParams.set("url", permalink.trim())
  url.searchParams.set("access_token", options.accessToken)

  try {
    const res = await fetch(url.toString(), { signal: options.signal })
    const json: unknown = await res.json()
    if (!res.ok || !json || typeof json !== "object") {
      return null
    }
    const body = json as InstagramOEmbedResult
    if (body.error) {
      return null
    }
    return body
  } catch {
    return null
  }
}
