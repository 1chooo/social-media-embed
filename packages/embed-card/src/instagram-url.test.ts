import { describe, expect, it } from "vitest"

import { instagramEmbedSrc, isInstagramHost, parseInstagramPermalink } from "./instagram-url"

describe("isInstagramHost", () => {
  it("accepts instagram.com, www, and mobile hostnames", () => {
    expect(isInstagramHost("instagram.com")).toBe(true)
    expect(isInstagramHost("www.instagram.com")).toBe(true)
    expect(isInstagramHost("m.instagram.com")).toBe(true)
  })

  it("rejects other hosts", () => {
    expect(isInstagramHost("evilinstagram.com")).toBe(false)
    expect(isInstagramHost("instagram.com.evil")).toBe(false)
    expect(isInstagramHost("cdninstagram.com")).toBe(false)
  })
})

describe("parseInstagramPermalink", () => {
  it("parses /p/, /reel/, and /tv/ with optional trailing slash", () => {
    expect(parseInstagramPermalink(new URL("https://www.instagram.com/p/AbC12_x-y/"))).toEqual({
      kind: "p",
      shortcode: "AbC12_x-y",
    })
    expect(parseInstagramPermalink(new URL("https://instagram.com/reel/XYZ9"))).toEqual({
      kind: "reel",
      shortcode: "XYZ9",
    })
    expect(parseInstagramPermalink(new URL("https://m.instagram.com/tv/aa11_bb22/?igsh=foo"))).toEqual({
      kind: "tv",
      shortcode: "aa11_bb22",
    })
  })

  it("returns null for profile and other paths", () => {
    expect(parseInstagramPermalink(new URL("https://www.instagram.com/nasa/"))).toBeNull()
    expect(parseInstagramPermalink(new URL("https://www.instagram.com/"))).toBeNull()
    expect(
      parseInstagramPermalink(new URL("https://www.instagram.com/stories/nasa/123456/"))
    ).toBeNull()
    expect(parseInstagramPermalink(new URL("https://www.instagram.com/p/"))).toBeNull()
  })

  it("returns null for non-Instagram hosts", () => {
    expect(parseInstagramPermalink(new URL("https://example.com/p/abc123/"))).toBeNull()
  })

  it("does not match extra path segments after shortcode", () => {
    expect(parseInstagramPermalink(new URL("https://www.instagram.com/p/abc123/extra/"))).toBeNull()
  })
})

describe("instagramEmbedSrc", () => {
  it("builds www embed URLs preserving permalink kind", () => {
    expect(
      instagramEmbedSrc({ kind: "p", shortcode: "CODE" })
    ).toBe("https://www.instagram.com/p/CODE/embed/")
    expect(
      instagramEmbedSrc({ kind: "reel", shortcode: "R1" })
    ).toBe("https://www.instagram.com/reel/R1/embed/")
    expect(
      instagramEmbedSrc({ kind: "tv", shortcode: "T1" })
    ).toBe("https://www.instagram.com/tv/T1/embed/")
  })
})
