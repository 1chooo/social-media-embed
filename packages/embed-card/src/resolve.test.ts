import { describe, expect, it } from "vitest"

import { defaultProviders } from "./providers"
import { resolveEmbed } from "./resolve"
import type { EmbedProvider } from "./types"

/* ------------------------------------------------------------------ */
/*  parseUrl (tested indirectly through resolveEmbed)                 */
/* ------------------------------------------------------------------ */

describe("resolveEmbed — URL parsing", () => {
  it("handles full URLs", () => {
    const r = resolveEmbed("https://www.youtube.com/watch?v=abc")
    expect(r.provider).toBe("youtube")
  })

  it("auto-prefixes schemeless domains with https://", () => {
    const r = resolveEmbed("vimeo.com/12345")
    expect(r.provider).toBe("vimeo")
  })

  it("trims surrounding whitespace", () => {
    const r = resolveEmbed("  https://vimeo.com/12345  ")
    expect(r.provider).toBe("vimeo")
  })

  it("returns invalid for gibberish input", () => {
    const r = resolveEmbed("not-a-url at all")
    expect(r.provider).toBe("invalid")
    expect(r.renderer.type).toBe("invalid")
  })

  it("returns invalid for empty string", () => {
    const r = resolveEmbed("")
    expect(r.provider).toBe("invalid")
  })

  it("returns invalid for whitespace-only input", () => {
    const r = resolveEmbed("   ")
    expect(r.provider).toBe("invalid")
  })
})

/* ------------------------------------------------------------------ */
/*  Provider chain                                                    */
/* ------------------------------------------------------------------ */

describe("resolveEmbed — provider chain", () => {
  it("uses custom providers list when provided", () => {
    const fakeProvider: EmbedProvider = {
      id: "fake",
      label: "Fake",
      accentColor: "#000",
      match: () => true,
      resolve: (url) => ({
        provider: "fake",
        providerLabel: "Fake",
        accentColor: "#000",
        title: "Fake",
        description: "Fake",
        site: url.hostname,
        url: url.toString(),
        displayUrl: url.hostname,
        renderer: { type: "invalid", message: "fake" },
      }),
    }

    const r = resolveEmbed("https://www.youtube.com/watch?v=test", {
      providers: [fakeProvider],
    })
    expect(r.provider).toBe("fake")
  })

  it("first-match wins when multiple providers could match", () => {
    // YouTube is first in defaultProviders, so it should win
    const r = resolveEmbed("https://www.youtube.com/watch?v=abc", {
      providers: defaultProviders,
    })
    expect(r.provider).toBe("youtube")
  })
})

/* ------------------------------------------------------------------ */
/*  Fallback behaviour                                                */
/* ------------------------------------------------------------------ */

describe("resolveEmbed — fallback", () => {
  it("returns link fallback for unrecognised URLs by default", () => {
    const r = resolveEmbed("https://example.com/some-page")
    expect(r.provider).toBe("link")
    expect(r.renderer.type).toBe("link")
  })

  it("returns invalid when includeFallback is false", () => {
    const r = resolveEmbed("https://example.com/page", { includeFallback: false })
    expect(r.provider).toBe("invalid")
    expect(r.renderer.type).toBe("invalid")
  })
})

/* ------------------------------------------------------------------ */
/*  Appearance context                                                */
/* ------------------------------------------------------------------ */

describe("resolveEmbed — appearance", () => {
  it("passes appearance through to providers", () => {
    const r = resolveEmbed("https://x.com/user/status/123", { appearance: "dark" })
    expect(r.provider).toBe("twitter")
    if (r.renderer.type === "iframe") {
      expect(r.renderer.src).toContain("theme=dark")
    }
  })
})
