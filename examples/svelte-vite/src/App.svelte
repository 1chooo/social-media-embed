<script lang="ts">
  import { registerEmbedCard } from "embed-card/web-component"

  registerEmbedCard()
</script>

<main class="demo">
  <p class="eyebrow">embed-card · Vite + Svelte</p>
  <h1>Turn a URL into a rich embed card</h1>
  <p class="lede">
    Svelte uses the custom element from <code>embed-card/web-component</code>.
    Call <code>registerEmbedCard()</code> once, then use
    <code>&lt;embed-card&gt;</code> in your markup.
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

<style>
  :global(*),
  :global(*::before),
  :global(*::after) {
    box-sizing: border-box;
  }

  :global(html) {
    font-family:
      ui-sans-serif,
      system-ui,
      -apple-system,
      Segoe UI,
      Roboto,
      Helvetica,
      Arial,
      sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  :global(body) {
    margin: 0;
    min-height: 100vh;
    color: #0f172a;
    background: linear-gradient(165deg, #fafafa 0%, #f1f5f9 100%);
  }

  .demo {
    margin: 0 auto;
    max-width: 42rem;
    padding: 2.5rem 1.5rem 4rem;
  }

  .eyebrow {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #64748b;
  }

  .demo h1 {
    margin: 0.75rem 0 0;
    font-size: 1.75rem;
    font-weight: 600;
    letter-spacing: -0.03em;
  }

  .lede {
    margin: 0.75rem 0 1.75rem;
    color: #475569;
  }
</style>
