import type { Metadata } from "next";
import { ArrowRight, Rss } from "lucide-react";
import { notFound } from "next/navigation";
import { notesCopy } from "@/content/notes";
import type { Post } from "@/content/posts";
import type { Locale } from "@/content/types";
import { AuthorLine } from "@/components/notes/AuthorLine";
import { NotesContactCard } from "@/components/notes/NotesContactCard";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";
import { formatPostDate, getFeaturedPost, getPosts } from "@/lib/posts";

export async function generateMetadata({ params }: PageProps<"/[locale]/notes">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = notesCopy[locale];
  const meta = buildMetadata(locale, "/notes/", copy.title, copy.description);
  return { ...meta, alternates: { ...meta.alternates, types: { "application/rss+xml": `/${locale}/notes/rss.xml` } } };
}

const postHref = (locale: Locale, post: Post) => `/${locale}/notes/${post.slug}/`;

function Featured({ locale, post, label }: { locale: Locale; post: Post; label: string }) {
  const text = post.text[locale];
  return (
    <section aria-labelledby="featured-title" className="border-y border-mist bg-frost" data-featured>
      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        <div>
          <p className="text-sm font-medium text-slate">{label}</p>
          <h2 id="featured-title" className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">
            <a
              href={postHref(locale, post)}
              className="transition-colors after:absolute after:inset-0 hover:text-indigo focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-indigo"
            >
              {text.title}
            </a>
          </h2>
        </div>
        <div>
          <p className="max-w-md text-lg leading-relaxed text-ink-muted">{text.summary}</p>
          <AuthorLine locale={locale} post={post} className="mt-6" />
        </div>
      </div>
    </section>
  );
}

function PostRow({ locale, post }: { locale: Locale; post: Post }) {
  const text = post.text[locale];
  return (
    <li className="relative grid gap-3 border-t border-mist py-8 md:grid-cols-[9rem_minmax(0,1fr)_13rem] md:gap-10" data-post-row>
      <time dateTime={post.publishedAt} className="text-sm text-slate md:pt-1">{formatPostDate(locale, post.publishedAt)}</time>
      <div>
        <h3 className="text-xl font-semibold leading-snug tracking-tight">
          <a
            href={postHref(locale, post)}
            className="transition-colors after:absolute after:inset-0 hover:text-indigo focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-indigo"
          >
            {text.title}
          </a>
        </h3>
        <p className="mt-2 line-clamp-2 leading-relaxed text-ink-muted">{text.summary}</p>
      </div>
      <AuthorLine locale={locale} post={post} withDate={false} className="md:pt-0.5" />
    </li>
  );
}

export default async function Notes({ params }: PageProps<"/[locale]/notes">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = notesCopy[locale];
  const posts = getPosts();
  const featured = getFeaturedPost(posts);

  return (
    <>
      <header className="mx-auto flex max-w-7xl flex-col gap-8 px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl">{copy.title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{copy.description}</p>
        </div>
        <a
          href={`/${locale}/notes/rss.xml`}
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-sm font-medium text-ink hover:text-indigo md:self-auto"
          data-rss-link
        >
          <Rss aria-hidden="true" className="size-4 text-slate group-hover:text-indigo" />
          {copy.rssLabel}
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
        </a>
      </header>

      {featured && <Featured locale={locale} post={featured} label={copy.featuredLabel} />}

      <div className="bg-surface/90">
        <section aria-labelledby="all-notes" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <h2 id="all-notes" className="text-4xl font-semibold tracking-tight sm:text-5xl">{copy.allNotes}</h2>
          {posts.length > 0 ? (
            <ul className="mt-12 border-b border-mist">
              {posts.map((post) => <PostRow key={post.slug} locale={locale} post={post} />)}
            </ul>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-mist px-6 py-14 text-center" data-notes-empty>
              <p className="text-lg font-semibold">{copy.emptyTitle}</p>
              <p className="mt-2 text-ink-muted">{copy.emptyBody}</p>
            </div>
          )}

          <NotesContactCard locale={locale} copy={copy} wide className="mt-24" />
        </section>
      </div>
    </>
  );
}
