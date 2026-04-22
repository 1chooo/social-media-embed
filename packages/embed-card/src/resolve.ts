import { createFallbackEmbed, createInvalidEmbed, defaultProviders } from "./providers"
import type { ResolvedEmbed, ResolveEmbedOptions } from "./types"

function parseUrl(input: string): URL | null {
  try {
    return new URL(input)
  } catch {
    if (/^[\w.-]+\.[a-z]{2,}/i.test(input) && !/\s/.test(input)) {
      try {
        return new URL(`https://${input}`)
      } catch {
        return null
      }
    }

    return null
  }
}

export function resolveEmbed(
  input: string,
  options: ResolveEmbedOptions = {}
): ResolvedEmbed {
  const url = parseUrl(input.trim())

  if (!url) {
    return createInvalidEmbed(input)
  }

  const providers = options.providers ?? defaultProviders

  for (const provider of providers) {
    if (!provider.match(url)) {
      continue
    }

    const resolved = provider.resolve(url, {
      appearance: options.appearance,
    })

    if (resolved) {
      return resolved
    }
  }

  if (options.includeFallback === false) {
    return createInvalidEmbed(input)
  }

  return createFallbackEmbed(url)
}
