import type { EmbedProvider, ResolvedEmbed, ResolveEmbedContext } from "./types"

function getDisplayUrl(url: URL): string {
  const pathname = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "")
  const value = `${url.hostname.replace(/^www\./, "")}${pathname}${url.search}`

  if (value.length <= 48) {
    return value
  }

  return `${value.slice(0, 45)}...`
}

function createResolvedEmbed(
  url: URL,
  provider: Pick<EmbedProvider, "id" | "label" | "accentColor">,
  config: Omit<ResolvedEmbed, "provider" | "providerLabel" | "accentColor" | "site" | "url" | "displayUrl">
): ResolvedEmbed {
  return {
    provider: provider.id,
    providerLabel: provider.label,
    accentColor: provider.accentColor,
    site: url.hostname.replace(/^www\./, ""),
    url: url.toString(),
    displayUrl: getDisplayUrl(url),
    ...config,
  }
}

function createFallbackEmbed(url: URL): ResolvedEmbed {
  return {
    provider: "link",
    providerLabel: "Link preview",
    accentColor: "#2563eb",
    title: url.hostname.replace(/^www\./, ""),
    description:
      "No rich embed provider matched this URL yet, so the card falls back to a polished link preview.",
    site: url.hostname.replace(/^www\./, ""),
    url: url.toString(),
    displayUrl: getDisplayUrl(url),
    renderer: {
      type: "link",
      href: url.toString(),
      ctaLabel: "Open link",
    },
  }
}

function createInvalidEmbed(input: string): ResolvedEmbed {
  return {
    provider: "invalid",
    providerLabel: "Invalid URL",
    accentColor: "#dc2626",
    title: "Paste a valid URL",
    description:
      "Embed Card accepts full links like YouTube videos, X posts, Reddit threads, Vimeo videos, and Google Maps.",
    site: "invalid-input",
    url: input,
    displayUrl: input,
    renderer: {
      type: "invalid",
      message: "Use a full URL such as https://www.youtube.com/watch?v=...",
    },
  }
}

function extractYouTubeId(url: URL): string | null {
  if (url.hostname === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] ?? null
  }

  const videoId = url.searchParams.get("v")

  if (videoId) {
    return videoId
  }

  const segments = url.pathname.split("/").filter(Boolean)

  if (segments[0] === "embed" || segments[0] === "shorts" || segments[0] === "live") {
    return segments[1] ?? null
  }

  return null
}

function extractStatusId(url: URL): string | null {
  const match = url.pathname.match(/\/status\/(\d+)/)

  return match?.[1] ?? null
}

function extractVimeoId(url: URL): string | null {
  const segments = url.pathname.split("/").filter(Boolean)
  const candidate = segments.find((segment) => /^\d+$/.test(segment))

  return candidate ?? null
}

const youtubeProvider: EmbedProvider = {
  id: "youtube",
  label: "YouTube",
  accentColor: "#ff0033",
  match: (url) =>
    ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(
      url.hostname
    ),
  resolve: (url, _context?: ResolveEmbedContext) => {
    const videoId = extractYouTubeId(url)

    if (!videoId) {
      return null
    }

    return createResolvedEmbed(url, youtubeProvider, {
      title: "YouTube video",
      description: "Playable YouTube embeds with lazy loading and no extra consumer setup.",
      renderer: {
        type: "iframe",
        src: `https://www.youtube.com/embed/${videoId}?rel=0`,
        title: "Embedded YouTube video",
        aspectRatio: "16 / 9",
        allow:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        allowFullScreen: true,
        referrerPolicy: "strict-origin-when-cross-origin",
      },
    })
  },
}

const twitterProvider: EmbedProvider = {
  id: "twitter",
  label: "X / Twitter",
  accentColor: "#111827",
  match: (url) => ["x.com", "twitter.com", "www.twitter.com"].includes(url.hostname),
  resolve: (url, context?: ResolveEmbedContext) => {
    const statusId = extractStatusId(url)

    if (!statusId) {
      return null
    }

    const tweetSrc = new URL("https://platform.twitter.com/embed/Tweet.html")
    tweetSrc.searchParams.set("id", statusId)
    tweetSrc.searchParams.set("dnt", "true")
    tweetSrc.searchParams.set("theme", context?.appearance === "dark" ? "dark" : "light")

    return createResolvedEmbed(url, twitterProvider, {
      title: "Social post",
      description:
        "Official tweet embeds rendered inside a responsive frame, ready for app and docs previews.",
      renderer: {
        type: "iframe",
        src: tweetSrc.toString(),
        title: "Embedded X post",
        aspectRatio: "1 / 1",
        minHeight: 480,
        referrerPolicy: "strict-origin-when-cross-origin",
      },
    })
  },
}

const redditProvider: EmbedProvider = {
  id: "reddit",
  label: "Reddit",
  accentColor: "#ff4500",
  match: (url) =>
    ["reddit.com", "www.reddit.com", "old.reddit.com"].includes(url.hostname),
  resolve: (url, _context?: ResolveEmbedContext) => {
    if (!url.pathname.includes("/comments/")) {
      return null
    }

    const postUrl = url.toString().replace(/\/$/, "")

    return createResolvedEmbed(url, redditProvider, {
      title: "Reddit thread",
      description:
        "Thread metadata loads in the browser from Reddit’s public JSON API and renders as a compact card.",
      renderer: {
        type: "reddit_client",
        postUrl,
      },
    })
  },
}

const googleMapsProvider: EmbedProvider = {
  id: "google-maps",
  label: "Google Maps",
  accentColor: "#0f9d58",
  match: (url) =>
    ["google.com", "www.google.com", "maps.google.com"].includes(url.hostname) &&
    url.pathname.startsWith("/maps"),
  resolve: (url, _context?: ResolveEmbedContext) => {
    const embedUrl = new URL(url.toString())
    embedUrl.searchParams.set("output", "embed")

    return createResolvedEmbed(url, googleMapsProvider, {
      title: "Google Maps location",
      description:
        "Map embeds work with the same `EmbedCard` API, so product pages and docs can use one shared component.",
      renderer: {
        type: "iframe",
        src: embedUrl.toString(),
        title: "Embedded Google Map",
        aspectRatio: "4 / 3",
        minHeight: 360,
        allowFullScreen: true,
        referrerPolicy: "no-referrer-when-downgrade",
      },
    })
  },
}

const vimeoProvider: EmbedProvider = {
  id: "vimeo",
  label: "Vimeo",
  accentColor: "#00adef",
  match: (url) => ["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname),
  resolve: (url, _context?: ResolveEmbedContext) => {
    const videoId = extractVimeoId(url)

    if (!videoId) {
      return null
    }

    return createResolvedEmbed(url, vimeoProvider, {
      title: "Vimeo video",
      description:
        "Vimeo support comes out of the box so creative teams can use one package everywhere.",
      renderer: {
        type: "iframe",
        src: `https://player.vimeo.com/video/${videoId}`,
        title: "Embedded Vimeo video",
        aspectRatio: "16 / 9",
        allow: "autoplay; fullscreen; picture-in-picture",
        allowFullScreen: true,
        referrerPolicy: "strict-origin-when-cross-origin",
      },
    })
  },
}

export const defaultProviders: readonly EmbedProvider[] = [
  youtubeProvider,
  twitterProvider,
  redditProvider,
  googleMapsProvider,
  vimeoProvider,
]

export function createEmbedProvider(provider: EmbedProvider): EmbedProvider {
  return provider
}

export { createFallbackEmbed, createInvalidEmbed }
