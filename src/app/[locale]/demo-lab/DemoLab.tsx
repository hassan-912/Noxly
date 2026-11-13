"use client";

import { Suspense, useState } from "react";
import type { Locale } from "@/content/types";
import { demoIds, demoRegistry } from "@/components/demos/registry";
import { LiveEmbed } from "@/components/work/LiveEmbed";

const widths = [360, 768, 1200] as const;

/**
 * Test bench for the coded demos (not a public page): every demo from the registry in a frame
 * whose width is switchable, standing in for the project viewer's phone / tablet / desktop
 * frames. Developer-facing, so its few labels are not localized.
 */
export function DemoLab({
  locale,
  live,
}: {
  locale: Locale;
  live: { url: string; poster: string | null; title: string; pitch: string };
}) {
  const [width, setWidth] = useState<(typeof widths)[number]>(1200);

  return (
    <div className="px-5 py-10">
      <div className="mx-auto max-w-[75rem]">
        <h1 className="text-2xl font-semibold">Demo lab</h1>
        <fieldset className="mt-4 flex items-center gap-4">
          <legend className="float-start me-4 font-mono text-sm text-ink-muted">Frame width</legend>
          {widths.map((w) => (
            <label key={w} className="flex cursor-pointer items-center gap-1.5 font-mono text-sm">
              <input type="radio" name="frame-width" checked={width === w} onChange={() => setWidth(w)} className="accent-indigo" />
              {w}
            </label>
          ))}
        </fieldset>
      </div>

      {demoIds.map((id) => (
        <section key={id} aria-labelledby={`lab-${id}`} className="mx-auto mt-10" style={{ inlineSize: width, maxInlineSize: "100%" }}>
          <h2 id={`lab-${id}`} className="font-mono text-sm text-ink-muted">
            {id}
          </h2>
          <div
            data-lab-frame
            className="mt-2 overflow-hidden rounded-2xl ring-1 ring-mist shadow-[0_24px_60px_-36px_rgb(14_26_36/0.35)]"
          >
            <Suspense fallback={<div className="min-h-64 bg-frost" />}>
              <Demo id={id} locale={locale} />
            </Suspense>
          </div>
        </section>
      ))}

      {/* LiveEmbed fixture (tests/e2e/viewer.spec.ts): the one embeddable live site. */}
      <section aria-labelledby="lab-live" className="mx-auto mt-10" style={{ inlineSize: width, maxInlineSize: "100%" }}>
        <h2 id="lab-live" className="font-mono text-sm text-ink-muted">
          live-embed
        </h2>
        <LiveEmbed {...live} locale={locale} className="mt-2" />
      </section>
    </div>
  );
}

function Demo({ id, locale }: { id: (typeof demoIds)[number]; locale: Locale }) {
  const Component = demoRegistry[id];
  return <Component locale={locale} />;
}
