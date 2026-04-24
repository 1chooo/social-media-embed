import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  decodeRedditHtmlEntities,
  formatRedditScore,
  normalizeRedditPostUrl,
  redditTimeAgo,
} from "./reddit-data"

/* ------------------------------------------------------------------ */
/*  normalizeRedditPostUrl                                            */
/* ------------------------------------------------------------------ */

describe("normalizeRedditPostUrl", () => {
  it("strips trailing slash", () => {
    expect(normalizeRedditPostUrl("https://reddit.com/r/test/comments/abc/")).toBe(
      "https://reddit.com/r/test/comments/abc"
    )
  })

  it("trims whitespace", () => {
    expect(normalizeRedditPostUrl("  https://reddit.com/r/test  ")).toBe(
      "https://reddit.com/r/test"
    )
  })

  it("leaves clean URLs untouched", () => {
    expect(normalizeRedditPostUrl("https://reddit.com/r/test")).toBe(
      "https://reddit.com/r/test"
    )
  })
})

/* ------------------------------------------------------------------ */
/*  decodeRedditHtmlEntities                                          */
/* ------------------------------------------------------------------ */

describe("decodeRedditHtmlEntities", () => {
  it("replaces &amp; with &", () => {
    expect(decodeRedditHtmlEntities("a&amp;b&amp;c")).toBe("a&b&c")
  })

  it("leaves strings without entities unchanged", () => {
    expect(decodeRedditHtmlEntities("hello world")).toBe("hello world")
  })
})

/* ------------------------------------------------------------------ */
/*  formatRedditScore                                                 */
/* ------------------------------------------------------------------ */

describe("formatRedditScore", () => {
  it("returns raw number below 1000", () => {
    expect(formatRedditScore(0)).toBe("0")
    expect(formatRedditScore(42)).toBe("42")
    expect(formatRedditScore(999)).toBe("999")
  })

  it("formats 1000+ as k with one decimal", () => {
    expect(formatRedditScore(1000)).toBe("1.0k")
    expect(formatRedditScore(1500)).toBe("1.5k")
    expect(formatRedditScore(12345)).toBe("12.3k")
    expect(formatRedditScore(100000)).toBe("100.0k")
  })
})

/* ------------------------------------------------------------------ */
/*  redditTimeAgo                                                     */
/* ------------------------------------------------------------------ */

describe("redditTimeAgo", () => {
  const NOW_SECONDS = 1700000000

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW_SECONDS * 1000)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns 'just now' for < 60s", () => {
    expect(redditTimeAgo(NOW_SECONDS - 30)).toBe("just now")
  })

  it("returns minutes for 60s–3599s", () => {
    expect(redditTimeAgo(NOW_SECONDS - 120)).toBe("2 min. ago")
    expect(redditTimeAgo(NOW_SECONDS - 3599)).toBe("59 min. ago")
  })

  it("returns hours for 3600s–86399s", () => {
    expect(redditTimeAgo(NOW_SECONDS - 3600)).toBe("1 hr. ago")
    expect(redditTimeAgo(NOW_SECONDS - 7200)).toBe("2 hr. ago")
  })

  it("returns days for 86400s–2591999s", () => {
    expect(redditTimeAgo(NOW_SECONDS - 86400)).toBe("1 days ago")
    expect(redditTimeAgo(NOW_SECONDS - 604800)).toBe("7 days ago")
  })

  it("returns months for 2592000s–31535999s", () => {
    expect(redditTimeAgo(NOW_SECONDS - 2592000)).toBe("1 mo. ago")
    expect(redditTimeAgo(NOW_SECONDS - 7776000)).toBe("3 mo. ago")
  })

  it("returns years for ≥ 31536000s", () => {
    expect(redditTimeAgo(NOW_SECONDS - 31536000)).toBe("1 yr. ago")
    expect(redditTimeAgo(NOW_SECONDS - 63072000)).toBe("2 yr. ago")
  })
})
