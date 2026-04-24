import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.d.ts",
        "src/embed-card.tsx",
        "src/reddit-embed.tsx",
        "src/reddit-shadow-dom.ts",
        "src/tiktok-embed.tsx",
        "src/next-themes.tsx",
        "src/web-component.ts",
      ],
    },
  },
})
