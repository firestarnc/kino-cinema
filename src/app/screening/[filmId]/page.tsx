import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { films } from "@/lib/cinema-data";
import { getFilmById } from "@/lib/cinema-data";
import { siteUrl } from "@/lib/site";
import FilmDetailClient from "./FilmDetailClient";

function toAbsoluteImageUrl(imageUrl: string): string {
  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${siteUrl}${imageUrl}`;
  }

  return `${siteUrl}/${imageUrl}`;
}

export function generateStaticParams() {
  return films.map((film) => ({ filmId: film.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ filmId: string }>;
}): Promise<Metadata> {
  const { filmId } = await params;
  const film = getFilmById(filmId);

  if (!film) {
    return {
      title: "Film Not Found",
      description: "The requested film could not be found.",
    };
  }

  const title = `${film.title} - Private Screening in Benin City`;
  const description = `${film.tagline} Book ${film.title} at Kino Screens in Benin City, Nigeria for a premium private movie experience.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/screening/${film.id}/`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${siteUrl}/screening/${film.id}/`,
      images: [{ url: film.posterUrl, alt: film.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [film.posterUrl],
    },
  };
}

export default function FilmDetailPage({
  params,
}: {
  params: Promise<{ filmId: string }>;
}) {
  const filmPromise = params.then(({ filmId }) => getFilmById(filmId));

  // Keep component signature simple while resolving async params in Next 16.
  return <FilmDetailPageContent filmPromise={filmPromise} paramsPromise={params} />;
}

async function FilmDetailPageContent({
  filmPromise,
  paramsPromise,
}: {
  filmPromise: Promise<ReturnType<typeof getFilmById>>;
  paramsPromise: Promise<{ filmId: string }>;
}) {
  const [film, { filmId }] = await Promise.all([filmPromise, paramsPromise]);

  if (!film) {
    notFound();
  }

  const movieSchema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: film.title,
    image: toAbsoluteImageUrl(film.posterUrl),
    description: film.synopsis,
    director: {
      "@type": "Person",
      name: film.director,
    },
    actor: film.cast.map((name) => ({
      "@type": "Person",
      name,
    })),
    genre: film.genre,
    datePublished: `${film.year}-01-01`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: film.imdbRating,
      bestRating: 10,
      ratingCount: 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />
      <FilmDetailClient filmId={filmId} />
    </>
  );
}