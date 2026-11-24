"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Item = { id: string; title: string };

/** "In this note" list. Marks the section being read; works as plain anchor links without JS. */
export function TableOfContents({ label, items }: { label: string; items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const update = () => {
      // The last heading that has scrolled past the top quarter of the viewport.
      const line = window.innerHeight * 0.25;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id;
      }
      // At the very bottom, the last section is the one being read even if its heading is low.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = headings.at(-1)!.id;
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav aria-labelledby="toc-label" data-toc>
      <p id="toc-label" className="text-sm font-semibold text-ink">{label}</p>
      <ol className="mt-4 border-s border-mist">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "-ms-px block border-s-2 py-1.5 ps-4 text-sm leading-snug transition-colors",
                active === item.id ? "border-indigo text-ink" : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
