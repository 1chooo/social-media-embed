import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX()

const nextConfig: NextConfig = {
  basePath: "/embed-card",
  transpilePackages: ["embed-card"],
  redirects: async () => [
    {
      source: "/npm",
      destination: "https://www.npmjs.com/package/embed-card",
      permanent: true,
    },
  ],
}

export default withMDX(nextConfig)
