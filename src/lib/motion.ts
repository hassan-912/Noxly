"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * True when motion is allowed. False on the server, during hydration, and under
 * `prefers-reduced-motion: reduce`, so the static HTML is always the final, still state.
 */
export function useMotionOK(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

const LATIN_LOWER = "abcdefghijklmnopqrstuvwxyz";
const LATIN_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const ARABIC = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";

/** Glyphs to scramble `char` with: same script and case, so the word keeps its texture. */
function poolFor(char: string): string | null {
  if (/[؀-ۿ]/.test(char)) return ARABIC;
  if (/\p{Nd}/u.test(char)) return DIGITS;
  if (/\p{Lu}/u.test(char)) return LATIN_UPPER;
  if (/\p{L}/u.test(char)) return LATIN_LOWER;
  return null; // spaces and punctuation stay put
}

/**
 * One frame of the scramble. Characters before `progress` (0..1, in logical order, so it also
 * reads correctly in RTL) show the target; the rest are random glyphs. Whitespace and
 * punctuation never change, and the length is constant. Pure: pass the rng.
 */
export function scrambleFrame(target: string, progress: number, rng: () => number): string {
  const chars = Array.from(target);
  const revealed = Math.ceil(Math.min(Math.max(progress, 0), 1) * chars.length);
  return chars
    .map((char, i) => {
      if (i < revealed) return char;
      const pool = poolFor(char);
      if (!pool) return char;
      return pool[Math.min(Math.floor(rng() * pool.length), pool.length - 1)];
    })
    .join("");
}
