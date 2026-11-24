"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email, label, copied }: { email: string; label: string; copied: string }) {
  const [done, setDone] = useState(false);
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (reset.current) clearTimeout(reset.current); }, []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setDone(true);
      if (reset.current) clearTimeout(reset.current);
      reset.current = setTimeout(() => setDone(false), 2500);
    } catch {
      // The adjacent mailto link remains usable if the browser denies clipboard access.
      setDone(false);
    }
  };
  return (
    <button type="button" onClick={copy} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-mist px-4 text-sm text-ink-muted hover:border-indigo hover:text-indigo">
      {done ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
      <span aria-live="polite">{done ? copied : label}</span>
    </button>
  );
}
