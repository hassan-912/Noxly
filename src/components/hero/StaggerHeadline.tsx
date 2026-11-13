import { Fragment, type CSSProperties } from "react";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { cn } from "@/lib/cn";
import { splitHeadline } from "./headline";

/** Each word fades and rises for this long (keep in sync with `.hero-word` in globals.css). */
const WORD_MS = 520;
/** The whole reveal, first word to last, finishes within this. */
const TOTAL_MS = 960;
const MAX_STEP_MS = 85;
const SCRAMBLE_MS = 600;

/**
 * The hero h1. The full text is in the static HTML; the word-by-word reveal is CSS only
 * (opacity and translate), so it needs no JavaScript and is skipped under reduced motion.
 * `scrambleWord` is the one fragment that scrambles once as its word arrives.
 */
export function StaggerHeadline({
  id,
  text,
  scrambleWord,
  className,
}: {
  id?: string;
  text: string;
  scrambleWord: string;
  className?: string;
}) {
  const words = splitHeadline(text, scrambleWord);
  const step = words.length > 1 ? Math.min(MAX_STEP_MS, (TOTAL_MS - WORD_MS) / (words.length - 1)) : 0;

  return (
    // aria-label keeps the accessible name stable while the fragment scrambles.
    <h1 id={id} aria-label={text} className={cn("hero-headline", className)}>
      {words.map((parts, i) => {
        const delay = Math.round(i * step);
        return (
          <Fragment key={i}>
            {i > 0 && " "}
            <span data-word className="hero-word" style={{ "--word-delay": `${delay}ms` } as CSSProperties}>
              {parts.map((part, j) =>
                part.scramble ? (
                  <ScrambleText
                    key={j}
                    text={part.text}
                    once
                    durationMs={SCRAMBLE_MS}
                    delayMs={delay + 260}
                    className="hero-scramble"
                  />
                ) : (
                  part.text
                ),
              )}
            </span>
          </Fragment>
        );
      })}
    </h1>
  );
}
