import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"

import {
  CustomRenderingEmbedCardCompare,
  CustomRenderingRedditPreviewCompare,
} from "@/components/custom-rendering-demos"
import { ThemedEmbedCard } from "embed-card/next-themes"

export function getMDXComponents(
  components?: MDXComponents
): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    EmbedCard: ThemedEmbedCard,
    CustomRenderingEmbedCardCompare,
    CustomRenderingRedditPreviewCompare,
  }
}

export function useMDXComponents(
  components?: MDXComponents
): MDXComponents {
  return getMDXComponents(components)
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}