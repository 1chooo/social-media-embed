import { HomeEmbedPlayground } from "@/components/home-embed-playground"

export function HomePlaygroundSection() {
  return (
    <section
      className="scroll-mt-24 border-t border-fd-border"
      id="playground"
    >
      <div className="grid gap-10 overflow-hidden px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <HomeEmbedPlayground bleed={false} />
        </div>
      </div>
    </section>
  )
}
