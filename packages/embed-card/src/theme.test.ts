import { describe, expect, it } from "vitest"

import {
  createThemeVariables,
  EMBED_CARD_DEFAULT_FONT_FAMILY,
  EMBED_CARD_DEFAULT_SHADOW,
  resolveEmbedCardAppearance,
  variablesToInlineStyle,
} from "./theme"

/* ------------------------------------------------------------------ */
/*  resolveEmbedCardAppearance                                        */
/* ------------------------------------------------------------------ */

describe("resolveEmbedCardAppearance", () => {
  it("returns 'light' by default (no appearance set)", () => {
    expect(resolveEmbedCardAppearance(undefined)).toBe("light")
  })

  it("returns 'light' when explicitly set", () => {
    expect(resolveEmbedCardAppearance("light")).toBe("light")
  })

  it("returns 'dark' when explicitly set", () => {
    expect(resolveEmbedCardAppearance("dark")).toBe("dark")
  })

  it("returns 'dark' for system + prefers dark", () => {
    expect(resolveEmbedCardAppearance("system", true)).toBe("dark")
  })

  it("returns 'light' for system + prefers light", () => {
    expect(resolveEmbedCardAppearance("system", false)).toBe("light")
  })
})

/* ------------------------------------------------------------------ */
/*  createThemeVariables — light mode defaults                        */
/* ------------------------------------------------------------------ */

describe("createThemeVariables — light defaults", () => {
  const vars = createThemeVariables({}, "light")

  it("uses light accent color", () => {
    expect(vars["--embed-card-accent"]).toBe("#111827")
  })

  it("sets light background", () => {
    expect(vars["--embed-card-background"]).toContain("255")
  })

  it("uses default radius", () => {
    expect(vars["--embed-card-radius"]).toBe("24px")
  })

  it("uses default shadow", () => {
    expect(vars["--embed-card-shadow"]).toBe(EMBED_CARD_DEFAULT_SHADOW)
  })

  it("uses default font family", () => {
    expect(vars["--embed-card-font-family"]).toBe(EMBED_CARD_DEFAULT_FONT_FAMILY)
  })

  it("uses white chrome tint", () => {
    expect(vars["--embed-card-chrome-tint"]).toBe("#ffffff")
  })
})

/* ------------------------------------------------------------------ */
/*  createThemeVariables — dark mode defaults                         */
/* ------------------------------------------------------------------ */

describe("createThemeVariables — dark defaults", () => {
  const vars = createThemeVariables({}, "dark")

  it("uses dark accent color", () => {
    expect(vars["--embed-card-accent"]).toBe("#e2e8f0")
  })

  it("sets dark background", () => {
    expect(vars["--embed-card-background"]).toContain("15")
  })

  it("uses dark chrome tint", () => {
    expect(vars["--embed-card-chrome-tint"]).toBe("#0f172a")
  })

  it("uses dark preview canvas", () => {
    expect(vars["--embed-card-preview-canvas"]).toBe("#0d1420")
  })
})

/* ------------------------------------------------------------------ */
/*  createThemeVariables — custom overrides                           */
/* ------------------------------------------------------------------ */

describe("createThemeVariables — overrides", () => {
  it("applies custom accentColor and derives border from it", () => {
    const vars = createThemeVariables({ accentColor: "#ff0033" }, "light")
    expect(vars["--embed-card-accent"]).toBe("#ff0033")
    // border should be derived from the accent hex
    expect(vars["--embed-card-border"]).toContain("rgba(255, 0, 51,")
  })

  it("applies numeric radius as px", () => {
    const vars = createThemeVariables({ radius: 12 }, "light")
    expect(vars["--embed-card-radius"]).toBe("12px")
  })

  it("applies string radius as-is", () => {
    const vars = createThemeVariables({ radius: "1rem" }, "light")
    expect(vars["--embed-card-radius"]).toBe("1rem")
  })

  it("applies custom shadow", () => {
    const vars = createThemeVariables({ shadow: "0 4px 12px rgba(0,0,0,0.1)" }, "light")
    expect(vars["--embed-card-shadow"]).toBe("0 4px 12px rgba(0,0,0,0.1)")
  })

  it("applies custom fontFamily", () => {
    const vars = createThemeVariables({ fontFamily: '"Inter", sans-serif' }, "light")
    expect(vars["--embed-card-font-family"]).toBe('"Inter", sans-serif')
  })

  it("falls back to mode default border for invalid hex accent", () => {
    const vars = createThemeVariables({ accentColor: "notahex" }, "light")
    // should fall through to the light default border
    expect(vars["--embed-card-border"]).toContain("rgba(15, 23, 42,")
  })

  it("handles 3-char shorthand hex accent", () => {
    const vars = createThemeVariables({ accentColor: "#f00" }, "light")
    expect(vars["--embed-card-border"]).toContain("rgba(255, 0, 0,")
  })
})

/* ------------------------------------------------------------------ */
/*  variablesToInlineStyle                                            */
/* ------------------------------------------------------------------ */

describe("variablesToInlineStyle", () => {
  it("produces semicolon-separated key:value pairs", () => {
    const vars = createThemeVariables({}, "light")
    const style = variablesToInlineStyle(vars)

    expect(style).toContain("--embed-card-accent:#111827")
    expect(style).toContain(";")
    // Should contain all 10 variables
    const segments = style.split(";")
    expect(segments.length).toBe(10)
  })
})
