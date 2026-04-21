import type { Metadata } from "next"
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page"

import { EmbedPlayground } from "@/components/embed-playground"

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Try sample URLs and theme options; the preview updates as you adjust controls.",
}

export default function DocsPlaygroundPage() {
  return (
    <DocsPage full>
      <DocsTitle>Playground</DocsTitle>
      <DocsDescription>
        Paste a URL or pick a sample, then use presets and fine-grained sliders
        below. The snippet always matches your current settings.
      </DocsDescription>
      <DocsBody>
        <EmbedPlayground mode="full" />
      </DocsBody>
    </DocsPage>
  )
}
