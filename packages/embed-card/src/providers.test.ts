import { describe, expect, it } from "vitest"

import { defaultProviders, createFallbackEmbed, createInvalidEmbed } from "./providers"
import type { ResolvedEmbed } from "./types"

/* ------------------------------------------------------------------ */
/*  Helper                                                            */
/* ------------------------------------------------------------------ */

function resolveWith(urlStr: string, appearance?: "light" | "dark"): ResolvedEmbed | null {
  const url = new URL(urlStr)
  for (const p of defaultProviders) {
    if (p.match(url)) {
      return p.resolve(url, { appearance }) ?? null
    }
  }
  return null
}

/* ------------------------------------------------------------------ */
/*  createFallbackEmbed / createInvalidEmbed                          */
/* ------------------------------------------------------------------ */

describe("createFallbackEmbed", () => {
  it("returns a link renderer with provider 'link'", () => {
    const url = new URL("https://example.com/page")
    const result = createFallbackEmbed(url)
    expect(result.provider).toBe("link")
    expect(result.renderer.type).toBe("link")
    if (result.renderer.type === "link") {
      expect(result.renderer.href).toBe("https://example.com/page")
    }
    expect(result.site).toBe("example.com")
  })
})

describe("createInvalidEmbed", () => {
  it("returns an invalid renderer with provider 'invalid'", () => {
    const result = createInvalidEmbed("not a url")
    expect(result.provider).toBe("invalid")
    expect(result.renderer.type).toBe("invalid")
    if (result.renderer.type === "invalid") {
      expect(result.renderer.message).toContain("https://www.youtube.com/watch")
    }
  })
})

/* ------------------------------------------------------------------ */
/*  YouTube provider                                                  */
/* ------------------------------------------------------------------ */

describe("youtube provider", () => {
  it("resolves ?v= URLs", () => {
    const r = resolveWith("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    expect(r).not.toBeNull()
    expect(r!.provider).toBe("youtube")
    expect(r!.renderer.type).toBe("iframe")
    if (r!.renderer.type === "iframe") {
      expect(r!.renderer.src).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0")
    }
  })

  it("resolves youtu.be short links", () => {
    const r = resolveWith("https://youtu.be/dQw4w9WgXcQ")
    expect(r).not.toBeNull()
    expect(r!.provider).toBe("youtube")
    if (r!.renderer.type === "iframe") {
      expect(r!.renderer.src).toContain("dQw4w9WgXcQ")
    }
  })

  it("resolves /embed/ URLs", () => {
    const r = resolveWith("https://www.youtube.com/embed/abc123")
    expect(r).not.toBeNull()
    if (r!.renderer.type === "iframe") {
      expect(r!.renderer.src).toContain("abc123")
    }
  })

  it("resolves /shorts/ URLs", () => {
    const r = resolveWith("https://www.youtube.com/shorts/xyz789")
    expect(r).not.toBeNull()
    if (r!.renderer.type === "iframe") {
      expect(r!.renderer.src).toContain("xyz789")
    }
  })

  it("resolves /live/ URLs", () => {
    const r = resolveWith("https://www.youtube.com/live/liveID")
    expect(r).not.toBeNull()
    if (r!.renderer.type === "iframe") {
      expect(r!.renderer.src).toContain("liveID")
    }
  })

  it("returns null for channel pages (no video ID)", () => {
    const r = resolveWith("https://www.youtube.com/@channelName")
    expect(r).toBeNull()
  })

  it("returns null for youtube.com root", () => {
    const r = resolveWith("https://www.youtube.com/")
    expect(r).toBeNull()
  })

  it("resolves m.youtube.com URLs", () => {
    const r = resolveWith("https://m.youtube.com/watch?v=test123")
    expect(r).not.toBeNull()
    expect(r!.provider).toBe("youtube")
  })
})

/* ------------------------------------------------------------------ */
/*  Twitter / X provider                                              */
/* ------------------------------------------------------------------ */

describe("twitter provider", () => {
  it("resolves x.com status URLs", () => {
    const r = resolveWith("https://x.com/user/status/1234567890")
    expect(r).not.toBeNull()
    expect(r!.provider).toBe("twitter")
    expect(r!.renderer.type).toBe("iframe")
    if (r!.renderer.type === "iframe") {
      expect(r!.renderer.src).toContain("id=1234567890")
      expect(r!.renderer.src).toContain("theme=light")
    }
  })

  it("resolves twitter.com status URLs", () => {
    const r = resolveWith("https://twitter.com/someone/status/9876543210")
    expect(r).not.toBeNull()
    expect(r!.provider).toBe("twitter")
  })

  it("passes dark theme to embed URL", () => {
    const r = resolveWith("https://x.com/user/status/123", "dark")
    expect(r).not.toBeNull()
    if (r!.renderer.type === "iframe") {
      expect(r!.renderer.src).toContain("theme=dark")
    }
  })

  it("returns null for profile URLs (no status ID)", () => {
    const r = resolveWith("https://x.com/user")
    expect(r).toBeNull()
  })
})

/* ------------------------------------------------------------------ */
/*  Reddit provider                                                   */
/* ------------------------------------------------------------------ */

describe("reddit provider", () => {
  it("resolves /comments/ URLs to reddit_client renderer", () => {
    const r = resolveWith("https://www.reddit.com/r/reactjs/comments/abc123/test_post/")
    expect(r).not.toBeNull()
    expect(r!.provider).toBe("reddit")
    expect(r!.renderer.type).toBe("reddit_client")
    if (r!.renderer.type === "reddit_client") {
      // trailing slash should be stripped
      expect(r!.renderer.postUrl).toBe(
        "https://www.reddit.com/r/reactjs/comments/abc123/test_post"
      )
    }
  })

  it("resolves old.reddit.com URLs", () => {
    const r = resolveWith("https://old.reddit.com/r/test/comments/xyz/title/")
    expect(r).not.toBeNull()
    expect(r!.provider).toBe("reddit")
  })

  it("returns null for subreddit root (no /comments/)", () => {
    const r = resolveWith("https://www.reddit.com/r/reactjs/")
    expect(r).toBeNull()
  })
})

/* ------------------------------------------------------------------ */
/*  Google Maps provider                                              */
/* ------------------------------------------------------------------ */

describe("google-maps provider", () => {
  it("resolves google.com/maps URLs to iframe with output=embed", () => {
    const r = resolveWith("https://www.google.com/maps/place/Eiffel+Tower")
    expect(r).not.toBeNull()
    expect(r!.provider).toBe("google-maps")
    expect(r!.renderer.type).toBe("iframe")
    if (r!.renderer.type === "iframe") {
      expect(r!.renderer.src).toContain("output=embed")
      expect(r!.renderer.src).toContain("Eiffel+Tower")
    }
  })

  it("resolves maps.google.com URLs", () => {
    const r = resolveWith("https://maps.google.com/maps?q=NYC")
    expect(r).not.toBeNull()
    expect(r!.provider).toBe("google-maps")
  })

  it("does not match non-maps google paths", () => {
    const url = new URL("https://www.google.com/search?q=test")
    const provider = defaultProviders.find((p) => p.id === "google-maps")!
    expect(provider.match(url)).toBe(false)
  })
})

/* ------------------------------------------------------------------ */
/*  Vimeo provider                                                    */
/* ------------------------------------------------------------------ */

describe("vimeo provider", () => {
  it("resolves vimeo.com/ID URLs", () => {
    const r = resolveWith("https://vimeo.com/12345678")
    expect(r).not.toBeNull()
    expect(r!.provider).toBe("vimeo")
    expect(r!.renderer.type).toBe("iframe")
    if (r!.renderer.type === "iframe") {
      expect(r!.renderer.src).toBe("https://player.vimeo.com/video/12345678")
    }
  })

  it("resolves player.vimeo.com/ID URLs", () => {
    const r = resolveWith("https://player.vimeo.com/video/99999")
    expect(r).not.toBeNull()
    if (r!.renderer.type === "iframe") {
      expect(r!.renderer.src).toContain("99999")
    }
  })

  it("returns null for vimeo.com root (no video ID)", () => {
    const r = resolveWith("https://vimeo.com/")
    expect(r).toBeNull()
  })

  it("returns null for vimeo.com user profiles", () => {
    const r = resolveWith("https://vimeo.com/user12345/about")
    expect(r).toBeNull()
  })
})

/* ------------------------------------------------------------------ */
/*  displayUrl truncation (via resolved embed)                        */
/* ------------------------------------------------------------------ */

describe("displayUrl", () => {
  it("is ≤ 48 chars for short URLs", () => {
    const r = resolveWith("https://vimeo.com/111")
    expect(r).not.toBeNull()
    expect(r!.displayUrl.length).toBeLessThanOrEqual(48)
    expect(r!.displayUrl).toBe("vimeo.com/111")
  })

  it("is truncated to 48 chars with ellipsis for long URLs", () => {
    const long =
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf&index=2"
    const r = resolveWith(long)
    expect(r).not.toBeNull()
    expect(r!.displayUrl.length).toBe(48)
    expect(r!.displayUrl.endsWith("...")).toBe(true)
  })
})
