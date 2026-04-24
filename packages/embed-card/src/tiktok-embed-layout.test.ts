import { describe, expect, it } from "vitest"

import {
  TIKTOK_EMBED_ASPECT_RATIO,
  TIKTOK_EMBED_MAX_HEIGHT_PX,
  TIKTOK_EMBED_MAX_WIDTH_PX,
  TIKTOK_EMBED_MIN_HEIGHT_PX,
  tiktokEmbedMaxHeightCss,
} from "./tiktok-embed-layout"

describe("tiktok-embed-layout constants", () => {
  it("has expected aspect ratio", () => {
    expect(TIKTOK_EMBED_ASPECT_RATIO).toBe("9 / 16")
  })

  it("has expected max width", () => {
    expect(TIKTOK_EMBED_MAX_WIDTH_PX).toBe(420)
  })

  it("has expected max height", () => {
    expect(TIKTOK_EMBED_MAX_HEIGHT_PX).toBe(480)
  })

  it("has expected min height", () => {
    expect(TIKTOK_EMBED_MIN_HEIGHT_PX).toBe(280)
  })
})

describe("tiktokEmbedMaxHeightCss", () => {
  it("returns CSS min() combining px, vmin, and dvh", () => {
    const css = tiktokEmbedMaxHeightCss()
    expect(css).toBe("min(480px, 90vmin, 65dvh)")
  })
})
