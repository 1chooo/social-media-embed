"use client"

import type { CSSProperties } from "react"
import { useEffect, useId, useState } from "react"

import {
  decodeRedditHtmlEntities,
  fetchRedditPost,
  formatRedditScore,
  redditTimeAgo,
  type RedditPostData,
} from "./reddit-data"

const cardShell: CSSProperties = {
  fontFamily: "var(--embed-card-font-family, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif)",
  background: "var(--embed-card-preview-canvas)",
  color: "var(--embed-card-text)",
  minHeight: "280px",
  display: "flex",
  flexDirection: "column",
}

const linkBase: CSSProperties = {
  color: "#ff4500",
  textDecoration: "none",
}

export interface RedditCopyLinkButtonProps {
  href: string
}

export function RedditCopyLinkButton({ href }: RedditCopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    void navigator.clipboard.writeText(href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        border: "none",
        background: "none",
        padding: 0,
        cursor: "pointer",
        fontSize: "0.75rem",
        color: "#787c7e",
      }}
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  )
}

function RedditMark({ idPrefix }: { idPrefix: string }) {
  const rg = `${idPrefix}-rg`
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 216 216"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <radialGradient id={rg} cx="109.61" cy="85.59" r="80" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#feffff" />
            <stop offset="1" stopColor="#e8ecef" />
          </radialGradient>
        </defs>
        <path
          d="M108 0C48.35 0 0 48.35 0 108c0 29.82 12.09 56.82 31.63 76.37l-20.57 20.57C6.98 209.02 9.87 216 15.64 216H108c59.65 0 108-48.35 108-108S167.65 0 108 0Z"
          fill="#ff4500"
        />
        <circle cx="169.22" cy="106.98" r="22" fill={`url(#${rg})`} />
        <circle cx="46.78" cy="106.98" r="22" fill={`url(#${rg})`} />
        <ellipse cx="108.06" cy="128.64" rx="68" ry="50" fill={`url(#${rg})`} />
        <path
          d="M108.06 142.92c-8.76 0-17.16.43-24.92 1.22-1.33.13-2.17 1.51-1.65 2.74 4.35 10.39 14.61 17.69 26.57 17.69s22.23-7.3 26.57-17.69c.52-1.23-.33-2.61-1.65-2.74-7.77-.79-16.16-1.22-24.92-1.22Z"
          fill="#0e1c21"
        />
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
    </span>
  )
}

function IconUpvote() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4l8 8h-5v10H9V12H4l8-8z"
        fill="currentColor"
        fillOpacity="0.75"
      />
    </svg>
  )
}

function IconComment() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 5h16v12H7l-3 3V5z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}

function RedditCardLoaded({
  post,
  className,
  style,
}: {
  post: RedditPostData
  className?: string
  style?: CSSProperties
}) {
  const reactId = useId()
  const idPrefix = reactId.replace(/:/g, "")

  const postHref = `https://www.reddit.com${post.permalink}`
  const videoUrl = post.is_video
    ? decodeRedditHtmlEntities(post.media?.reddit_video?.fallback_url ?? "") || null
    : null
  const posterUrl = post.preview?.images?.[0]?.source?.url
    ? decodeRedditHtmlEntities(post.preview.images[0].source.url)
    : undefined
  const previewUrl = !post.is_video && posterUrl ? posterUrl : null

  const body =
    post.is_self && post.selftext
      ? post.selftext.length > 280
        ? `${post.selftext.slice(0, 280).trimEnd()}…`
        : post.selftext
      : null

  const borderSoft = "color-mix(in srgb, var(--embed-card-border) 70%, transparent)"

  return (
    <div className={className} style={{ ...cardShell, ...style }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem 1.25rem",
          borderBottom: `1px solid ${borderSoft}`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
            minWidth: 0,
            flex: "1 1 0%",
          }}
        >
          <a
            href={`https://www.reddit.com/r/${post.subreddit}`}
            target="_blank"
            rel="noreferrer"
            style={{ ...linkBase, fontSize: "0.75rem", fontWeight: 700 }}
          >
            r/{post.subreddit}
          </a>
          <span style={{ fontSize: "0.7rem", color: "var(--embed-card-muted)" }}>
            Posted by u/{post.author} · {redditTimeAgo(post.created_utc)}
          </span>
        </div>
        <a
          href={postHref}
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--embed-card-muted)", flexShrink: 0 }}
          aria-label="View on Reddit"
        >
          <RedditMark idPrefix={idPrefix} />
        </a>
      </div>

      <div style={{ padding: "1rem 1.25rem 0.75rem", flex: 1, minWidth: 0 }}>
        <a
          href={postHref}
          target="_blank"
          rel="noreferrer"
          style={{
            ...linkBase,
            display: "block",
            fontWeight: 600,
            fontSize: "0.95rem",
            lineHeight: 1.35,
            overflowWrap: "anywhere",
          }}
        >
          {post.title}
        </a>
        {body ? (
          <p
            style={{
              margin: "0.6rem 0 0",
              fontSize: "0.8rem",
              lineHeight: 1.55,
              color: "var(--embed-card-muted)",
              whiteSpace: "pre-line",
            }}
          >
            {body}
          </p>
        ) : null}
      </div>

      {videoUrl ? (
        <div style={{ borderTop: `1px solid ${borderSoft}`, borderBottom: `1px solid ${borderSoft}`, background: "color-mix(in srgb, var(--embed-card-border) 25%, var(--embed-card-preview-canvas))" }}>
          <video
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            muted
            loop
            playsInline
            controls
            style={{ width: "100%", maxHeight: "320px", display: "block", objectFit: "contain" }}
          />
        </div>
      ) : null}
      {previewUrl && !videoUrl ? (
        <div style={{ borderTop: `1px solid ${borderSoft}`, borderBottom: `1px solid ${borderSoft}`, overflow: "hidden" }}>
          <img
            src={previewUrl}
            alt=""
            style={{ width: "100%", maxHeight: "280px", objectFit: "cover", display: "block" }}
          />
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          padding: "0.75rem 1.25rem 1rem",
          marginTop: "auto",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", color: "var(--embed-card-muted)", fontSize: "0.75rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
            <IconUpvote />
            {formatRedditScore(post.score)}
          </span>
          <a href={postHref} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "inherit" }}>
            <IconComment />
            {post.num_comments.toLocaleString()} comments
          </a>
          <RedditCopyLinkButton href={postHref} />
        </div>
        <a href={postHref} target="_blank" rel="noreferrer" style={{ ...linkBase, fontSize: "0.75rem", textDecoration: "underline" }}>
          View on Reddit
        </a>
      </div>
    </div>
  )
}

export interface RedditEmbedPreviewProps {
  postUrl: string
  className?: string
  style?: CSSProperties
}

export function RedditEmbedPreview({ postUrl, className, style }: RedditEmbedPreviewProps) {
  const [state, setState] = useState<"loading" | "error" | RedditPostData>("loading")

  useEffect(() => {
    const ac = new AbortController()
    void fetchRedditPost(postUrl, { signal: ac.signal }).then((post) => {
      if (ac.signal.aborted) {
        return
      }
      setState(post ?? "error")
    })
    return () => ac.abort()
  }, [postUrl])

  if (state === "loading") {
    return (
      <div
        className={className}
        style={{
          ...cardShell,
          ...style,
          padding: "1.5rem",
          gap: "0.75rem",
          animation: "embed-card-pulse 1.4s ease-in-out infinite",
        }}
      >
        <div
          style={{
            height: "10px",
            width: "33%",
            borderRadius: "6px",
            background: "color-mix(in srgb, var(--embed-card-border) 55%, transparent)",
          }}
        />
        <div
          style={{
            height: "14px",
            width: "75%",
            borderRadius: "6px",
            background: "color-mix(in srgb, var(--embed-card-border) 45%, transparent)",
          }}
        />
        <div
          style={{
            height: "14px",
            width: "50%",
            borderRadius: "6px",
            background: "color-mix(in srgb, var(--embed-card-border) 35%, transparent)",
          }}
        />
        <style>{"@keyframes embed-card-pulse{0%,100%{opacity:1}50%{opacity:.55}}"}</style>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div
        className={className}
        style={{
          ...cardShell,
          ...style,
          placeContent: "center",
          padding: "2rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "var(--embed-card-muted)",
        }}
      >
        Post unavailable.
      </div>
    )
  }

  return <RedditCardLoaded post={state} className={className} style={style} />
}
