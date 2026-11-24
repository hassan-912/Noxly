import Image from "next/image";
import type { PostBlock, PostText } from "@/content/posts";

function Block({ block }: { block: PostBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-2 ps-6 marker:text-slate">
        {block.items.map((item) => <li key={item} className="ps-1">{item}</li>)}
      </ul>
    );
  }
  return (
    <figure className="my-10">
      <Image
        src={block.src}
        width={block.width}
        height={block.height}
        alt={block.alt}
        sizes="(min-width: 1024px) 42rem, 100vw"
        className="h-auto w-full rounded-xl border border-mist"
      />
      {block.caption && <figcaption className="mt-3 text-sm text-slate">{block.caption}</figcaption>}
    </figure>
  );
}

/** The article text: intro paragraphs, then one `<h2>` per section with its anchor id. */
export function PostBody({ text }: { text: PostText }) {
  return (
    <div className="max-w-[40rem] text-[1.0625rem] leading-[1.8] text-ink-muted" data-post-body>
      {text.intro && <div className="space-y-6">{text.intro.map((block, i) => <Block key={i} block={block} />)}</div>}
      {text.sections.map((section, index) => (
        <section key={section.id} aria-labelledby={section.id} className={index === 0 && !text.intro ? "" : "mt-14"}>
          <h2 id={section.id} className="scroll-mt-24 text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-[1.75rem]">
            {section.title}
          </h2>
          <div className="mt-5 space-y-6">
            {section.blocks.map((block, i) => <Block key={i} block={block} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
