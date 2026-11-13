"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether a media query matches. False on the server and during hydration, so the static HTML
 * is always the narrow (phone) state and widens after mount.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
