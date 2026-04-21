import { registerEmbedCard } from "embed-card/web-component"

import "./styles.css"

registerEmbedCard()

const app = document.querySelector<HTMLDivElement>("#app")
if (!app) {
  throw new Error("Missing #app root")
}

app.innerHTML = `
  <main class="demo">
    <p class="eyebrow">embed-card · Vite + Vanilla</p>
    <h1>Turn a URL into a rich embed card</h1>
    <p class="lede">
      Any framework can use the custom element from
      <code>embed-card/web-component</code>. Call
      <code>registerEmbedCard()</code> once, then add
      <code>&lt;embed-card&gt;</code> to the DOM.
    </p>
    <embed-card
      url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      accent-color="#e11d48"
      background="rgba(255,255,255,0.97)"
      border-color="rgba(225,29,72,0.18)"
      muted-color="rgba(17,24,39,0.62)"
      radius="28px"
      shadow="0 28px 100px rgba(225,29,72,0.14)"
    ></embed-card>
  </main>
`
