"use client"

import { useCallback, useMemo, useState, type ReactNode } from "react"

import type { EmbedCardTheme } from "embed-card"
import { EMBED_CARD_DEFAULT_SHADOW } from "embed-card"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

import {
  DEFAULTS,
  buildSnippet,
  hexToRgb,
  pillClassName,
  rgbaAlpha,
} from "@/components/embed-playground-shared"
import { demoThemes, sampleEmbeds } from "@/lib/sample-urls"
import { ThemedEmbedCard } from "embed-card/next-themes"

function ControlRow({
  label,
  value,
  hint,
  children,
}: {
  label: string
  value: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-medium text-fd-foreground">{label}</span>
          {hint ? (
            <p className="mt-0.5 text-[11px] leading-snug text-fd-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
        <code className="shrink-0 rounded bg-fd-muted/60 px-1.5 py-0.5 text-[11px] tabular-nums text-fd-foreground">
          {value}
        </code>
      </div>
      {children}
    </div>
  )
}

/** Full mode: clear track + fill + larger thumb; transparent native track so fill shows through. */
function SliderField({
  min,
  max,
  value,
  onChange,
  "aria-label": ariaLabel,
}: {
  min: number
  max: number
  value: number
  onChange: (v: number) => void
  "aria-label"?: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  const rangeClass = [
    "relative z-10 h-9 w-full cursor-pointer appearance-none bg-transparent",
    "[&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent",
    "[&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-webkit-slider-thumb]:mt-0 [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:-translate-y-px [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-fd-background [&::-webkit-slider-thumb]:bg-fd-primary [&::-webkit-slider-thumb]:shadow-md",
    "[&::-moz-range-track]:h-3 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent",
    "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-fd-background [&::-moz-range-thumb]:bg-fd-primary [&::-moz-range-thumb]:shadow-md",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background",
  ].join(" ")

  return (
    <div className="relative rounded-full border border-fd-border bg-fd-muted/35 px-3 py-2.5">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 left-4 h-3 -translate-y-1/2 rounded-full bg-fd-muted/80"
      >
        <div
          className="h-full rounded-l-full bg-fd-primary/45"
          style={{ width: `${pct}%` }}
        />
      </div>
      <input
        aria-label={ariaLabel}
        className={rangeClass}
        max={max}
        min={min}
        onChange={(e) => onChange(Number(e.target.value))}
        type="range"
        value={value}
      />
    </div>
  )
}

export type EmbedPlaygroundProps = {
  /** Negative margin for full-bleed inside docs prose (default: true). */
  bleed?: boolean
  /** Whether the code snippet starts expanded. */
  defaultSnippetOpen?: boolean
}

export function EmbedPlayground({
  bleed = true,
  defaultSnippetOpen = true,
}: EmbedPlaygroundProps) {
  const [url, setUrl] = useState<string>(sampleEmbeds[0].url)

  const [accentHex, setAccentHex] = useState(DEFAULTS.accentHex)
  const [radius, setRadius] = useState(DEFAULTS.radius)
  const [borderAlpha, setBorderAlpha] = useState(DEFAULTS.borderAlpha)
  const [shadowAlpha, setShadowAlpha] = useState(DEFAULTS.shadowAlpha)
  const [shadowSpread, setShadowSpread] = useState(DEFAULTS.shadowSpread)
  const [activePresetId, setActivePresetId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [snippetOpen, setSnippetOpen] = useState(defaultSnippetOpen)

  const cardTheme = useMemo(() => {
    const rgb = hexToRgb(accentHex)
    const border = rgb
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderAlpha / 100})`
      : "rgba(15, 23, 42, 0.12)"
    const shadow =
      rgb && shadowAlpha > 0
        ? `0 24px ${shadowSpread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowAlpha / 100})`
        : "none"

    return {
      accentColor: accentHex,
      borderColor: border,
      radius,
      ...(shadow !== EMBED_CARD_DEFAULT_SHADOW ? { shadow } : {}),
    }
  }, [
    accentHex,
    radius,
    borderAlpha,
    shadowAlpha,
    shadowSpread,
  ])

  const snippet = useMemo(
    () => buildSnippet(url, cardTheme),
    [url, cardTheme]
  )

  const copySnippet = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [snippet])

  const resetFull = useCallback(() => {
    setAccentHex(DEFAULTS.accentHex)
    setRadius(DEFAULTS.radius)
    setBorderAlpha(DEFAULTS.borderAlpha)
    setShadowAlpha(DEFAULTS.shadowAlpha)
    setShadowSpread(DEFAULTS.shadowSpread)
    setUrl(sampleEmbeds[0].url)
    setActivePresetId(null)
  }, [])

  const applyDemoPresetFull = useCallback(
    (id: (typeof demoThemes)[number]["id"]) => {
      const entry = demoThemes.find((d) => d.id === id)
      if (!entry) return
      const t: EmbedCardTheme = entry.theme
      setAccentHex(t.accentColor ?? DEFAULTS.accentHex)
      setRadius(typeof t.radius === "number" ? t.radius : DEFAULTS.radius)
      const ba = rgbaAlpha(
        t.borderColor ?? "rgba(15, 23, 42, 0.12)"
      )
      setBorderAlpha(ba ?? DEFAULTS.borderAlpha)
      const sa = t.shadow != null ? rgbaAlpha(t.shadow) : null
      setShadowAlpha(sa ?? DEFAULTS.shadowAlpha)
      const blurMatch = t.shadow?.match(/0\s+[\d.]+px\s+(\d+)px\s+rgba/i)
      if (blurMatch?.[1])
        setShadowSpread(Number.parseInt(blurMatch[1], 10))
      setActivePresetId(id)
    },
    []
  )

  const outerClass = [
    "not-prose flex min-h-0 min-w-0 flex-col border border-fd-border bg-fd-background lg:flex-row lg:rounded-lg",
    bleed ? "-mx-4 lg:-mx-6" : "overflow-hidden rounded-xl shadow-sm",
  ].join(" ")

  return (
    <div className={outerClass}>
      <div className="flex min-h-[280px] flex-1 flex-col lg:min-h-[min(520px,calc(100dvh-16rem))]">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-6 lg:px-10">
          <div className="w-full max-w-3xl min-w-0">
            <ThemedEmbedCard theme={cardTheme} url={url} />
          </div>
        </div>
      </div>

      <aside
        className={[
          "flex w-full shrink-0 flex-col gap-0 border-t border-fd-border bg-fd-background lg:w-[min(100%,400px)] lg:border-t-0 lg:border-l lg:overflow-y-auto lg:self-start",
          "lg:max-h-[min(720px,calc(100dvh-8rem))] lg:sticky lg:top-28",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-2 border-b border-fd-border px-4 py-3 sm:px-5">
          <span className="text-xs font-semibold text-fd-foreground">
            Controls
          </span>
          <div className="flex shrink-0 gap-2">
            <button
              className="rounded-md border border-fd-border px-2.5 py-1.5 text-[11px] font-medium text-fd-muted-foreground transition hover:bg-fd-muted/50 hover:text-fd-foreground"
              onClick={resetFull}
              type="button"
            >
              Reset
            </button>
            <button
              className="rounded-md border border-fd-border bg-fd-primary px-2.5 py-1.5 text-[11px] font-medium text-fd-primary-foreground transition hover:opacity-90"
              onClick={copySnippet}
              type="button"
            >
              {copied ? "Copied" : "Copy code"}
            </button>
          </div>
        </div>

        <div className="space-y-8 px-4 py-6 sm:px-5">
          <div>
            <p className="text-xs font-semibold text-fd-foreground">Source</p>
            <label className="mt-3 block text-[11px] font-medium text-fd-muted-foreground">
              URL
              <input
                className="mt-1.5 h-10 w-full rounded-md border border-fd-border bg-fd-background px-3 font-mono text-xs text-fd-foreground outline-none transition placeholder:text-fd-muted-foreground focus-visible:border-fd-primary focus-visible:ring-2 focus-visible:ring-fd-primary/25"
                onChange={(e) => {
                  setUrl(e.target.value)
                  setActivePresetId(null)
                }}
                placeholder="https://..."
                spellCheck={false}
                value={url}
              />
            </label>
            <p className="mt-3 text-[11px] font-medium text-fd-muted-foreground">
              Samples
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sampleEmbeds.map((sample) => (
                <button
                  className={pillClassName(sample.url === url)}
                  key={sample.label}
                  onClick={() => {
                    setUrl(sample.url)
                    setActivePresetId(null)
                  }}
                  type="button"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-fd-foreground">
              Theme presets
            </p>
            <p className="mt-1 text-[11px] text-fd-muted-foreground">
              Jump to a palette, then fine-tune with the sliders below.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {demoThemes.map((preset) => (
                <button
                  className={pillClassName(activePresetId === preset.id)}
                  key={preset.id}
                  onClick={() => applyDemoPresetFull(preset.id)}
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-7 border-t border-fd-border pt-8">
            <p className="text-xs font-semibold text-fd-foreground">
              Fine-tune embed surface
            </p>

            <ControlRow label="Accent" value={accentHex} hint="Picker + presets above.">
              <input
                aria-label="Accent color"
                className="h-10 w-full max-w-[220px] cursor-pointer rounded-md border border-fd-border bg-fd-background p-1"
                onChange={(e) => {
                  setAccentHex(e.target.value)
                  setActivePresetId(null)
                }}
                type="color"
                value={accentHex}
              />
            </ControlRow>

            <ControlRow label="Radius" value={`${radius}px`} hint="Card corner radius.">
              <SliderField
                aria-label="Radius"
                max={48}
                min={8}
                onChange={(v) => {
                  setRadius(v)
                  setActivePresetId(null)
                }}
                value={radius}
              />
            </ControlRow>

            <ControlRow
              label="Border blend"
              value={(borderAlpha / 100).toFixed(2)}
              hint="Accent mixed into the border."
            >
              <SliderField
                aria-label="Border blend"
                max={60}
                min={4}
                onChange={(v) => {
                  setBorderAlpha(v)
                  setActivePresetId(null)
                }}
                value={borderAlpha}
              />
            </ControlRow>

            <ControlRow
              label="Shadow depth"
              value={(shadowAlpha / 100).toFixed(2)}
              hint="Glow strength under the card."
            >
              <SliderField
                aria-label="Shadow depth"
                max={45}
                min={0}
                onChange={(v) => {
                  setShadowAlpha(v)
                  setActivePresetId(null)
                }}
                value={shadowAlpha}
              />
            </ControlRow>

            <ControlRow
              label="Shadow reach"
              value={`${shadowSpread}px`}
              hint="How far the shadow spreads."
            >
              <SliderField
                aria-label="Shadow reach"
                max={120}
                min={32}
                onChange={(v) => {
                  setShadowSpread(v)
                  setActivePresetId(null)
                }}
                value={shadowSpread}
              />
            </ControlRow>

          </div>

          <div className="border-t border-fd-border pt-6">
            <button
              className="flex w-full items-center justify-between gap-2 rounded-md py-1 text-left text-xs font-semibold text-fd-foreground transition hover:text-fd-primary"
              onClick={() => setSnippetOpen((o) => !o)}
              type="button"
            >
              <span>React snippet</span>
              <span className="text-[11px] font-normal text-fd-muted-foreground">
                {snippetOpen ? "Hide" : "Show"}
              </span>
            </button>
            {snippetOpen ? (
              <DynamicCodeBlock
                code={snippet}
                lang="tsx"
                codeblock={{
                  allowCopy: false,
                  className:
                    "not-prose my-0 mt-3 max-h-52 overflow-auto rounded-md border border-fd-border bg-fd-muted/30 text-[11px] leading-relaxed text-fd-foreground",
                }}
              />
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  )
}
