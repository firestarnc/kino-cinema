import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMoviePackageFilmById, moviePackageFilms } from "@/lib/cinema-data";
import { siteUrl } from "@/lib/site";
import MoviePackageDetailClient from "./MoviePackageDetailClient";

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
  return moviePackageFilms.map((film) => ({ filmId: film.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ filmId: string }>;
}): Promise<Metadata> {
  const { filmId } = await params;
  const film = getMoviePackageFilmById(filmId);

  if (!film) {
    return {
      title: "Movie Not Found",
      description: "The requested movie package title could not be found.",
    };
  }

  const title = `${film.title} - Movie Package Booking`;
  const description = `${film.tagline} Reserve ${film.title} with Kino Screens movie package pricing in Benin City.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/movie-package/${film.id}/`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${siteUrl}/movie-package/${film.id}/`,
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

export default function MoviePackageDetailPage({
  params,
}: {
  params: Promise<{ filmId: string }>;
}) {
  const filmPromise = params.then(({ filmId }) => getMoviePackageFilmById(filmId));

  return <MoviePackageDetailPageContent filmPromise={filmPromise} paramsPromise={params} />;
}

async function MoviePackageDetailPageContent({
  filmPromise,
  paramsPromise,
}: {
  filmPromise: Promise<ReturnType<typeof getMoviePackageFilmById>>;
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
    aggregateRating: film.imdbRating
      ? {
          "@type": "AggregateRating",
          ratingValue: film.imdbRating,
          bestRating: 10,
          ratingCount: 1,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />
      <MoviePackageDetailClient filmId={filmId} />
    </>
  );
}
