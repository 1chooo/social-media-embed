import {
  decodeRedditHtmlEntities,
  formatRedditScore,
  redditTimeAgo,
  type RedditPostData,
} from "./reddit-data"

const borderSoft = "color-mix(in srgb, var(--embed-card-border) 70%, transparent)"

function el<K extends keyof HTMLElementTagNameMap>(
  doc: Document,
  tag: K,
  style?: string,
  className?: string
): HTMLElementTagNameMap[K] {
  const node = doc.createElement(tag)
  if (style) {
    node.setAttribute("style", style)
  }
  if (className) {
    node.className = className
  }
  return node
}

function text(doc: Document, content: string): Text {
  return doc.createTextNode(content)
}

function appendRedditMark(doc: Document, gid: string): HTMLElement {
  const wrap = el(doc, "span", "display:inline-flex;align-items:center;gap:6px")
  const rg = `${gid}-rg`
  wrap.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 216 216" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="${rg}" cx="109.61" cy="85.59" r="80" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#feffff" />
          <stop offset="1" stop-color="#e8ecef" />
        </radialGradient>
      </defs>
      <path d="M108 0C48.35 0 0 48.35 0 108c0 29.82 12.09 56.82 31.63 76.37l-20.57 20.57C6.98 209.02 9.87 216 15.64 216H108c59.65 0 108-48.35 108-108S167.65 0 108 0Z" fill="#ff4500" />
      <circle cx="169.22" cy="106.98" r="22" fill="url(#${rg})" />
      <circle cx="46.78" cy="106.98" r="22" fill="url(#${rg})" />
      <ellipse cx="108.06" cy="128.64" rx="68" ry="50" fill="url(#${rg})" />
      <path d="M108.06 142.92c-8.76 0-17.16.43-24.92 1.22-1.33.13-2.17 1.51-1.65 2.74 4.35 10.39 14.61 17.69 26.57 17.69s22.23-7.3 26.57-17.69c.52-1.23-.33-2.61-1.65-2.74-7.77-.79-16.16-1.22-24.92-1.22Z" fill="#0e1c21" />
    </svg>
    <svg height="14" viewBox="0 0 514 149" xmlns="http://www.w3.org/2000/svg" aria-label="Reddit">
      <g fill="#FF4500">
        <path d="m71.62,45.92l-12.01,28.56c-1.51-.76-5.11-1.61-8.51-1.61s-6.81.85-10.12,2.46c-6.53,3.31-11.35,9.93-11.35,19.48v52.3H-.26V45.35h29.04v14.28h.57c6.81-9.08,17.21-15.79,30.74-15.79,4.92,0,9.65.95,11.54,2.08Z" />
        <path d="m65.84,96.52c0-29.41,20.15-52.68,50.32-52.68,27.33,0,46.91,19.96,46.91,48.05,0,4.92-.47,9.55-1.51,14h-68.48c3.12,10.69,12.39,19.01,26.29,19.01,7.66,0,18.54-2.74,24.4-7.28l9.27,22.32c-8.61,5.86-21.75,8.7-33.29,8.7-32.25,0-53.91-20.81-53.91-52.11Zm26.67-9.36h43.03c0-13.05-8.89-19.96-19.77-19.96-12.3,0-20.62,7.94-23.27,19.96Z" />
        <path d="m419.53-.37c10.03,0,18.25,8.23,18.25,18.25s-8.23,18.25-18.25,18.25-18.25-8.23-18.25-18.25S409.51-.37,419.53-.37Zm14.94,147.49h-29.89V45.35h29.89v101.77Z" />
        <path d="m246,1.47l-.09,53.53h-.57c-8.23-7.85-17.12-11.07-28.75-11.07-28.66,0-47.67,23.08-47.67,52.3s17.78,52.4,46.72,52.4c12.11,0,23.55-4.16,30.93-13.62h.85v12.11h28.47V1.47h-29.89Zm1.42,121.39h-.99l-6.67-6.93c-4.34,4.33-10.28,6.93-17.22,6.93-14.64,0-24.88-11.58-24.88-26.6s10.24-26.6,24.88-26.6,24.88,11.58,24.88,26.6v26.6Z" />
        <path d="m360.15,1.47l-.09,53.53h-.57c-8.23-7.85-17.12-11.07-28.75-11.07-28.66,0-47.67,23.08-47.67,52.3s17.78,52.4,46.72,52.4c12.11,0,23.55-4.16,30.93-13.62h.85v12.11h28.47V1.47h-29.89Zm1.28,121.39h-.99l-6.67-6.93c-4.34,4.33-10.28,6.93-17.22,6.93-14.64,0-24.88-11.58-24.88-26.6s10.24-26.6,24.88-26.6,24.88,11.58,24.88,26.6v26.6Z" />
        <path d="m492.44,45.35h21.85v25.44h-21.85v76.33h-29.89v-76.33h-21.75v-25.44h21.75v-27.66h29.89v27.66Z" />
      </g>
    </svg>
  `
  return wrap
}

/** Build the Reddit card DOM for use inside a shadow root (web component). */
export function buildRedditCardElement(doc: Document, post: RedditPostData): HTMLElement {
  const gid = `r-${Math.random().toString(36).slice(2, 9)}`
  const postHref = `https://www.reddit.com${post.permalink}`

  const videoUrl = post.is_video
    ? decodeRedditHtmlEntities(post.media?.reddit_video?.fallback_url ?? "") || null
    : null
  const posterUrl = post.preview?.images?.[0]?.source?.url
    ? decodeRedditHtmlEntities(post.preview.images[0].source.url)
    : undefined
  const previewUrl =
    !post.is_video && posterUrl && posterUrl.startsWith("https://") ? posterUrl : null

  const body =
    post.is_self && post.selftext
      ? post.selftext.length > 280
        ? `${post.selftext.slice(0, 280).trimEnd()}…`
        : post.selftext
      : null

  const root = el(
    doc,
    "div",
    "font-family:var(--embed-card-font-family,system-ui,-apple-system,Segoe UI,Roboto,sans-serif);background:var(--embed-card-preview-canvas);color:var(--embed-card-text);min-height:280px;display:flex;flex-direction:column"
  )

  const header = el(
    doc,
    "div",
    `display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:1rem 1.25rem;border-bottom:1px solid ${borderSoft}`
  )
  const meta = el(doc, "div", "display:flex;flex-direction:column;gap:0.2rem;min-width:0")
  const subLink = el(doc, "a", "font-size:0.75rem;font-weight:700;color:#ff4500;text-decoration:none")
  subLink.href = `https://www.reddit.com/r/${post.subreddit}`
  subLink.target = "_blank"
  subLink.rel = "noreferrer"
  subLink.appendChild(text(doc, `r/${post.subreddit}`))
  const byline = el(doc, "span", "font-size:0.7rem;color:var(--embed-card-muted)")
  byline.appendChild(
    text(doc, `Posted by u/${post.author} · ${redditTimeAgo(post.created_utc)}`)
  )
  meta.appendChild(subLink)
  meta.appendChild(byline)

  const logoLink = el(doc, "a", "color:var(--embed-card-muted);flex-shrink:0")
  logoLink.href = postHref
  logoLink.target = "_blank"
  logoLink.rel = "noreferrer"
  logoLink.setAttribute("aria-label", "View on Reddit")
  logoLink.appendChild(appendRedditMark(doc, gid))

  header.appendChild(meta)
  header.appendChild(logoLink)
  root.appendChild(header)

  const titleBlock = el(doc, "div", "padding:1rem 1.25rem 0.75rem;flex:1;min-width:0")
  const titleA = el(
    doc,
    "a",
    "color:#ff4500;font-weight:600;font-size:0.95rem;line-height:1.35;text-decoration:none"
  )
  titleA.href = postHref
  titleA.target = "_blank"
  titleA.rel = "noreferrer"
  titleA.appendChild(text(doc, post.title))
  titleBlock.appendChild(titleA)

  if (body) {
    const p = el(
      doc,
      "p",
      "margin:0.6rem 0 0;font-size:0.8rem;line-height:1.55;color:var(--embed-card-muted);white-space:pre-line"
    )
    p.appendChild(text(doc, body))
    titleBlock.appendChild(p)
  }
  root.appendChild(titleBlock)

  if (videoUrl && videoUrl.startsWith("https://")) {
    const media = el(
      doc,
      "div",
      `border-top:1px solid ${borderSoft};border-bottom:1px solid ${borderSoft};background:color-mix(in srgb, var(--embed-card-border) 25%, var(--embed-card-preview-canvas))`
    )
    const video = doc.createElement("video")
    video.src = videoUrl
    if (posterUrl && posterUrl.startsWith("https://")) {
      video.poster = posterUrl
    }
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.controls = true
    video.setAttribute("autoplay", "")
    video.setAttribute(
      "style",
      "width:100%;max-height:320px;display:block;object-fit:contain"
    )
    media.appendChild(video)
    root.appendChild(media)
  } else if (previewUrl) {
    const media = el(
      doc,
      "div",
      `border-top:1px solid ${borderSoft};border-bottom:1px solid ${borderSoft};overflow:hidden`
    )
    const img = doc.createElement("img")
    img.src = previewUrl
    img.alt = ""
    img.setAttribute("style", "width:100%;max-height:280px;object-fit:cover;display:block")
    media.appendChild(img)
    root.appendChild(media)
  }

  const footer = el(
    doc,
    "div",
    "display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.75rem;padding:0.75rem 1.25rem 1rem;margin-top:auto"
  )
  const left = el(
    doc,
    "div",
    "display:flex;flex-wrap:wrap;align-items:center;gap:1rem;color:var(--embed-card-muted);font-size:0.75rem"
  )
  const score = el(doc, "span", "display:inline-flex;align-items:center;gap:0.25rem")
  score.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l8 8h-5v10H9V12H4l8-8z" fill="currentColor" fill-opacity="0.75"/></svg>'
  score.appendChild(text(doc, formatRedditScore(post.score)))

  const comments = el(
    doc,
    "a",
    "display:inline-flex;align-items:center;gap:0.25rem;color:inherit;text-decoration:none"
  )
  comments.href = postHref
  comments.target = "_blank"
  comments.rel = "noreferrer"
  comments.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v12H7l-3 3V5z" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
  comments.appendChild(text(doc, `${post.num_comments.toLocaleString()} comments`))

  const copyBtn = el(
    doc,
    "button",
    "display:inline-flex;align-items:center;gap:0.25rem;border:none;background:none;padding:0;cursor:pointer;font-size:0.75rem;color:var(--embed-card-muted)"
  )
  copyBtn.type = "button"
  copyBtn.appendChild(text(doc, "Copy link"))
  copyBtn.addEventListener("click", () => {
    void navigator.clipboard.writeText(postHref).then(() => {
      copyBtn.textContent = "Copied!"
      setTimeout(() => {
        copyBtn.textContent = "Copy link"
      }, 2000)
    })
  })

  left.appendChild(score)
  left.appendChild(comments)
  left.appendChild(copyBtn)

  const view = el(
    doc,
    "a",
    "color:#ff4500;font-size:0.75rem;text-decoration:underline"
  )
  view.href = postHref
  view.target = "_blank"
  view.rel = "noreferrer"
  view.appendChild(text(doc, "View on Reddit"))

  footer.appendChild(left)
  footer.appendChild(view)
  root.appendChild(footer)

  return root
}
