import type { Metadata } from "next"
import Link from "next/link"

import { DocHighlightCards } from "@/components/home/doc-highlight-cards"
import { FeatureGrid } from "@/components/home/feature-grid"
import { HomeGuidesShowcase } from "@/components/home/home-guides-showcase"
import { HomePlatformsSection } from "@/components/home/home-platforms-section"
import { HeroSection } from "@/components/home/hero-section"
import { HomePlaygroundSection } from "@/components/home-playground-section"
import { SITE_GITHUB_URL, SITE_NPM_URL } from "@/lib/layout.shared"
import { ThemedEmbedCard } from "embed-card/next-themes"

const exampleUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

const description =
  "Pass a URL and render the matching embed card—YouTube, X, Reddit, Maps, Vimeo, and more—without wiring one-off components."

export const metadata: Metadata = {
  title: { absolute: "embed-card" },
  description,
  openGraph: {
    title: "embed-card",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "embed-card",
    description,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "embed-card",
  description,
  url: SITE_NPM_URL,
  codeRepository: SITE_GITHUB_URL,
  programmingLanguage: "TypeScript",
  license: "https://opensource.org/licenses/MIT",
} as const

export default function HomePage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
        type="application/ld+json"
      />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-6 pb-20 pt-10 md:gap-16 md:px-10 md:pb-24 md:pt-12">
        <div className="home-hero-surface -mx-2 overflow-hidden shadow-sm sm:-mx-4 md:-mx-6">
          <HeroSection
            preview={
              <ThemedEmbedCard
                theme={{
                  accentColor: "#e11d48",
                  radius: 8,
                }}
                url={exampleUrl}
              />
            }
          />

          <HomePlaygroundSection />
        </div>

        <section className="space-y-5">
          <div className="max-w-2xl space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight text-fd-foreground sm:text-xl">
              Built for product pages and docs
            </h2>
            <p className="text-sm leading-relaxed text-fd-muted-foreground">
              One mental model for previews: paste a link, render a card, ship.
              Explore how it maps to your stack below.
            </p>
          </div>
          <FeatureGrid />
        </section>

        <HomeGuidesShowcase
          description="Each tile is a live EmbedCard for a real URL—hover to straighten the preview, then open the matching platform doc for URL rules and theming."
          title="Guides"
        />

        <HomePlatformsSection
          description={
            <>
              Built-in providers cover the hosts below. Read match rules,
              caveats, and theming on{" "}
              <Link
                className="font-medium text-fd-foreground underline-offset-2 hover:underline"
                href="/docs/platforms"
              >
                Supported platforms
              </Link>
              , or jump straight into the{" "}
              <Link
                className="font-medium text-fd-foreground underline-offset-2 hover:underline"
                href="/docs/playground"
              >
                playground
              </Link>{" "}
              to paste any sample.
            </>
          }
          title="Platforms"
        />

        <section className="space-y-5">
          <div className="max-w-2xl space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight text-fd-foreground sm:text-xl">
              Quick links
            </h2>
            <p className="text-sm leading-relaxed text-fd-muted-foreground">
              Docs, playground, and the full table of contents in one place.
            </p>
          </div>
          <DocHighlightCards />
        </section>
      </div>
    </>
  )
}
