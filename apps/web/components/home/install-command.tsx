"use client"

import { useState } from "react"

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

type PackageManager = "pnpm" | "npm" | "yarn"

const commands: Record<PackageManager, string> = {
  pnpm: "pnpm add embed-card",
  npm: "npm install embed-card",
  yarn: "yarn add embed-card",
}

const codeblockClassName =
  "not-prose my-0 max-h-64 overflow-auto rounded-sm border border-fd-border bg-fd-muted/30 text-[11px] leading-relaxed text-fd-foreground shadow-sm"

export function InstallCommand() {
  const [pm, setPm] = useState<PackageManager>("pnpm")

  const code = commands[pm]

  return (
    <div className="not-prose space-y-3">
      <div
        aria-label="Package manager"
        className="inline-flex rounded-sm border border-fd-border bg-fd-muted/40 p-0.5"
        role="tablist"
      >
        {(["pnpm", "npm", "yarn"] as const).map((key) => (
          <button
            key={key}
            aria-selected={pm === key}
            className={
              pm === key
                ? "rounded-sm bg-fd-background px-3 py-1.5 text-xs font-medium text-fd-foreground shadow-sm ring-1 ring-fd-border/60 transition"
                : "rounded-sm px-3 py-1.5 text-xs font-medium text-fd-muted-foreground transition hover:text-fd-foreground"
            }
            onClick={() => setPm(key)}
            role="tab"
            type="button"
          >
            {key}
          </button>
        ))}
      </div>

      <DynamicCodeBlock
        code={code}
        lang="bash"
        codeblock={{
          className: codeblockClassName,
        }}
      />
    </div>
  )
}
