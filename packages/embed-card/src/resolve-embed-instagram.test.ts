import { describe, expect, it } from "vitest"

import { defaultProviders } from "./providers"
import { resolveEmbed } from "./resolve"

describe("resolveEmbed instagram", () => {
  it("resolves p, reel, and tv permalinks to iframe embeds", () => {
    const cases = [
      "https://www.instagram.com/p/BR5ySLCBglt/",
      "https://instagram.com/reel/CxYz123abC/",
      "https://m.instagram.com/tv/Ab12Cd34Ef/",
    ]

    for (const url of cases) {
      const r = resolveEmbed(url, { providers: defaultProviders })
      expect(r.provider).toBe("instagram")
      expect(r.renderer.type).toBe("iframe")
      if (r.renderer.type === "iframe") {
        expect(r.renderer.src).toContain("/embed/")
        expect(r.renderer.src.startsWith("https://www.instagram.com/")).toBe(true)
      }
    }
  })

  it("falls back to link preview for Instagram profiles", () => {
    const r = resolveEmbed("https://www.instagram.com/nasa/", { providers: defaultProviders })
    expect(r.provider).toBe("link")
    expect(r.renderer.type).toBe("link")
  })
})
