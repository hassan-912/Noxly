"use client";

import { useCallback, useState, type SyntheticEvent } from "react";

/**
 * Tracks whether an `<img>` failed to load (404, aborted, not an image), so the caller can show
 * something else instead of a broken image. Spread `imgProps` on the image.
 *
 * An image in the server HTML can fail before React hydrates, and then no `onError` reaches
 * React; the ref checks for that case once the element is attached. The result is tied to
 * `src`: a new `src` gets a fresh attempt.
 */
export function useImageFailed(src: string | null | undefined) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const ref = useCallback((img: HTMLImageElement | null) => {
    // `currentSrc` is empty while a lazy image hasn't started loading, so that isn't a failure.
    if (img && img.complete && img.naturalWidth === 0 && img.currentSrc) setFailedSrc(img.getAttribute("src"));
  }, []);

  const onError = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    setFailedSrc(event.currentTarget.getAttribute("src"));
  }, []);

  return { failed: !!src && failedSrc === src, imgProps: { ref, onError } };
}
