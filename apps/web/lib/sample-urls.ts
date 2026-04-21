export const sampleEmbeds = [
  {
    label: "YouTube",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    label: "X",
    url: "https://x.com/1chooo___/status/2028573993972969585",
  },
  {
    label: "Reddit",
    url: "https://www.reddit.com/r/github/comments/1j6jga7/i_rebuilt_my_personal_portfolio_using_nextjsits/",
  },
  {
    label: "Google Maps",
    url: "https://www.google.com/maps?q=Tokyo+Station&output=embed",
  },
  {
    label: "Vimeo",
    url: "https://vimeo.com/76979871",
  },
] as const

export const demoThemes = [
  {
    id: "editorial",
    label: "Editorial",
    theme: {
      accentColor: "#e11d48",
      background: "rgba(255,255,255,0.97)",
      borderColor: "rgba(225,29,72,0.18)",
      mutedColor: "rgba(17,24,39,0.62)",
      radius: 28,
      shadow: "none",
    },
  },
  {
    id: "cobalt",
    label: "Cobalt",
    theme: {
      accentColor: "#1d4ed8",
      background: "rgba(239,246,255,0.97)",
      borderColor: "rgba(29,78,216,0.18)",
      mutedColor: "rgba(30,41,59,0.7)",
      radius: 24,
      shadow: "none",
    },
  },
  {
    id: "mint",
    label: "Mint",
    theme: {
      accentColor: "#047857",
      background: "rgba(236,253,245,0.98)",
      borderColor: "rgba(4,120,87,0.18)",
      mutedColor: "rgba(6,78,59,0.68)",
      radius: 30,
      shadow: "none",
    },
  },
] as const
