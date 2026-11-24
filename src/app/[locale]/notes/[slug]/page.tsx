import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { notesCopy } from "@/content/notes";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { AuthorLine } from "@/components/notes/AuthorLine";
import { NotesContactCard } from "@/components/notes/NotesContactCard";
import { PostBody } from "@/components/notes/PostBody";
import { TableOfContents } from "@/components/notes/TableOfContents";
import { isLocale } from "@/lib/i18n";
import { absoluteUrl, buildMetadata } from "@/lib/metadata";
import { getPost, getPosts, getRelatedPosts } from "@/lib/posts";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

async function resolvePost(params: Props["params"]) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = getPost(slug);
  if (!post) notFound();
  return { locale, post };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, post } = await resolvePost(params);
  const text = post.text[locale];
  const meta = buildMetadata(locale, `/notes/${post.slug}/`, text.title, text.summary);
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: post.publishedAt, authors: [post.author] },
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

function articleJsonLd(locale: Locale, post: ReturnType<typeof getPosts>[number]): string {
  const text = post.text[locale];
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: text.title,
    description: text.summary,
    datePublished: post.publishedAt,
    inLanguage: locale,
    url: absoluteUrl(locale, `/notes/${post.slug}/`),
    author: { "@type": "Person", name: post.author, url: `${site.url}/${locale}/` },
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function NotePage({ params }: Props) {
  const { locale, post } = await resolvePost(params);
  const copy = notesCopy[locale];
  const text = post.text[locale];
  const related = getRelatedPosts(post.slug);

  return (
    <>
      <article className="bg-surface/90" data-note>
        <header className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
          <a
            href={`/${locale}/notes/`}
            className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
          >
            <ArrowLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:translate-x-0.5" />
            {copy.backToNotes}
          </a>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-tight text-balance sm:text-6xl">{text.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">{text.summary}</p>
          <AuthorLine locale={locale} post={post} month="long" className="mt-8" />
        </header>

        <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="mt-12 grid gap-16 border-t border-mist pt-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-20">
            <PostBody text={text} />
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="hidden lg:block">
                <TableOfContents label={copy.onThisPage} items={text.sections.map(({ id, title }) => ({ id, title }))} />
              </div>
              <NotesContactCard locale={locale} copy={copy} className="lg:mt-10" />
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="keep-reading" className="border-t border-mist bg-frost" data-keep-reading>
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
            <h2 id="keep-reading" className="text-4xl font-semibold tracking-tight">{copy.keepReading}</h2>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug} className="relative flex flex-col rounded-2xl border border-mist bg-surface p-6 transition-colors hover:border-indigo/50">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight">
                    <a
                      href={`/${locale}/notes/${item.slug}/`}
                      className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-indigo"
                    >
                      {item.text[locale].title}
                    </a>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">{item.text[locale].summary}</p>
                  <AuthorLine locale={locale} post={item} withDate={false} className="mt-auto pt-8" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd(locale, post) }} />
    </>
  );
}
