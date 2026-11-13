"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's atmosphere: a few soft pastel gradient layers that drift slowly (CSS, transform
 * only; see `.hero-aurora` in globals.css). The drift pauses while the hero is off-screen and
 * does not exist under reduced motion. Purely decorative.
 */
export function Aurora() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" data-aurora data-paused={paused ? "true" : "false"} className="hero-aurora">
      <span className="hero-aurora__layer hero-aurora__layer--lavender" />
      <span className="hero-aurora__layer hero-aurora__layer--sky" />
      <span className="hero-aurora__layer hero-aurora__layer--peach" />
      <span className="hero-aurora__layer hero-aurora__layer--mint" />
    </div>
  );
}
