import type { Metadata, Viewport } from "next"
import type { CSSProperties, ReactNode } from "react"

import { RootProvider } from "fumadocs-ui/provider/next"

import "./global.css"

export const metadata: Metadata = {
  title: {
    default: "embed-card",
    template: "%s | embed-card",
  },
  description:
    "Documentation and live demos for the embed-card package in one Next.js app.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

const fontVariables = {
  "--font-sans": '"Avenir Next", "Gill Sans", sans-serif',
  "--font-mono": '"SFMono-Regular", "Menlo", monospace',
} as CSSProperties

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={fontVariables}
    >
      <body className="flex min-h-screen flex-col font-sans text-fd-foreground">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
