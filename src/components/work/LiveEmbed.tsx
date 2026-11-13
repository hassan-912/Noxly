"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import type { Locale } from "@/content/types";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/i18n";

/** If the live site isn't showing this long after the click, fall back to the poster. */
const LOAD_TIMEOUT_MS = 8000;

type State = "idle" | "loading" | "live" | "failed";

/**
 * A live site, loaded only after a click. Until then (and whenever loading fails) it shows the
 * captured poster or, when there is none, a designed card with the project's name and pitch —
 * never a blank frame. The external link is always there.
 *
 * After the click the iframe is mounted and, in parallel, the site is probed with a `no-cors`
 * request: an iframe's `load` event also fires for a browser error page, so the probe is what
 * tells "reachable" from "down". If the probe fails, or the frame hasn't loaded within about
 * 8 seconds, the iframe is removed and the poster returns with a short explanation.
 *
 * It fills the width of its container, so a device frame around it changes the iframe's width.
 *
 * Focus: the button goes away once loading starts, so focus moves to the embed itself (which
 * announces the loading or fallback message) and on to the iframe once the site is showing.
 * The hidden, still-loading iframe is not a tab stop.
 */
export function LiveEmbed({
  url,
  poster,
  title,
  pitch,
  locale,
  className,
}: {
  url: string;
  /** Path of the captured screenshot, or null when there is none. */
  poster: string | null;
  /** The project's name. */
  title: string;
  /** Shown on the fallback card. */
  pitch?: string;
  locale: Locale;
  className?: string;
}) {
  const t = getDictionary(locale).viewer;
  const [state, setState] = useState<State>("idle");
  const [posterBroken, setPosterBroken] = useState(false);
  const progress = useRef({ probed: false, framed: false });
  const figure = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  const load = () => {
    setState("loading");
    // The button is about to unmount: keep focus inside the embed instead of dropping to <body>.
    figure.current?.focus({ preventScroll: true });
  };

  // Once the site shows, hand focus to it, unless the visitor has moved on meanwhile.
  useEffect(() => {
    if (state === "live" && figure.current?.contains(document.activeElement)) {
      frame.current?.focus({ preventScroll: true });
    }
  }, [state]);

  useEffect(() => {
    if (state !== "loading") return;
    progress.current = { probed: false, framed: false };
    const abort = new AbortController();
    const timer = window.setTimeout(() => setState("failed"), LOAD_TIMEOUT_MS);

    fetch(url, { mode: "no-cors", credentials: "omit", referrerPolicy: "no-referrer", signal: abort.signal })
      .then(() => {
        progress.current.probed = true;
        if (progress.current.framed) setState("live");
      })
      .catch(() => {
        if (!abort.signal.aborted) setState("failed");
      });

    return () => {
      window.clearTimeout(timer);
      abort.abort();
    };
  }, [state, url]);

  const onFrameLoad = () => {
    progress.current.framed = true;
    if (progress.current.probed) setState((current) => (current === "loading" ? "live" : current));
  };

  const host = new URL(url).host;
  const showFrame = state === "loading" || state === "live";
  const showPoster = state !== "live";

  return (
    <figure
      ref={figure}
      tabIndex={-1}
      aria-label={t.liveTitle.replace("{name}", title)}
      data-live-embed=""
      data-state={state}
      className={cn("live-embed", className)}
    >
      <div className="live-embed__screen">
        {showPoster &&
          (poster && !posterBroken ? (
            // A static export serves images as they are; next/image would add nothing here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              data-live-poster="image"
              src={poster}
              alt={t.livePoster.replace("{name}", title)}
              width={1440}
              height={900}
              loading="lazy"
              decoding="async"
              onError={() => setPosterBroken(true)}
              className="absolute inset-0 size-full object-cover object-top"
            />
          ) : (
            <div data-live-poster="card" className="live-embed__card">
              <p className="text-2xl leading-tight font-semibold tracking-tight text-balance text-ink @md:text-3xl">
                {title}
              </p>
              {pitch && <p className="mt-2 max-w-md text-base text-pretty text-ink-muted">{pitch}</p>}
            </div>
          ))}

        {showFrame && (
          <iframe
            ref={frame}
            src={url}
            tabIndex={state === "live" ? 0 : -1}
            title={t.liveTitle.replace("{name}", title)}
            onLoad={onFrameLoad}
            referrerPolicy="no-referrer"
            // The site's own features must work inside the frame: downloads (QR assets), links
            // that open new tabs as normal pages, and copy to clipboard.
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
            allow="clipboard-write"
            className={cn(
              "absolute inset-0 size-full border-0 bg-surface transition-opacity duration-500",
              state === "live" ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          />
        )}

        {state !== "live" && (
          <div className="live-embed__overlay">
            {state === "idle" && (
              <button
                type="button"
                onClick={load}
                className="hero-cta inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full bg-indigo py-3 ps-5 pe-6 text-base font-medium text-surface transition-colors duration-200 hover:bg-ink"
              >
                <Play aria-hidden="true" className="size-4 shrink-0 fill-current rtl:-scale-x-100" />
                {t.loadLive}
              </button>
            )}
            <p role="status" className="live-embed__note empty:hidden">
              {state === "loading" ? t.liveLoading : state === "failed" ? t.liveFallback : null}
            </p>
          </div>
        )}
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-mist bg-surface px-4 py-2.5">
        <bdi dir="ltr" className="min-w-0 truncate font-mono text-xs text-ink-muted">
          {host}
        </bdi>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-8 items-center gap-1.5 rounded-sm text-sm font-medium text-ink transition-colors duration-200 hover:text-indigo focus-visible:text-indigo"
        >
          {t.visitSite}
          <span className="sr-only"> {t.opensNewTab}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 text-ink-muted transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
          />
        </a>
      </figcaption>
    </figure>
  );
}
