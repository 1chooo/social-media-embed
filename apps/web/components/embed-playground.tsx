"use client"

import { useMemo, useState, type ReactNode } from "react"

import { EmbedCard } from "embed-card"

import { sampleEmbeds } from "@/lib/sample-urls"

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "")
  if (normalized.length !== 6) return null
  const n = Number.parseInt(normalized, 16)
  if (!Number.isFinite(n)) return null
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  }
}

function mixTowardWhite(
  hex: string,
  /** 0 = white, 1 = full accent */
  amount: number
): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return "#ffffff"
  const t = Math.min(1, Math.max(0, amount))
  const mix = (c: number) => Math.round(255 + (c - 255) * t)
  return `rgb(${mix(rgb.r)}, ${mix(rgb.g)}, ${mix(rgb.b)})`
}

function pillClassName(isActive: boolean): string {
  return [
    "inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-xs font-medium transition",
    isActive
      ? "border-fd-primary bg-fd-primary text-fd-primary-foreground"
      : "border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-muted/60",
  ].join(" ")
}

function ControlRow({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-fd-muted-foreground">
          {label}
        </span>
        <code className="text-xs tabular-nums text-fd-foreground">{value}</code>
      </div>
      {children}
    </div>
  )
}

const rangeClass =
  "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-fd-muted accent-fd-primary"

export function EmbedPlayground() {
  const [url, setUrl] = useState<string>(sampleEmbeds[0].url)
  const [accentHex, setAccentHex] = useState("#e11d48")
  const [radius, setRadius] = useState(28)
  const [borderAlpha, setBorderAlpha] = useState(22)
  const [shadowAlpha, setShadowAlpha] = useState(18)
  const [bgTint, setBgTint] = useState(8)

  const theme = useMemo(() => {
    const rgb = hexToRgb(accentHex)
    const border = rgb
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderAlpha / 100})`
      : "rgba(15, 23, 42, 0.12)"
    const shadow = rgb
      ? `0 24px 72px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowAlpha / 100})`
      : "0 24px 80px rgba(15, 23, 42, 0.14)"
    const background = mixTowardWhite(accentHex, bgTint / 100)
    const muted = rgb
      ? `rgba(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)}, 0.65)`
      : "rgba(15, 23, 42, 0.62)"

    return {
      accentColor: accentHex,
      background,
      borderColor: border,
      mutedColor: muted,
      radius,
      shadow,
    }
  }, [accentHex, radius, borderAlpha, shadowAlpha, bgTint])

  const snippet = `import { EmbedCard } from "embed-card"

export function Example() {
  return (
    <EmbedCard
      url="${url}"
      theme={{
        accentColor: "${theme.accentColor}",
        background: "${theme.background}",
        borderColor: "${theme.borderColor}",
        mutedColor: "${theme.mutedColor}",
        radius: ${radius},
        shadow: "${theme.shadow}",
      }}
    />
  )
}`

  return (
    <div className="not-prose -mx-4 flex min-h-0 min-w-0 flex-col border border-fd-border lg:-mx-6 lg:flex-row lg:rounded-lg">
      <div className="relative flex min-h-[320px] flex-1 items-center justify-center bg-fd-muted/20 p-6 lg:min-h-[480px] lg:p-10">
        <div className="relative w-full max-w-xl min-w-0">
          <EmbedCard theme={theme} url={url} />
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-8 border-t border-fd-border bg-fd-background p-6 lg:w-[min(100%,380px)] lg:border-t-0 lg:border-l">
        <div>
          <p className="text-xs font-medium text-fd-muted-foreground">
            Embed URL
          </p>
          <input
            className="mt-2 h-10 w-full rounded-md border border-fd-border bg-fd-background px-3 font-mono text-xs outline-none ring-fd-primary focus-visible:ring-2"
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            spellCheck={false}
            value={url}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {sampleEmbeds.map((sample) => (
              <button
                className={pillClassName(sample.url === url)}
                key={sample.label}
                onClick={() => setUrl(sample.url)}
                type="button"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <ControlRow label="accent" value={accentHex}>
            <input
              className="h-9 w-full max-w-[200px] cursor-pointer rounded border border-fd-border bg-fd-background p-1"
              onChange={(e) => setAccentHex(e.target.value)}
              type="color"
              value={accentHex}
            />
          </ControlRow>

          <ControlRow label="radius" value={`${radius}px`}>
            <input
              className={rangeClass}
              max={48}
              min={8}
              onChange={(e) => setRadius(Number(e.target.value))}
              type="range"
              value={radius}
            />
          </ControlRow>

          <ControlRow
            label="borderAlpha"
            value={(borderAlpha / 100).toFixed(2)}
          >
            <input
              className={rangeClass}
              max={60}
              min={4}
              onChange={(e) => setBorderAlpha(Number(e.target.value))}
              type="range"
              value={borderAlpha}
            />
          </ControlRow>

          <ControlRow
            label="shadowAlpha"
            value={(shadowAlpha / 100).toFixed(2)}
          >
            <input
              className={rangeClass}
              max={45}
              min={0}
              onChange={(e) => setShadowAlpha(Number(e.target.value))}
              type="range"
              value={shadowAlpha}
            />
          </ControlRow>

          <ControlRow label="bgTint" value={(bgTint / 100).toFixed(2)}>
            <input
              className={rangeClass}
              max={28}
              min={0}
              onChange={(e) => setBgTint(Number(e.target.value))}
              type="range"
              value={bgTint}
            />
          </ControlRow>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-fd-muted-foreground">Snippet</p>
          <pre className="mt-2 max-h-56 overflow-auto rounded-md border border-fd-border bg-fd-muted/40 p-3 text-[11px] leading-relaxed text-fd-foreground">
            <code>{snippet}</code>
          </pre>
        </div>
      </aside>
    </div>
  )
}
