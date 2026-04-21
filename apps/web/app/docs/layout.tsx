import type { ReactNode } from "react"

import { DocsLayout } from "fumadocs-ui/layouts/docs"

import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions()}
      tree={source.getPageTree()}
      sidebar={{
        banner: (
          <div className="rounded-md border border-fd-border bg-fd-background p-4 text-sm leading-6 text-fd-muted-foreground">
            Open the{" "}
            <a className="font-medium text-fd-foreground underline-offset-2 hover:underline" href="/docs/playground">
              playground
            </a>{" "}
            to try URLs and themes, or follow these guides to wire the package
            into React, a custom element, or a manual render path.
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  )
}
