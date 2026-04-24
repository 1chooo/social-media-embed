import { describe, expect, it } from "vitest"

import { resolveEmbed } from "./resolve"

/**
 * Integration tests — exercise resolveEmbed end-to-end through the
 * full default provider chain for every supported provider.
 */

describe("resolveEmbed — cross-provider integration", () => {
  /* ------ YouTube ------ */

  it("YouTube: standard watch URL", () => {
    const r = resolveEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    expect(r.provider).toBe("youtube")
    expect(r.renderer.type).toBe("iframe")
    if (r.renderer.type === "iframe") {
      expect(r.renderer.src).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0")
      expect(r.renderer.aspectRatio).toBe("16 / 9")
    }
  })

  it("YouTube: youtu.be short link", () => {
    const r = resolveEmbed("https://youtu.be/dQw4w9WgXcQ")
    expect(r.provider).toBe("youtube")
    expect(r.renderer.type).toBe("iframe")
  })

  /* ------ Twitter / X ------ */

  it("Twitter: x.com status URL", () => {
    const r = resolveEmbed("https://x.com/elonmusk/status/1234567890123456789")
    expect(r.provider).toBe("twitter")
    expect(r.renderer.type).toBe("iframe")
    if (r.renderer.type === "iframe") {
      expect(r.renderer.src).toContain("1234567890123456789")
    }
  })

  it("Twitter: twitter.com status URL", () => {
    const r = resolveEmbed("https://twitter.com/user/status/999")
    expect(r.provider).toBe("twitter")
  })

  /* ------ Instagram ------ */

  it("Instagram: post permalink", () => {
    const r = resolveEmbed("https://www.instagram.com/p/BR5ySLCBglt/")
    expect(r.provider).toBe("instagram")
    expect(r.renderer.type).toBe("iframe")
    if (r.renderer.type === "iframe") {
      expect(r.renderer.src).toContain("/embed/")
    }
  })

  /* ------ Reddit ------ */

  it("Reddit: thread URL", () => {
    const r = resolveEmbed("https://www.reddit.com/r/reactjs/comments/abc123/my_post/")
    expect(r.provider).toBe("reddit")
    expect(r.renderer.type).toBe("reddit_client")
    if (r.renderer.type === "reddit_client") {
      expect(r.renderer.postUrl).not.toMatch(/\/$/)
    }
  })

  /* ------ Google Maps ------ */

  it("Google Maps: place URL", () => {
    const r = resolveEmbed("https://www.google.com/maps/place/Eiffel+Tower")
    expect(r.provider).toBe("google-maps")
    expect(r.renderer.type).toBe("iframe")
    if (r.renderer.type === "iframe") {
      expect(r.renderer.src).toContain("output=embed")
    }
  })

  /* ------ Vimeo ------ */

  it("Vimeo: video URL", () => {
    const r = resolveEmbed("https://vimeo.com/76979871")
    expect(r.provider).toBe("vimeo")
    expect(r.renderer.type).toBe("iframe")
    if (r.renderer.type === "iframe") {
      expect(r.renderer.src).toBe("https://player.vimeo.com/video/76979871")
    }
  })

  /* ------ TikTok ------ */

  it("TikTok: canonical video URL", () => {
    const r = resolveEmbed("https://www.tiktok.com/@scout2015/video/6718335390845095173")
    expect(r.provider).toBe("tiktok")
    expect(r.renderer.type).toBe("iframe")
  })

  it("TikTok: vm.tiktok.com short link", () => {
    const r = resolveEmbed("https://vm.tiktok.com/ZMabcdef123/")
    expect(r.provider).toBe("tiktok")
    expect(r.renderer.type).toBe("tiktok_client")
  })

  /* ------ Fallback ------ */

  it("Fallback: unknown domain → link preview", () => {
    const r = resolveEmbed("https://example.com/page")
    expect(r.provider).toBe("link")
    expect(r.renderer.type).toBe("link")
    if (r.renderer.type === "link") {
      expect(r.renderer.href).toBe("https://example.com/page")
    }
  })

  /* ------ Invalid ------ */

  it("Invalid: gibberish input", () => {
    const r = resolveEmbed("not a url")
    expect(r.provider).toBe("invalid")
    expect(r.renderer.type).toBe("invalid")
  })

  it("Invalid: empty string", () => {
    const r = resolveEmbed("")
    expect(r.provider).toBe("invalid")
  })
})
