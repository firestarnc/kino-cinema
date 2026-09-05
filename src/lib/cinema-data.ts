// =============================================================================
// Cinema Data - Mock data for a luxurious private cinema booking app
// =============================================================================

import { match } from "assert/strict";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type FilmRating = "G" | "PG" | "PG-13" | "R" | "NC-17" | "NR";

export interface Film {
  id: string;
  title: string;
  tagline: string;
  genre: string;
  duration: number;
  rating: FilmRating;
  year: number;
  director: string;
  cast: string[];
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  imdbRating: number;
}

export interface MoviePackageFilm {
  id: string;
  title: string;
  tagline: string;
  genre: string;
  duration: number;
  rating: FilmRating;
  year: number;
  director: string;
  cast: string[];
  synopsis: string;
  posterFile: string;
  posterUrl: string;
  imdbRating?: number;
}

export type RoomTier = "standard" | "premium" | "vip" | "ultra";

export interface CinemaRoom {
  id: string;
  name: string;
  description: string;
  capacity: number;
  features: string[];
  pricePerHour: number;
  imageUrl: string;
  tier: RoomTier;
}

export interface Screening {
  id: string;
  filmId: string;
  roomId: string;
  dateTime: string;
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  quote: string;
  rating: number;
}

// -----------------------------------------------------------------------------
// Film Data
// -----------------------------------------------------------------------------

const BLOCKBUSTER_POSTER_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BLOCKBUSTER_BUCKET?.trim() ?? "";

const MOVIE_PACKAGE_POSTER_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_MOVIE_PACKAGE_BUCKET?.trim() ?? "";

const SUPABASE_PUBLIC_URL = normalizePublicSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);

function requirePosterEnv(name: string, value: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Poster assets are configured for Supabase storage only.`
    );
  }

  return value;
}

const POSTER_STORAGE_CONFIG = {
  supabaseBaseUrl: requirePosterEnv("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_PUBLIC_URL),
  blockbusterBucket: requirePosterEnv("NEXT_PUBLIC_SUPABASE_BLOCKBUSTER_BUCKET", BLOCKBUSTER_POSTER_BUCKET),
  moviePackageBucket: requirePosterEnv("NEXT_PUBLIC_SUPABASE_MOVIE_PACKAGE_BUCKET", MOVIE_PACKAGE_POSTER_BUCKET),
};

function normalizePublicSupabaseUrl(rawUrl: string | undefined): string {
  if (!rawUrl) {
    return "";
  }

  return rawUrl.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/i, "");
}

function buildPublicPosterUrl(posterFile: string, bucketName: string): string {
  return `${POSTER_STORAGE_CONFIG.supabaseBaseUrl}/storage/v1/object/public/${bucketName}/${posterFile}`;
}

function buildBlockbusterPosterUrl(posterFile: string): string {
  return buildPublicPosterUrl(posterFile, POSTER_STORAGE_CONFIG.blockbusterBucket);
}

function buildMoviePackagePosterUrl(posterFile: string): string {
  const normalizedFile = posterFile.includes(".") ? posterFile : `${posterFile}.png`;
  return buildPublicPosterUrl(normalizedFile, POSTER_STORAGE_CONFIG.moviePackageBucket);
}

export const films: Film[] = [
  {
    id: "film-1",
    title: "The Creek",
    tagline: "From the heart of the Niger Delta comes a story of struggle, power, and survival.",
    genre: "Action Thriller",
    duration: 93,
    rating: "R",
    year: 2026,
    director: "Toka McBaror",
    cast: ["Sam Dede", "Bucci Franklin", "Charles Inojie", "Jimmy Jean-Louis"],
    synopsis:
      "An ex-marine who returns home to Nigeria after 25 years away, only for his homecoming to take a dangerous turn when he is kidnapped by rival militants along the creeks. As a frantic rescue mission is launched, he must fight for survival while navigating a volatile landscape of corporate exploitation, political corruption, and internal fractures within the local resistance movement.",
    posterUrl: buildBlockbusterPosterUrl("film-1.jpg"),
    backdropUrl: "/backdrops/film-1.jpg",
    trailerUrl: "",
    imdbRating: 8.5,
  },
  {
    id: "film-2",
    title: "Strong",
    tagline: "What happens when love is no longer convenient?",
    genre: "Thriller Drama",
    duration: 98,
    rating: "R",
    year: 2026,
    director: "Dimbo Atiya and Karachi Atiya",
    cast: ["Sophie Alakija", "Chris Okagbue", "Abayomi Alvin", "Sika Osei"],
    synopsis:
      "A radiant, spiritual mentor, and accomplished architect who enjoys a seemingly idyllic life with her husband. Their marriage stands as a testament to love and faith, but their world fractures when her husband is suddenly accused of infidelity and a heinous murder.",
    posterUrl: buildBlockbusterPosterUrl("film-2.jpeg"),
    backdropUrl: "/backdrops/film-2.jpeg",
    trailerUrl: "",
    imdbRating: 8.0,
  },
  {
    id: "film-3",
    title: "A Spark in the Dark",
    tagline: "It's not always about what you can see... It's about what you can feel.",
    genre: "Romantic Drama",
    duration: 98,
    rating: "R",
    year: 2026,
    director: "Akay Mason",
    cast: ["Tope Olowoniyan", "Blossom Chukwujekwu", "Daniel Etim Effiong", "Gideon Okeke"],
    synopsis:
      "A young influencer who manages to find love and stability with an electrical engineer after previously losing her adoptive parents and her family fortune.",
    posterUrl: buildBlockbusterPosterUrl("film-3.jpeg"),
    backdropUrl: "/backdrops/film-3.jpeg",
    trailerUrl: "",
    imdbRating: 7.0,
  },
  {
    id: "film-4",
    title: "Call of my Life",
    tagline: "What if the love you've been waiting for is just one call away?",
    genre: "Romantic Comedy",
    duration: 107,
    rating: "PG-13",
    year: 2026,
    director: "Dammy Twitch",
    cast: ["Uzoamaka Power", "Andrew Yaw Bunting ", "Zubby Michael", "Beverly Osu"],
    synopsis:
      "A professional call center agent and hopeless romantic who accidentally answers a call from a charming stranger living abroad. Their brief phone interaction sparks an instant connection, leading them into a whirlwind virtual romance despite never having met in person. As she navigates the complexities of falling in love through a phone screen, the unexpected return of her ex-boyfriend forces her to choose between the comfortable familiarity of her past and the exciting possibility of her digital future.",
    posterUrl: buildBlockbusterPosterUrl("film-4.jpeg"),
    backdropUrl: "/backdrops/film-4.jpeg",
    trailerUrl: "",
    imdbRating: 8.0,
  },
  {
    id: "film-5",
    title: "The Boy Who Gave",
    tagline: "How much of yourself can you give before you disappear?",
    genre: "Family Drama", 
    duration: 118,
    rating: "R",
    year: 2025,
    director: "Allison Precious Emmanuel",
    cast: ["Allison Precious Emmanuel", "Chuks Joseph", "Hart Andrew ", "Abbey Delight Dagogo"],
    synopsis:
      "The heartbreaking journey of a teenage firstborn in a small Niger Delta community who is suddenly thrust into the role of a parent after the tragic deaths of his mother and father",
    posterUrl: buildBlockbusterPosterUrl("film-5.jpeg"),
    backdropUrl: "/backdrops/film-5.jpeg",
    trailerUrl: "",
    imdbRating: 8.5,
  },
];

// -----------------------------------------------------------------------------
// Helpers: map MoviePackageFilm -> Film
// -----------------------------------------------------------------------------

export function moviePackageFilmToFilm(mp: MoviePackageFilm): Film {
  return {
    id: mp.id,
    title: mp.title,
    tagline: mp.tagline,
    genre: mp.genre,
    duration: mp.duration,
    rating: mp.rating,
    year: mp.year,
    director: mp.director,
    cast: mp.cast,
    synopsis: mp.synopsis,
    posterUrl: mp.posterUrl ?? "",
    backdropUrl: mp.posterUrl ?? "",
    trailerUrl: "",
    imdbRating: mp.imdbRating ?? 0,
  };
}

export function getMoviePackageFilmAsFilmById(id: string): Film | undefined {
  const mp = moviePackageFilms.find((m) => m.id === id);
  return mp ? moviePackageFilmToFilm(mp) : undefined;
}

// -----------------------------------------------------------------------------
// Movie Package Data
// -----------------------------------------------------------------------------

export const moviePackageFilms: MoviePackageFilm[] = [
  {
    id: "goat",
    title: "Goat",
    tagline: "Dream Big. Play Bigger.",
    genre: "Animation Sports Comedy",
    duration: 100,
    rating: "PG",
    year: 2026,
    director: "Tyree Dillihay",
    cast: ["Caleb McLaughlin", "Gabrielle Union", "Aaron Pierre", "Stephen Curry"],
    synopsis: "A young goat pursues his dream of becoming a professional Roarball player.",
    posterFile: "goat.png",
    posterUrl: buildMoviePackagePosterUrl("goat.png"),
    imdbRating: 6.9,

  },
  {
    id: "jackryangh",
    title: "Jack Ryan: Ghost War",
    tagline: "The Mission Comes First.",
    genre: "Action Thriller",
    duration: 105,
    rating: "R",
    year: 2026,
    director: "Andrew Brenstein",
    cast: ["John Krasinski", "Wendell Pierce", "Michael Kelly", "Sienna Miller"],
    synopsis:
      "Follows Jack Ryan who reunites with CIA operatives to navigate a treacherous web of betrayal against an enemy who knows their every move, facing a past they thought was long put to rest.",
    posterFile: "jackryangh.png",
    posterUrl: buildMoviePackagePosterUrl("jackryangh.png"),
    imdbRating: 5.9,
  },
  {
    id: "themummyle",
    title: "Lee Cronin's The Mummy",
    tagline: "Some Things Are Meant To Stay Buried",
    genre: "Action Supernatural Horror",
    duration: 134,
    rating: "R",
    year: 2026,
    director: "Lee Cronin",
    cast: ["Jack Reynor", "Laia Costa", "May Calamawy", "Natalie Grace"],
    synopsis:
      "The young daughter of a journalist disappears into the desert without a trace. Eight years later, the broken family is shocked when she is returned to them, as what should be a joyful reunion turns into a living nightmare.",
    posterFile: "themummyle.png",
    posterUrl: buildMoviePackagePosterUrl("themummyle.png"),
    imdbRating: 6.2,  
  },
  {
    id: "projecthm",
    title: "Project Hail Mary",
    tagline: "Believe in the Hail Mary.",
    genre: "Sci-Fi Adventure",
    duration: 156,
    rating: "PG-13",
    year: 2026,
    director: "Phil Lord & Christopher Miller",
    cast: ["Ryan Gosling", "Sandra Huller", "James Ortiz", "Lionel Boyce"],
    synopsis: "An astronaut must save Earth from a cosmic threat.",
    posterFile: "projecthm.png",
    posterUrl: buildMoviePackagePosterUrl("projecthm.png"),
    imdbRating: 8.2,
  },
  {
    id: "beastda",
    title: "Beast",
    tagline: "Legends Are Made In The Cage.",
    genre: "Action Sports Drama",
    duration: 114,
    rating: "R",
    year: 2026,
    director: "Andrew Brenstein, Tyler Atkins",
    cast: ["Russell Crowe", "Mojean Aria", "Daniel MacPherson", "Luke Hemsworth"],
    synopsis:
      "MMA legend Patton James, now a commercial fisherman, is pulled back into the cage when his brother is in danger. Reuniting with his old coach Sammy, he commits to one final fight in ONE Championship against its brutal champion Xavier Grau.",
    posterFile: "beastda.png",
    posterUrl: buildMoviePackagePosterUrl("beastda.png"),
    imdbRating: 5.8,
  },
  {
    id: "mortalkombat2",
    title: "Mortal Kombat 2",
    tagline: "The Tournament Begins.",
    genre: "Action Fantasy",
    duration: 115,
    rating: "R",
    year: 2026,
    director: "Simon McQuoid",
    cast: ["Karl Urban", "Lewis Tan", "Jessica McNamee", "Hiroyuki Sanada"],
    synopsis: "Earthrealm enters the Mortal Kombat tournament.",
    posterFile: "mortalkombat2.png",
    posterUrl: buildMoviePackagePosterUrl("mortalkombat2.png"),
    imdbRating: 6.7,
  },
  {
    id: "furiosamadmx",
    title: "Furiosa: Mad Max Saga",
    tagline: "Her Odyssey Begins.",
    genre: "Sci-Fi Action Adventure",
    duration: 148,
    rating: "R",
    year: 2024,
    director: "George Miller",
    cast: ["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke", "Alyla Browne"],
    synopsis: "Furiosa fights to return home in a brutal wasteland.",
    posterFile: "furiosamadmx.png",
    posterUrl: buildMoviePackagePosterUrl("furiosamadmx.png"),
    imdbRating: 7.5,
  },
  {
    id: "avatarwa",
    title: "Avatar: Way of Water",
    tagline: "Return to Pandora",
    genre: "Sci-Fi Adventure",
    duration: 193,
    rating: "PG-13",
    year: 2022,
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang"],
    synopsis:
      "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    posterFile: "avatarwa.png",
    posterUrl: buildMoviePackagePosterUrl("avatarwa.png"),
    imdbRating: 7.5,
  },
  {
    id: "michaelj",
    title: "Michael",
    tagline: "The King of Pop Lives On.",
    genre: "Biography Music Drama",
    duration: 127,
    rating: "PG-13",
    year: 2026,
    director: "Antoine Fuqua",
    cast: ["Jaafar Jackson", "Nia Long", "Miles Teller", "Colman Domingo"],
    synopsis:
      "The early life of musician Michael Jackson, from the discovery of his talent as the lead of the Jackson Five to the artist whose creative ambition fueled a pursuit to become the biggest entertainer in the world.",
    posterFile: "michaelj.png",
    posterUrl: buildMoviePackagePosterUrl("michaelj.png"),
    imdbRating: 7.5,
  },
  {
    id: "jurassicworldre",
    title: "Jurassic World: Rebirth",
    tagline: "A New Era Begins.",
    genre: "Sci-Fi Action Adventure",
    duration: 133,
    rating: "PG-13",
    year: 2025,
    director: "Gareth Edwards",
    cast: ["Scarlett Johansson", "Mahershala Ali", "Jonathan Bailey", "Rupert Friend"],
    synopsis:
      "Five years post-Jurassic World: Dominion (2022), an expedition braves isolated equatorial regions to extract DNA from three massive prehistoric creatures for a groundbreaking medical breakthrough.",
    posterFile: "jurassicworldre.png",
    posterUrl: buildMoviePackagePosterUrl("jurassicworldre.png"),
    imdbRating: 6.4,
  },
  {
    id: "kraventhehunt",
    title: "Kraven the Hunter",
    tagline: "Villains Aren't Born. They're Made.",
    genre: "Action Superhero",
    duration: 127,
    rating: "R",
    year: 2024,
    director: "J.C. Chandor",
    cast: ["Aaron Taylor-Johnson", "Ariana DeBose", "Fred Hechinger", "Russell Crowe"],
    synopsis:
      "Kraven's complex relationship with his ruthless father, Nikolai Kravinoff, starts him down a path of vengeance with brutal consequences, motivating him to become not only the greatest hunter in the world, but also one of its most feared.",
    posterFile: "kraventhehunt.png",
    posterUrl: buildMoviePackagePosterUrl("kraventhehunt.png"),
    imdbRating: 5.5,
  },
  {
    id: "gladiator2",
    title: "Gladiator 2",
    tagline: "What We Do in Life Echoes in Eternity.",
    genre: "Action HistoricalDrama",
    duration: 148,
    rating: "R",
    year: 2024,
    director: "Ridley Scott",
    cast: ["Paul Mescal", "Pedro Pascal", "Denzel Washington", "Connie Nielsen"],
    synopsis:
      "After his home is conquered by the tyrannical emperors who now lead Rome, Lucius is forced to enter the Colosseum and must look to his past to find strength to return the glory of Rome to its people.",
    posterFile: "gladiator2.png",
    posterUrl: buildMoviePackagePosterUrl("gladiator2.png"),
    imdbRating: 6.8,
  },
  {
    id: "frankeinstein",
    title: "Frankenstein",
    tagline: "A Monster's Tragic Creation.",
    genre: "Horror Fantasy Drama",
    duration: 150,
    rating: "R",
    year: 2025,
    director: "Guillermo del Toro",
    cast: ["Oscar Isaac", "Jacob Elordi", "Mia Goth", "Christoph Waltz"],
    synopsis:
      "Dr. Victor Frankenstein, a brilliant but egotistical scientist, brings a creature to life in a monstrous experiment that ultimately leads to the undoing of both the creator and his tragic creation.",
    posterFile: "frankeinstein.png",
    posterUrl: buildMoviePackagePosterUrl("frankeinstein.png"),
    imdbRating: 7.1,
  },
  {
    id: "28yrslater",
    title: "28 Years Later",
    tagline: "Time Didn't Heal Anything.",
    genre: "Horror Thriller",
    duration: 115,
    rating: "R",
    year: 2025,
    director: "Danny Boyle",
    cast: ["Jodie Comer", "Aaron Taylor-Johnson", "Ralph Fiennes", "Alfie Williams"],
    synopsis:
      "A group of survivors of the rage virus live on a small island. When one of the group leaves the island on a mission into the mainland, he discovers secrets, wonders, and horrors that have mutated not only the infected but other survivors.",
    posterFile: "28yrslater.png",
    posterUrl: buildMoviePackagePosterUrl("28yrslater.png"),
    imdbRating: 6.9,
  },
  {
    id: "wakeupdead",
    title: "Knives Out: Wake Up Dead Man",
    tagline: "The Most Dangerous Case Yet.",
    genre: "Comedy Crime Mystery",
    duration: 144,
    rating: "PG-13",
    year: 2025,
    director: "Rian Johnson",
    cast: ["Daniel Craig", "Josh Brolin", "Glenn Close", "Mila Kunis"],
    synopsis:
      "Detective Benoit Blanc teams up with an earnest young priest to investigate a perfectly impossible crime at a small-town church with a dark history.",
    posterFile: "wakeupdead.png",
    posterUrl: buildMoviePackagePosterUrl("wakeupdead.png"),
    imdbRating: 7.3,
  },
  {
    id: "supermank",
    title: "Superman",
    tagline: "Look Up.",
    genre: "Superhero Action",
    duration: 129,
    rating: "PG-13",
    year: 2025,
    director: "James Gunn",
    cast: ["David Corenswet", "Rachel Brosnahan", "Nicholas Hoult", "Skyler Gisondo"],
    synopsis:
      "Superman must reconcile his alien Kryptonian heritage with his human upbringing as reporter Clark Kent. As the embodiment of truth, justice and the American way he soon finds himself in a world that views these as old-fashioned.",
    posterFile: "supermank.png",
    posterUrl: buildMoviePackagePosterUrl("supermank.png"),
    imdbRating: 7,
  },
  {
    id: "thunderboltsn",
    title: "Thunderbolts",
    tagline: "Everyone Deserves A Second Shot.",
    genre: "Superhero Action",
    duration: 126,
    rating: "PG-13",
    year: 2025,
    director: "Jake Schreier",
    cast: ["Florence Pugh", "Sebastian Stan", "Wyatt Russell", "David Harbour"],
    synopsis:
      "After finding themselves ensnared in a death trap, an unconventional team of antiheroes must go on a dangerous mission that will force them to confront the darkest corners of their pasts.",
    posterFile: "thunderboltsn.png",
    posterUrl: buildMoviePackagePosterUrl("thunderboltsn.png"),
    imdbRating: 7.1,
  },
  {
    id: "f1themovie",
    title: "F1: The Movie",
    tagline: "Racing Is Life.",
    genre: "Sports Drama",
    duration: 155,
    rating: "PG-13",
    year: 2025,
    director: "Joseph Kosinski",
    cast: ["Brad Pitt", "Damson Idris", "Kerry Condon", "Javier Bardem"],
    synopsis: "A Formula One driver comes out of retirement to mentor and team up with a younger driver.",
    posterFile: "f1themovie.png",
    posterUrl: buildMoviePackagePosterUrl("f1themovie.png"),
    imdbRating: 7.6,
  },
  {
    id: "inthegrey",
    title: "In the Grey",
    tagline: "No Rules. No Mercy.",
    genre: "Action Thriller",
    duration: 123,
    rating: "R",
    year: 2026,
    director: "Guy Ritchie",
    cast: ["Henry Cavill", "Jake Gyllenhaal", "Eiza Gonzalez", "Rosamund Pike"],
    synopsis:
      "A covert team of elite operatives are living in the shadows. When a ruthless despot steals a billion-dollar fortune, they're sent to take it back-an impossible heist that erupts into a deadly game of strategy, deception and survival.",
    posterFile: "inthegrey.png",
    posterUrl: buildMoviePackagePosterUrl("inthegrey.png"),
    imdbRating: 6.3,
  },
  {
    id: "avatarfire",
    title: "Avatar: Fire and Ash",
    tagline: "When the Ashes Fall, Only the Strong will Rise",
    genre: "Action Sci-Fi Fantasy Epic",
    duration: 197,
    rating: "PG-13",
    year: 2025,
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang"],
    synopsis:
      "Jake and Neytiri's family grapples with grief, encountering a new, aggressive Na'vi tribe, the Ash People, who are led by the fiery Varang, as the conflict on Pandora escalates and a new moral focus emerges.",
    posterFile: "avatarfire.png",
    posterUrl: buildMoviePackagePosterUrl("avatarfire.png"),
    imdbRating: 7.3,
  },
  {
    id: "thepunisher",
    title: "The Punisher",
    tagline: "Vengeance Has A Name.",
    genre: "Action Crime Thriller",
    duration: 124,
    rating: "R",
    year: 2026,
    director: "Reinaldo Marcus Green",
    cast: ["Frank Castle", "Karen Page", "Curtis Hoyle", "Ma Gnucci"],
    synopsis:
      "The narrative follows Frank Castle, who is in hiding and attempting to move past his life of vengeance.",
    posterFile: "The Punisher One Last Kill Movie 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("The Punisher One Last Kill Movie 2026.jpg"),
    imdbRating: 6.4,
  },
  {
    id: "yourfaultlondon",
    title: "Your Fault London",
    tagline: "How do you hold onto true love after you've found it?",
    genre: "Romance Drama",
    duration: 123,
    rating: "R",
    year: 2026,
    director: "Charlotte Fassler and Dani Girdwood",
    cast: ["Asha Banks", "Matthew Broome", "Louisa Binder", "Joel Nankervis"],
    synopsis:
      "Nick and Noah are both embarking on life-changing adventures that are threatening to pull them apart—Nick in business with his father and Noah starting a fresh chapter at Oxford University. Now living separate lives, and meeting new people, they find themselves entangled in temptations, rivalries, and betrayals and their bond is tested like never before.",
    posterFile: "Your Fault London (2026).jpg",
    posterUrl: buildMoviePackagePosterUrl("Your Fault London (2026).jpg"),
    imdbRating: 6.2,
  },
  {
    id: "mebeforeyou",
    title: "Me before you",
    tagline: "Live boldly. Push yourself. Don't settle. ",
    genre: "Romance Drama",
    duration: 110,
    rating: "PG-13",
    year: 2016,
    director: "Thea Sharrock",
    cast: ["Emilia Clarke", "Sam Claflin", "Janet McTeer", "Charles Dance"],
    synopsis:
      "A cheerful young woman becomes a caregiver for a wealthy, paralyzed man and forms an unlikely bond with him that transforms both of their lives.",
    posterFile: "me before you 2016.jpg",
    posterUrl: buildMoviePackagePosterUrl("me before you 2016.jpg"),
    imdbRating: 7.4,
  },
  {
    id: "kraken",
    title: "Kraken",
    tagline: "Fear the Depths.",
    genre: "Horror Thriller",
    duration: 100,
    rating: "NR",
    year: 2026,
    director: "Pål Øie",
    cast: ["Sara Khorami", "Mikkel Bratt Silset", "Ingvild Holthe Bygdnes", "Øyvind Brandtzæg"],
    synopsis:
      "A marine biologist investigating mysterious events at a Norwegian fish farm discovers that advanced sonar technology has awakened a giant, ancient creature from the depths of the fjord.",
    posterFile: "Kraken 2026 .jpg",
    posterUrl: buildMoviePackagePosterUrl("Kraken 2026 .jpg"),
    imdbRating: 5,
  },
  {
    id: "isgodis",
    title: "Is GOD is",
    tagline: "Make your daddy dead. Real dead.",
    genre: "Action Thriller Drama",
    duration: 99,
    rating: "R",
    year: 2026,
    director: "Aleshea Harris",
    cast: ["Kara Young", "Mallori Johnson", "Janelle Monáe", "Sterling K. Brown"],
    synopsis:
      "Two sisters embark on an epic quest for revenge against their father after receiving a request from their estranged mother.",
    posterFile: "Is God Is (2026).jpg",
    posterUrl: buildMoviePackagePosterUrl("Is God Is (2026).jpg"),
    imdbRating: 7.3,
  },
  {
    id: "findingemily",
    title: "Finding Emily",
    tagline: "Looking for love and finding chaos.",
    genre: "Romance Comedy",
    duration: 111,
    rating: "PG-13",
    year: 2026,
    director: "Alicia MacDonald",
    cast: ["Angourie Rice", "Spike Fearn", "Minnie Driver", "Nadia Parkes"],
    synopsis:
      "When a lovesick musician is given the wrong number for his dream girl, he teams up with a driven psychology student to find her, sparking a campus-wide frenzy that tests their own hearts.",
    posterFile: "finding emily 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("finding emily 2026.jpg"),
    imdbRating: 7.2,
  },
  {
    id: "toystory5",
    title: "Toy story 5",
    tagline: "To Infinity and Beyond!",
    genre: "Animation Adventure Comedy",
    duration: 102,
    rating: "PG",
    year: 2026,
    director: "Andrew Stanton",
    cast: ["Tom Hanks", "Tim Allen", "Joan Cusack", "Greta Lee"],
    synopsis:
      "Buzz, Woody, Jessie, and the rest of the gang face a new challenge when Bonnie receives a tablet device called Lilypad, threatening their traditional roles as playthings.",
    posterFile: "toy story 5 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("toy story 5 2026.jpg"),
    imdbRating: 7.5,
  },
  {
    id: "together",
    title: "Together",
    tagline: "Complacency can sometimes be harmony.",
    genre: "Horror Romance",
    duration: 102,
    rating: "R",
    year: 2025,
    director: "Michael Shanks",
    cast: ["Dave Franco", "Alison Brie", "Damon Herriman", "Mia Morrissey"],
    synopsis:
      "A couple moves to the countryside to start fresh, only for a nightmarish encounter with a supernatural force to physically fuse their bodies together.",
    posterFile: "together 2025.jpg",
    posterUrl: buildMoviePackagePosterUrl("together 2025.jpg"),
    imdbRating: 6.7,
  },
  {
    id: "scarymovie",
    title: "Scary movie",
    tagline: "No mercy. No shame. No sequel.",
    genre: "Comedy Horror",
    duration: 88,
    rating: "R",
    year: 2000,
    director: "Keenen Ivory Wayans",
    cast: ["Anna Faris", "Regina Hall", "Shawn Wayans", "Marlon Wayans"],
    synopsis:
      "A group of teenagers accidentally killed a man and threw his body in a lake, only to be stalked by a masked serial killer one year later.",
    posterFile: "scarymovie 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("scarymovie 2026.jpg"),
    imdbRating: 4.9,
  },
  {
    id: "hereditary",
    title: "Hereditary",
    tagline: "Every family tree hides a secret.",
    genre: "Horror Drama Mystery",
    duration: 127,
    rating: "R",
    year: 2018,
    director: "Ari Aster",
    cast: ["Toni Collette", "Alex Wolff", "Milly Shapiro", "Gabriel Byrne"],
    synopsis:
      "When the matriarch of the Graham family passes away, her daughter's family begins to unravel cryptic and increasingly terrifying secrets about their ancestry.",
    posterFile: "Hereditary 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("Hereditary 2026.jpg"),
    imdbRating: 7.3,
  },
  {
    id: "they-will-kill-you",
    title: "They Will Kill You",
    tagline: "Choose your floor wisely.",
    genre: "Horror Action Comedy",
    duration: 94,
    rating: "R",
    year: 2026,
    director: "Kirill Sokolov",
    cast: ["Zazie Beetz", "Patricia Arquette", "Myha'la", "Tom Felton"],
    synopsis:
      "A woman takes a housekeeping job at a high-rise apartment building to find her missing sister, unaware that the residents belong to a murderous Satanic cult.",
    posterFile: "They Will Kill You 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("They Will Kill You 2026.jpg"),
    imdbRating: 6.5,
  },
  {
    id: "the-sheeps-detectives",
    title: "The Sheep's Detectives",
    tagline: "It's a mystery for the whole flock.",
    genre: "Mystery Family Comedy",
    duration: 109,
    rating: "PG",
    year: 2026,
    director: "Kyle Balda",
    cast: ["Hugh Jackman", "Emma Thompson", "Nicholas Braun", "Nicholas Galitzine"],
    synopsis:
      "When their beloved shepherd is mysteriously murdered, a clever flock of sheep uses the murder mystery stories he read to them to solve the crime.",
    posterFile: "The Sheep Detectives.jpg",
    posterUrl: buildMoviePackagePosterUrl("The Sheep Detectives.jpg"),
    imdbRating: 7.5,
  },
  {
    id: "the-death-of-robinhoob",
    title: "The Death of Robinhoob",
    tagline: "The legend was a lie.",
    genre: "Action Adventure Drama",
    duration: 123,
    rating: "R",
    year: 2026,
    director: "Michael Sarnoski",
    cast: ["Hugh Jackman", "Jodie Comer", "Bill Skarsgård", "Murray Bartlett"],
    synopsis:
      "An aging, gravely injured Robin Hood grapples with his past life of violence while recovering under the care of a mysterious nun at a remote priory.",
    posterFile: "The Death of Robin Hood (2026).jpg",
    posterUrl: buildMoviePackagePosterUrl("The Death of Robin Hood (2026).jpg"),
    imdbRating: 7.4,
  },
  {
    id: "voicemails-of-isabelle",
    title: "Voicemails of Isabelle",
    tagline: "Pick up the phone.",
    genre: "Romance Comedy Drama",
    duration: 118,
    rating: "R",
    year: 2026,
    director: "Leah McKendrick",
    cast: ["Zoey Deutch", "Nick Robinson", "Harry Shum Jr.", "Ciara Bravo"],
    synopsis:
      "A young woman's confessional voicemails to her late sister are unknowingly redirected to a stranger, who begins to fall in love with her.",
    posterFile: "Voicemails for Isabelle 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("Voicemails for Isabelle 2026.jpg"),
    imdbRating: 7.3,
  },
  {
    id: "obsession",
    title: "Obsession",
    tagline: "Be careful who you wish for.",
    genre: "Horror Thriller",
    duration: 108,
    rating: "R",
    year: 2026,
    director: "Curry Barker",
    cast: ["Michael Johnston", "Inde Navarrette", "Cooper Tomlinson", "Megan Lawless"],
    synopsis:
      "When a young man uses a cursed artifact to wish for his crush's love, he accidentally unleashes a horrifying, violent spell of obsession that traps her mind and turns his romantic fantasy into a deadly nightmare.",
    posterFile: "Obsession 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("Obsession 2026.jpg"),
    imdbRating: 7.9,
  },
  {
    id: "marty-supreme",
    title: "Marty Supreme",
    tagline: "Dream Big.",
    genre: "Sports Comedy Drama",
    duration: 150,
    rating: "R",
    year: 2025,
    director: "Josh Safdie",
    cast: ["Timothée Chalamet", "Gwyneth Paltrow", "Odessa A'zion", "Kevin O'Leary"],
    synopsis:
      "An energetic young table tennis player in 1950s New York City pursues his chaotic obsession with becoming a world champion.",
    posterFile: "marty supreme 2025.jpg",
    posterUrl: buildMoviePackagePosterUrl("marty supreme 2025.jpg"),
    imdbRating: 7.7,
  },
  {
    id: "citizen-vigilante",
    title: "Citizen Vigilante",
    tagline: "When justice is denied.",
    genre: "Action Crime Thriller",
    duration: 89,
    rating: "R",
    year: 2026,
    director: "Uwe Boll",
    cast: ["Armie Hammer", "Costas Mandylor", "Désirée Giorgetti", "Steffen Mennekes"],
    synopsis:
      "An American businessman living in Europe takes justice into his own hands and targets violent criminals and corrupt officials after losing faith in the legal system.",
    posterFile: "Citizen Vigilante 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("Citizen Vigilante 2026.jpg"),
    imdbRating: 6.2,
  },
  {
    id: "backrooms",
    title: "Backrooms",
    tagline: "Everything Must Go.",
    genre: "Horror Sci-Fi",
    duration: 105,
    rating: "R",
    year: 2026,
    director: "Kane Parsons",
    cast: ["Chiwetel Ejiofor", "Renate Reinsve", "Mark Duplass", "Finn Bennett"],
    synopsis:
      "A struggling furniture store manager discovers a secret portal in his store's basement that leads into a vast, surreal labyrinth of liminal spaces.",
    posterFile: "backrooms 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("backrooms 2026.jpg"),
    imdbRating: 7,
  },
  {
    id: "apex",
    title: "Apex",
    tagline: "Hunt or be Hunted.",
    genre: "Action Thriller",
    duration: 95,
    rating: "R",
    year: 2021,
    director: "Edward John Drake",
    cast: ["Bruce Willis", "Neal McDonough", "Corey William Large", "Trevor Gretzky"],
    synopsis:
      "A disgraced ex-cop is offered a chance at freedom if he can survive being hunted by six rich hunters on a remote island.",
    posterFile: "apex_2021.jpg",
    posterUrl: buildMoviePackagePosterUrl("apex_2021.jpg"),
    imdbRating: 6.1,
  },
  {
    id: "the-passenger",
    title: "The Passenger",
    tagline: "130 million people take road trips every year. 15,400 of them are never seen again.",
    genre: "Horror Thriller",
    duration: 94,
    rating: "R",
    year: 2026,
    director: "André Øvredal",
    cast: ["Jacob Scipio", "Lou Llobell", "Melissa Leo", "Miles Fowler"],
    synopsis:
      "After witnessing a gruesome highway accident, a young couple realizes they are pursued by a relentless demonic presence known as the Passenger.",
    posterFile: "The Passenger (2026) .jpg",
    posterUrl: buildMoviePackagePosterUrl("The Passenger (2026) .jpg"),
    imdbRating: 4.4,
  },
  {
    id: "hokum",
    title: "Hokum",
    tagline: "Dismiss the folk tales at your own peril.",
    genre: "Horror",
    duration: 107,
    rating: "R",
    year: 2026,
    director: "Damian McCarthy",
    cast: ["Adam Scott", "Peter Coonan", "David Wilmot", "Florence Ordesh"],
    synopsis:
      "A cynical author travels to a remote Irish hotel to scatter his parents' ashes, where he becomes entangled in frightening supernatural occurrences and the mystery of a haunted suite.",
    posterFile: "Hokum (2026).jpg",
    posterUrl: buildMoviePackagePosterUrl("Hokum (2026).jpg"),
    imdbRating: 7.3,
  },
  {
    id: "desert-warrior",
    title: "Desert warrior",
    tagline: "In the shadow of an empire, one warrior must unite them all.",
    genre: "Action Adventure History",
    duration: 126,
    rating: "R",
    year: 2026,
    director: "Rupert Wyatt",
    cast: ["Anthony Mackie", "Aiysha Hart", "Sharlto Copley", "Ben Kingsley"],
    synopsis:
    "In seventh-century Arabia, a princess flees a ruthless emperor and teams up with a legendary bandit to unite warring tribes.",
    posterFile: "desert warrior 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("desert warrior 2026.jpg"),
    imdbRating: 2.2,
  },
  {
    id: "the-yeti",
    title: "The Yeti",
    tagline: "Built for the Wild.",
    genre: "Horror Thriller",
    duration: 91,
    rating: "R",
    year: 2026,
    director: "Gene Gallerano, William Pisciotta",
    cast: ["Brittany Allen", "Eric Nelsen", "Jim Cummings", "William Sadler"],
    synopsis:
    "In 1947 Alaska, a rescue team searches for a missing oil tycoon and adventurer, only to be hunted by a terrifying creature.",
    posterFile: "the yeti 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("the yeti 2026.jpg"),
    imdbRating: 3.8,
  },
  {
    id: "the-super-mario-galaxy",
    title: "The Super Mario Galaxy",
    tagline: "New galaxies. New friends. Yoshi joins the adventure.",
    genre: "Animation Adventure Comedy",
    duration: 98,
    rating: "PG",
    year: 2026,
    director: "Aaron Horvath & Michael Jelenic",
    cast: ["Chris Pratt", "Anya Taylor-Joy", "Charlie Day", "Jack Black"],
    synopsis:
    "Mario, Luigi, Princess Peach, Toad, and Yoshi embark on a galactic adventure across space to rescue Princess Rosalina from Bowser Jr. and Bowser.",
    posterFile: "The Super Mario Galaxy Movie 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("The Super Mario Galaxy Movie 2026.jpg"),
    imdbRating: 6.3,
  },
  {
    id: "the-pout-pout-fish",
    title: "The Pout Pout Fish",
    tagline: "Turn little pouts into big smiles!",
    genre: "Animation Adventure Comedy Adventure",
    duration: 92,
    rating: "PG",
    year: 2026,
    director: "Ricard Cussó, Rio Harrington",
    cast: ["Nick Offerman", "Nina Oyama", "Amy Sedaris", "Miranda Otto"],
    synopsis:
    "A grumpy recluse fish and an energetic sea dragon team up on a quest to find a legendary wish-granting fish and save their homes.",
    posterFile: "The Pout-Pout Fish - movie 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("The Pout-Pout Fish - movie 2026.jpg"),
    imdbRating: 5.5,
  },
  {
    id: "the-physician-ii",
    title: "The Physician II",
    tagline: "A journey out of darkness into light.",
    genre: "Drama History Mystery",
    duration: 142,
    rating: "PG-13",
    year: 2025,
    director: "Philipp Stölzl",
    cast: ["Tom Payne", "Emily Cox", "Aidan Gillen", "Liam Cunningham"],
    synopsis:
    "Fleeing Isfahan, physician Rob Cole arrives in London to spread his medical knowledge, but soon becomes entangled in the political intrigues of the royal court.",
    posterFile: "the physician ll 2025.jpg",
    posterUrl: buildMoviePackagePosterUrl("the physician ll 2025.jpg"),
    imdbRating: 6.3,
  },
  {
    id: "star-bright",
    title: "Star Bright",
    tagline: "One wish, one chance to live a whole lifetime in one night.",
    genre: "Fantasy Adventure Drama",
    duration: 148,
    rating: "PG-13",
    year: 2026,
    director: "Francesco Lucente",
    cast: ["Alexandra Dowling", "Diego Boneta", "John Rhys-Davies", "Ted Levine"],
    synopsis:
    "When a star falls to Earth during an eclipse, a young woman becomes the guardian of its living light, joining forces with allies to protect it from dangerous pursuers.",
    posterFile: "Starbright 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("Starbright 2026.jpg"),
    imdbRating: 3.7,
  },
  {
    id: "pizza-movie",
    title: "Pizza Movie",
    tagline: "Some things never go outta style.",
    genre: "Comedy",
    duration: 97,
    rating: "R",
    year: 2026,
    director: "Nick Kocher, Brian McElhaney",
    cast: ["Gaten Matarazzo", "Sean Giambrone", "Lulu Wilson", "Jack Martin"],
    synopsis:
    "Two college students take a mysterious drug and must navigate a chaotic series of hallucinations to retrieve a pizza in their dorm lobby.",
    posterFile: "pizza movie 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("pizza movie 2026.jpg"),
    imdbRating: 5.8,
  },
  {
    id: "normal",
    title: "Normal",
    tagline: "Small town. Big secret.",
    genre: "Action Thriller",
    duration: 90,
    rating: "R",
    year: 2026,
    director: "Ben Wheatley",
    cast: ["Bob Odenkirk", "Henry Winkler", "Lena Headey", "Billy MacLellan"],
    synopsis:
    "An interim sheriff in a small town uncovers a web of secrets and violent chaos following a local bank robbery.",
    posterFile: "normal 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("normal 2026.jpg"),
    imdbRating: 6.3,
  },
  {
    id: "how-to-make-a-killing",
    title: "How to make a killing",
    tagline: "Heir today, gone tomorrow.",
    genre: "Action Thriller",
    duration: 105,
    rating: "R",
    year: 2026,
    director: "John Patton",
    cast: ["Glen Powell", "Margaret Qualley", "Jessica Henwick", "Ed Harris"],
    synopsis:
    "A disowned heir plots to eliminate the wealthy relatives standing between him and his multi-billion-dollar inheritance.",
    posterFile: "How to make a killing 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("How to make a killing 2026.jpg"),
    imdbRating: 6.5,
  },
  {
    id: "death-cycle",
    title: "Death Cycle",
    tagline: "When you hear the rumble, it's too late.",
    genre: "Horror Thriller",
    duration: 80,
    rating: "NR",
    year: 2026,
    director: "Gabriel Carrer",
    cast: ["Kristen Kaster", "Sasha Ormond", "Matthew Ninaber", "Justin Bott"],
    synopsis:
    "After the death of her sister, a woman is visited by a man looking to solve a series of murders committed by a motorcycle-riding maniac.",
    posterFile: "death cycle 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("death cycle 2026.jpg"),
    imdbRating: 6.1,
  },
  {
    id: "balls-up",
    title: "Anti Christ",
    tagline: "Chaos Reigns.",
    genre: "Horror Drama Thriller",
    duration: 104,
    rating: "NR",
    year: 2009,
    director: "Lars von Trier",
    cast: ["Willem Dafoe", "Charlotte Gainsbourg", "Storm Acheche Sahlstrøm"],
    synopsis:
    "A grieving couple retreats to a remote cabin in the woods following the death of their young son, only to descend into a nightmare of madness, violence, and chaos.",
    posterFile: "Antichrist 1974 .jpg",
    posterUrl: buildMoviePackagePosterUrl("Antichrist 1974 .jpg"),
    imdbRating: 6.5,
  },
  {
    id: "danvi-ci-code",
    title: "The Da Vinci Code",
    tagline: "Break The Code",
    genre: "Mystery Thriller",
    duration: 149,
    rating: "PG-13",
    year: 2006,
    director: "Ron Howard",
    cast: ["Tom Hanks", "Audrey Tautou", "Ian McKellen", "Alfred Molina"],
    synopsis:
    "A murder in Paris' Louvre Museum and cryptic clues in Leonardo da Vinci's paintings lead a symbologist to discover a religious mystery guarded by a secret society for two millennia.",
    posterFile: "The Da Vinci Code 2009.jpg",
    posterUrl: buildMoviePackagePosterUrl("The Da Vinci Code 2009.jpg"),
    imdbRating: 6.6,
  },
  {
    id: "annabelle-comes-home",
    title: "Annabelle Comes Home",
    tagline: "Evil comes home.",
    genre: "Horror Mystery Thriller",
    duration: 106,
    rating: "R",
    year: 2019,
    director: "Gary Dauberman",
    cast: ["Mckenna Grace", "Madison Iseman", "Katie Sarife", "Patrick Wilson"],
    synopsis:
    "Demonologists Ed and Lorraine Warren lock the possessed Annabelle doll in their artifacts room, where it awakens evil spirits that target their young daughter and her friends.",
    posterFile: "Annabelle Comes Home 2019.jpg",
    posterUrl: buildMoviePackagePosterUrl("Annabelle Comes Home 2019.jpg"),
    imdbRating: 5.9,
  },
  {
    id: "500-days-of-summer",
    title: "500 Days of Summer",
    tagline: "Boy meets girl. Boy falls in love. Girl doesn't.",
    genre: "Comedy Drama Romance",
    duration: 95,
    rating: "PG-13",
    year: 2009,
    director: "Marc Webb",
    cast: ["Joseph Gordon-Levitt", "Zooey Deschanel", "Geoffrey Arend", "Chloë Grace Moretz"],
    synopsis:
    "A hopeless romantic greeting card writer reflects on his 500-day relationship with a woman who does not believe in true love.",
    posterFile: "500 Days of Summer 2009.jpg",
    posterUrl: buildMoviePackagePosterUrl("500 Days of Summer 2009.jpg"),
    imdbRating: 7.6,
  },
  {
    id: "what-happened-to-monday",
    title: "What Happened to Monday?",
    tagline: "Seven days. Seven sisters. One cause.",
    genre: "Action Sci-Fi Thriller",
    duration: 123,
    rating: "R",
    year: 2017,
    director: "Tommy Wirkola",
    cast: ["Noomi Rapace", "Glenn Close", "Willem Dafoe", "Marwan Kenzari"],
    synopsis:
    "In a world with a strict one-child policy, seven identical sisters living under a shared identity must investigate the sudden disappearance of one of their own while avoiding government detection.",
    posterFile: "what happened to monday 2017.jpg",
    posterUrl: buildMoviePackagePosterUrl("what happened to monday 2017.jpg"),
    imdbRating: 6.8,
  },
  {
    id: "joker",
    title: "Joker",
    tagline: "Put on a happy face.",
    genre: "Crime Drama Thriller",
    duration: 122,
    rating: "R",
    year: 2019,
    director: "Todd Phillips",
    cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz", "Frances Conroy"],
    synopsis:
    "A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain in a decaying Gotham City.",
    posterFile: "joker 2019.jpg",
    posterUrl: buildMoviePackagePosterUrl("joker 2019.jpg"),
    imdbRating: 8.3,
  },
  {
    id: "host",
    title: "Host",
    tagline: "Six friends. One zoom call.",
    genre: "Horror Mystery Thriller",
    duration: 57,
    rating: "R",
    year: 2020,
    director: "Rob Savage",
    cast: ["Haley Bishop", "Jemma Moore", "Emma Louise Webb", "Radina Drandova"],
    synopsis:
    "Six friends hire a medium to hold a séance over Zoom during lockdown, inadvertently inviting a demonic spirit into their homes.",
    posterFile: "host 2020.JPG",
    posterUrl: buildMoviePackagePosterUrl("host 2020.JPG"),
    imdbRating: 6.5,
  },
  {
    id: "evil-dead-burn",
    title: "Evil Dead Burn",
    tagline: "Burn in Hell.",
    genre: "Horror Action Thriller",
    duration: 96,
    rating: "R",
    year: 2026,
    director: "Sébastien Vaniček",
    cast: ["Hunter Doohan", "Luciane Buchanan", "Souheila Yacoub", "Tandi Wright"],
    synopsis:
    "After the loss of her husband, a young widow seeks solace with her in-laws at their secluded family home, only for them to transform into Deadites.",
    posterFile: "evil dead burn 2026.JPG",
    posterUrl: buildMoviePackagePosterUrl("evil dead burn 2026.JPG"),
    imdbRating: 6.5,
  },
  {
    id: "primate",
    title: "Primate",
    tagline: "Something's wrong with Ben.",
    genre: "Horror Thriller",
    duration: 89,
    rating: "R",
    year: 2026,
    director: "Johannes Roberts",
    cast: ["Johnny Sequoyah", "Jessica Alexander", "Troy Kotsur", "Victoria Wyant"],
    synopsis:
    "A young woman visiting her family home is trapped with her friends when their adopted pet chimpanzee contracts rabies and becomes violently aggressive.",
    posterFile: "primate 2025.JPG",
    posterUrl: buildMoviePackagePosterUrl("primate 2025.JPG"),
    imdbRating: 5.8,
  },
  {
    id: "the-devils-mouth",
    title: "The Devil's Mouth",
    tagline: "Getaway just got a whole new meaning.",
    genre: "Horror Thriller",
    duration: 106,
    rating: "PG-13",
    year: 2026,
    director: "Jeff Wadlow",
    cast: ["Kathryn Newton", "Lana Condor", "Gavin Casalegno", "Nico Hiraga"],
    synopsis:
    "A group of friends on vacation in Thailand explore a remote cave system, only to become trapped inside with a deadly bull shark.",
    posterFile: "the devil's mouth 2026.JPG",
    posterUrl: buildMoviePackagePosterUrl("the devil's mouth 2026.JPG"),
    imdbRating: 4.8,
  },
  {
    id: "its-whats-inside",
    title: "It's What's Inside",
    tagline: "Trust no one. Not even yourself.",
    genre: "Comedy Horror Sci-Fi Thriller",
    duration: 103,
    rating: "R",
    year: 2024,
    director: "Greg Jardin",
    cast: ["Brittany O'Grady", "James Morosini", "Gavin Leatherwood", "Nina Bloomgarden"],
    synopsis:
    "A group of friends gather for a pre-wedding party that descends into a psychological nightmare when an estranged guest arrives with a mysterious body-swapping game.",
    posterFile: "it's what's inside 2024.JPG",
    posterUrl: buildMoviePackagePosterUrl("it's what's inside 2024.JPG"),
    imdbRating: 6.6,
  },
  {
    id: "black-box",
    title: "Black Box",
    tagline: "Your memories are a lie.",
    genre: "Horror Sci-Fi Thriller",
    duration: 100,
    rating: "NR",
    year: 2020,
    director: "Emmanuel Osei-Kuffour Jr.",
    cast: ["Mamoudou Athie", "Phylicia Rashad", "Amanda Christine", "Tosin Morohunfola"],
    synopsis:
    "After losing his memory and wife in a car accident, a single father undergoes an experimental treatment that causes him to question his identity.",
    posterFile: "black box 2026.JPG",
    posterUrl: buildMoviePackagePosterUrl("black box 2026.JPG"),
    imdbRating: 6.2,
  },
  {
    id: "five-nights-at-freddys-2",
    title: "Five Nights at Freddy's 2",
    tagline: "Anyone can survive five nights. This time, there will be no second chances. ",
    genre: "Horror Mystery Thriller",
    duration: 104,
    rating: "PG-13",
    year: 2025,
    director: "Emma Tammi",
    cast: ["Josh Hutcherson", "Elizabeth Lail", "Piper Rubio", "Matthew Lillard"],
    synopsis:
    "A year after surviving the events at Freddy Fazbear's Pizza, Mike, Abby, and Vanessa face new nightmarish threats when Abby is lured back to a pizzeria containing a new set of dangerous animatronics.",
    posterFile: "five nights at freddy's 2 2025.JPG",
    posterUrl: buildMoviePackagePosterUrl("five nights at freddy's 2 2025.JPG"),
    imdbRating: 5.1,
  },
  {
    id: "the-shining",
    title: "The Shining",
    tagline: "A Masterpiece of Modern Horror ",
    genre: "Horror Mystery Thriller",
    duration: 144,
    rating: "R",
    year: 1980,
    director: "Stanley Kubrick",
    cast: ["Jack Nicholson", "Shelley Duvall", "Danny Lloyd", "Scatman Crothers"],
    synopsis:
    "A family heads to an isolated hotel for the winter where an evil spiritual presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.",
    posterFile: "the shining 1980.JPG",
    posterUrl: buildMoviePackagePosterUrl("the shining 1980.JPG"),
    imdbRating: 8.4,
  },
  {
    id: "insidious-the-last-key",
    title: "Insidious: The Last Key",
    tagline: "Fear Comes Home.",
    genre: "Horror Mystery Thriller",
    duration: 103,
    rating: "PG-13",
    year: 2018,
    director: "Adam Robitel",
    cast: ["Lin Shaye", "Angus Sampson", "Leigh Whannell", "Tayler Buck"],
    synopsis:
    "Parapsychologist Dr. Elise Rainier faces her most fearsome and personal haunting yet in her childhood family home.",
    posterFile: "insidious the last key 2018.JPG",
    posterUrl: buildMoviePackagePosterUrl("insidious the last key 2018.JPG"),
    imdbRating: 5.7,
  },
  {
    id: "insidious",
    title: "Insidious",
    tagline: "It's not the house that's haunted.",
    genre: "Horror Mystery Thriller",
    duration: 97,
    rating: "PG-13",
    year: 2010,
    director: "James Wan",
    cast: ["Patrick Wilson", "Rose Byrne", "Ty Simpkins", "Lin Shaye"],
    synopsis:
    "A family looks to prevent evil spirits from trapping their comatose son in a realm called The Further after discovering dark spirits are haunting him rather than their home.",
    posterFile: "insidious 2010.JPG",
    posterUrl: buildMoviePackagePosterUrl("insidious 2010.JPG"),
    imdbRating: 6.8,
  },
  {
    id: "insidious-the-red-door",
    title: "Insidious: The Red Door",
    tagline: "It Ends Where It All Began.",
    genre: "Horror Mystery Thriller",
    duration: 107,
    rating: "PG-13",
    year: 2023,
    director: "Patrick Wilson",
    cast: ["Patrick Wilson", "Rose Byrne", "Ty Simpkins", "Sinclair Daniel"],
    synopsis:
    "To put their demons to rest once and for all, Josh Lambert and his college-aged son Dalton must go deeper into The Further than ever before, facing their family's dark past and terrifying new horrors lurking behind the red door.",
    posterFile: "insidious the red door 2023.JPG",
    posterUrl: buildMoviePackagePosterUrl("insidious the red door 2023.JPG"),
    imdbRating: 5.5,
  },
  {
    id: "insidious-chapter-2",
    title: "Insidious: Chapter 2",
    tagline: "It Will Take What You Love Most.",
    genre: "Horror Mystery Thriller",
    duration: 106,
    rating: "PG-13",
    year: 2013,
    director: "James Wan",
    cast: ["Patrick Wilson", "Rose Byrne", "Barbara Hershey", "Lin Shaye"],
    synopsis:
    "The Lambert family seeks to uncover the childhood secret that leaves them dangerously connected to the spirit world as supernatural forces continue to haunt them.",
    posterFile: "insidious chapter 2 2013.JPG",
    posterUrl: buildMoviePackagePosterUrl("insidious chapter 2 2013.JPG"),
    imdbRating: 6.6,
  },
  {
    id: "oculus",
    title: "Oculus",
    tagline: "You see what it wants you to see.",
    genre: "Horror Mystery",
    duration: 104,
    rating: "R",
    year: 2013,
    director: "Mike Flanagan",
    cast: ["Karen Gillan", "Brenton Thwaites", "Katee Sackhoff", "Rory Cochrane"],
    synopsis:
    "A young woman attempts to exonerate her brother of murder by proving that a haunted antique mirror is responsible for their family's death and downfall.",
    posterFile: "oculus 2013.JPG",
    posterUrl: buildMoviePackagePosterUrl("oculus 2013.JPG"),
    imdbRating: 6.6,
  },
  {
    id: "heretic",
    title: "Heretic",
    tagline: "Question Everything",
    genre: "Horror Thriller",
    duration: 111,
    rating: "R",
    year: 2024,
    director: "Scott Beck & Bryan Woods",
    cast: ["Hugh Grant", "Sophie Thatcher", "Chloe East", "Topher Grace"],
    synopsis:
    "Two young missionaries become ensnared in a deadly game of cat and mouse when they knock on the door of the diabolical Mr. Reed.",
    posterFile: "heretic 2024.jpg",
    posterUrl: buildMoviePackagePosterUrl("heretic 2024.jpg"),
    imdbRating: 7,
  },
  {
    id: "leviticus",
    title: "Leviticus",
    tagline: "It will never stop.",
    genre: "Horror Supernatural",
    duration: 88,
    rating: "R",
    year: 2026,
    director: "Adrian Chiarella",
    cast: ["Joe Bird", "Stacy Clausen", "Mia Wasikowska", "Jeremy Blewitt"],
    synopsis:
    "After two teenage boys in a religious community are subjected to an exorcism, they are pursued by a terrifying supernatural entity that takes the form of their deepest desires.",
    posterFile: "leviticus 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("leviticus 2026.jpg"),
    imdbRating: 6.4,
  },
  {
    id: "saccharine",
    title: "Saccharine",
    tagline: "What's eating you?",
    genre: "Horror Thriller",
    duration: 112,
    rating: "R",
    year: 2026,
    director: "Natalie Erika James",
    cast: ["Midori Francis", "Danielle Macdonald", "Madeleine Madden", "Robert Taylor"],
    synopsis:
    "A medical student struggling with weight loss takes diet pills made from human ashes, triggering terrifying supernatural encounters with a hungry ghost.",
    posterFile: "Saccharine (2026).jpg",
    posterUrl: buildMoviePackagePosterUrl("Saccharine (2026).jpg"),
    imdbRating: 6.5,
  },
  {
    id: "annabelle-creation",
    title: "Annabelle Creation",
    tagline: "You don't know the real story.",
    genre: "Horror Mystery Thriller",
    duration: 109,
    rating: "R",
    year: 2017,
    director: "David F. Sandberg",
    cast: ["Stephanie Sigman", "Talitha Bateman", "Lulu Wilson", "Anthony LaPaglia"],
    synopsis:
    "A dollmaker and his wife welcome a nun and several girls from a shuttered orphanage into their home, where they become the target of the dollmaker's possessed creation, Annabelle.",
    posterFile: "Annabelle creation.JPG",
    posterUrl: buildMoviePackagePosterUrl("Annabelle creation.JPG"),
    imdbRating: 6.5,
  },
  {
    id: "the-conjuring-2",
    title: "The Conjuring 2",
    tagline: "The next true story from the case files of Ed and Lorraine Warren.",
    genre: "Horror Mystery Thriller",
    duration: 134,
    rating: "R",
    year: 2016,
    director: "James Wan",
    cast: ["Vera Farmiga", "Patrick Wilson", "Madison Wolfe", "Frances O'Connor"],
    synopsis:
    "Ed and Lorraine Warren travel to North London to help a single mother and her children who are plagued by a malicious poltergeist.",
    posterFile: "The conjuring 2.JPG",
    posterUrl: buildMoviePackagePosterUrl("The conjuring 2.JPG"),
    imdbRating: 7.3,
  },
  {
    id: "the-conjuring",
    title: "The Conjuring",
    tagline: "Evil Loves Innocence.",
    genre: "Horror Mystery Thriller",
    duration: 112,
    rating: "R",
    year: 2013,
    director: "James Wan",
    cast: ["Vera Farmiga", "Patrick Wilson", "Lili Taylor", "Ron Livingston"],
    synopsis:
    "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their Rhode Island farmhouse.",
    posterFile: "The conjuring .JPG",
    posterUrl: buildMoviePackagePosterUrl("The conjuring .JPG"),
    imdbRating: 7.5,
  },
  {
    id: "the-nun",
    title: "The Nun",
    tagline: "Witness the Darkest Chapter in The Conjuring Universe.",
    genre: "Horror Mystery Thriller",
    duration: 96,
    rating: "R",
    year: 2018,
    director: "Corin Hardy",
    cast: ["Demián Bichir", "Taissa Farmiga", "Jonas Bloquet", "Bonnie Aarons"],
    synopsis:
    "A priest with a haunted past and a novice on the threshold of her final vows are sent by the Vatican to investigate the suicide of a young nun in 1952 Romania, where they uncover an unholy secret and confront a malevolent force.",
    posterFile: "The nun.JPG",
    posterUrl: buildMoviePackagePosterUrl("The nun.JPG"),
    imdbRating: 5.4,
  },
  {
    id: "the-nun-ii",
    title: "The Nun II",
    tagline: "Evil returns. The battle is not over.",
    genre: "Horror Mystery Thriller",
    duration: 110,
    rating: "R",
    year: 2023,
    director: "Michael Chaves",
    cast: ["Taissa Farmiga", "Jonas Bloquet", "Storm Reid", "Anna Popplewell"],
    synopsis:
    "In 1956 France, Sister Irene comes face-to-face once again with the demonic force Valak after a priest is violently murdered.",
    posterFile: "The nun 2.JPG",
    posterUrl: buildMoviePackagePosterUrl("The nun 2.JPG"),
    imdbRating: 5.6,
  },
  {
    id: "avatar-the-legend-of-aang-the-last-airbender",
    title: "Avatar: The Legend of Aang - The Last Airbender",
    tagline: "Four Nations. One Destiny.",
    genre: "Animation Action Adventure Fantasy",
    duration: 103,
    rating: "PG",
    year: 2026,
    director: "Lauren Montgomery",
    cast: ["Eric Nam", "Dionne Quan", "Jessica Matten", "Román Zaragoza"],
    synopsis:
    "An adult Avatar Aang and his friends embark on a quest to locate an ancient power that could restore the Air Nation before it falls into dangerous hands.",
    posterFile: "Avatar aang the last airbender.JPG",
    posterUrl: buildMoviePackagePosterUrl("Avatar aang the last airbender.JPG"),
    imdbRating: 4.0,
  },
  {
    id: "fifty-shades-of-grey",
    title: "Fifty Shades of Grey",
    tagline: "Mr. Grey will see you now.",
    genre: "Romance Drama",
    duration: 125,
    rating: "R",
    year: 2015,
    director: "Sam Taylor-Johnson",
    cast: ["Dakota Johnson", "Jamie Dornan", "Jennifer Ehle", "Marcia Gay Harden"],
    synopsis:
    "A literature student begins a complex, sexually charged relationship with a wealthy, tormented businessman.",
    posterFile: "Fifty shades of grey.JPG",
    posterUrl: buildMoviePackagePosterUrl("Fifty shades of grey.JPG"),
    imdbRating: 4.2,
  },
  {
    id: "get-out",
    title: "Get Out",
    tagline: "Just because you're invited, doesn't mean you're welcome.",
    genre: "Horror Mystery Thriller",
    duration: 104,
    rating: "R",
    year: 2017,
    director: "Jordan Peele",
    cast: ["Daniel Kaluuya", "Allison Williams", "Catherine Keener", "Bradley Whitford"],
    synopsis:
    "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
    posterFile: "Get out.JPG",
    posterUrl: buildMoviePackagePosterUrl("Get out.JPG"),
    imdbRating: 7.8,
  },
  {
    id: "her-private-hell",
    title: "Her Private Hell",
    tagline: "She gave everything to succeed.",
    genre: "Horror Thriller Drama",
    duration: 109,
    rating: "R",
    year: 2026,
    director: "Nicolas Winding Refn",
    cast: ["Sophie Thatcher", "Charles Melton", "Havana Rose Liu", "Kristine Froseth"],
    synopsis:
    "A young woman searches for her father as a mysterious mist engulfs a city and unleashes a deadly entity.",
    posterFile: "Her private hell .JPG",
    posterUrl: buildMoviePackagePosterUrl("Her private hell .JPG"),
    imdbRating: 4.9,
  },
  {
    id: "soulm8te",
    title: "Soulm8te",
    tagline: "AI love can be a real killer",
    genre: "Sci-Fi Horror Thriller",
    duration: 99,
    rating: "R",
    year: 2026,
    director: "Kate Dolan",
    cast: ["Lily Sullivan", "David Rysdahl", "Claudia Doumit", "Arty Froushan"],
    synopsis:
    "A grieving man acquires an AI android to cope with the loss of his wife, but attempting to program her into a truly sentient partner inadvertently turns her into a deadly soulmate.",
    posterFile: "Soulm8te.JPG",
    posterUrl: buildMoviePackagePosterUrl("Soulm8te.JPG"),
    imdbRating: 5.8,
  },
  {
    id: "the-boy-in-the-striped-pyjamas",
    title: "The Boy in the Striped Pyjamas",
    tagline: "Lines may divide us, but hope will unite us.",
    genre: "Drama War History",
    duration: 94,
    rating: "PG-13",
    year: 2008,
    director: "Mark Herman",
    cast: ["Asa Butterfield", "Jack Scanlon", "Vera Farmiga", "David Thewlis"],
    synopsis:
    "During World War II, the young son of a Nazi concentration camp commandant forms a secret friendship with a Jewish boy captive on the other side of the camp's barbed-wire fence.",
    posterFile: "The boy in the striped pajamas .JPG",
    posterUrl: buildMoviePackagePosterUrl("The boy in the striped pajamas .JPG"),
    imdbRating: 7.7,
  },
  {
    id: "the-drama",
    title: "The Drama",
    tagline: "You Are Cordially Invited.",
    genre: "Sci-Fi Horror Thriller",
    duration: 105,
    rating: "R",
    year: 2026,
    director: "Kristoffer Borgli",
    cast: ["Zendaya", "Robert Pattinson", "Alana Haim", "Mamoudou Athie"],
    synopsis:
    "A couple's impending wedding is thrown into chaos when a dark revelation about the bride's past comes to light.",
    posterFile: "The drama.JPG",
    posterUrl: buildMoviePackagePosterUrl("The drama.JPG"),
    imdbRating: 7.2,
  },
  {
    id: "us",
    title: "Us",
    tagline: "We are our own worst enemy.",
    genre: "Horror Thriller",
    duration: 116,
    rating: "R",
    year: 2019,
    director: "Jordan Peele",
    cast: ["Lupita Nyong'o", "Winston Duke", "Elisabeth Moss", "Tim Heidecker"],
    synopsis:
    "A family's serene beach vacation turns into a terrifying fight for survival when doppelgängers of themselves appear and begin to terrorize them.",
    posterFile: "Us.JPG",
    posterUrl: buildMoviePackagePosterUrl("Us.JPG"),
    imdbRating: 6.8,
  },
  {
    id: "whiplash",
    title: "Whiplash",
    tagline: "The road to greatness can take you to the edge.",
    genre: "Drama Music",
    duration: 106,
    rating: "R",
    year: 2014,
    director: "Damien Chazelle",
    cast: ["Miles Teller", "J.K. Simmons", "Melissa Benoist", "Paul Reiser"],
    synopsis:
    "A young jazz drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    posterFile: "Whiplash.JPG",
    posterUrl: buildMoviePackagePosterUrl("Whiplash.JPG"),
    imdbRating: 8.5,
  },
  {
    id: "interstellar",
    title: "Interstellar",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    genre: "Sci-Fi Adventure Drama",
    duration: 169,
    rating: "PG-13",
    year: 2014,
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    synopsis:
    "When Earth becomes uninhabitable in the future, a team of ex-NASA pilots and scientists travels through a wormhole in search of a new habitable planet for humanity.",
    posterFile: "Interstellar.JPG",
    posterUrl: buildMoviePackagePosterUrl("Interstellar.JPG"),
    imdbRating: 8.7,
  },
  {
    id: "fifty-shades-freed",
    title: "Fifty shades freed",
    tagline: "Don't Miss the Climax",
    genre: "Drama Romance Thriller",
    duration: 105,
    rating: "R",
    year: 2018,
    director: "James Foley",
    cast: ["Dakota Johnson", "Jamie Dornan", "Eric Johnson", "Rita Ora"],
    synopsis:
    "Newlyweds Anastasia and Christian barely begin to settle into postnuptial bliss when a vengeful figure from the past threatens their life together.",
    posterFile: "Fifty shades freed.JPG",
    posterUrl: buildMoviePackagePosterUrl("Fifty shades freed.JPG"),
    imdbRating: 4.6,
  },
  {
    id: "72-hours",
    title: "72 hours",
    tagline: "The night is young, he isn't.",
    genre: "Comedy Action",
    duration: 105,
    rating: "R",
    year: 2026,
    director: "Tim Story",
    cast: ["Kevin Hart", "Marcello Hernández", "Mason Gooding", "Teyana Taylor"],
    synopsis:
    "A 40-year-old marketing executive accidentally gets added to a Gen-Z group chat and joins their wild bachelor party in Miami to better understand his target audience and save his career.",
    posterFile: "72 HOURS (2026).jpg",
    posterUrl: buildMoviePackagePosterUrl("72 HOURS (2026).jpg"),
    imdbRating: 5.4,
  },
  {
    id: "minions-and-monsters",
    title: "Minions and Monsters",
    tagline: "Hollywood has a monster problem.",
    genre: "Animation Comedy Adventure ",
    duration: 90,
    rating: "PG",
    year: 2026,
    director: "Pierre Coffin",
    cast: ["Allison Janney", "Christoph Waltz", "Jeff Bridges", "Jesse Eisenberg"],
    synopsis:
    "The Minions conquer Hollywood and accidentally unleash real monsters, forcing them to band together to save the planet.",
    posterFile: "Minions And Monsters 2026.jpg",
    posterUrl: buildMoviePackagePosterUrl("Minions And Monsters 2026.jpg"),
    imdbRating: 6.4,
  },
  {
    id: "the-last-house",
    title: "The Last House",
    tagline: "How long can you survive?",
    genre: "Sci-Fi Horror Thriller",
    duration: 118,
    rating: "PG-13",
    year: 2026,
    director: "Louis Leterrier",
    cast: ["Greta Lee", "Wagner Moura", "Riley Chung", "Noah Alexander Sosnowski"],
    synopsis:
    "A family of four is mysteriously sealed inside their home and must work together to survive against dwindling resources and a mysterious threat.",
    posterFile: "the last house.jpg",
    posterUrl: buildMoviePackagePosterUrl("the last house.jpg"),
    imdbRating: 5.5,
  },
];

// -----------------------------------------------------------------------------
// Cinema Room Data
// -----------------------------------------------------------------------------

export const rooms: CinemaRoom[] = [
  {
    id: "room-1",
    name: "The Velvet",
    description:
      "Our signature screening room, elegantly appointed with plush velvet seating and a 30-foot screen. Perfect for group screenings with friends, family, or colleagues who appreciate quality cinema in a refined setting.",
    capacity: 20,
    features: [
      "30-foot 4K laser projection screen",
      "Dolby Atmos 7.1 surround sound",
      "Velvet reclining seats with armrests",
      "Dimmable ambient lighting",
      "Dedicated concierge service",
      "Complimentary popcorn and soft drinks",
      "Wireless device charging at every seat",
    ],
    pricePerHour: 150,
    imageUrl: "/rooms/room-1.jpg",
    tier: "standard",
  },
  {
    id: "room-2",
    name: "The Crimson Lounge",
    description:
      "An intimate premium theater where deep crimson leather meets polished brass. Designed for discerning groups who demand more than a screen -- they demand an experience. Every detail has been curated, from the hand-selected wine list to the acoustically perfect walls.",
    capacity: 12,
    features: [
      "35-foot 4K HDR laser projection",
      "Dolby Atmos 9.1.4 immersive audio",
      "Italian leather power recliners",
      "Private bar with sommelier-curated wine list",
      "Gourmet snack menu by executive chef",
      "Climate-controlled to individual preference",
      "Personal attendant throughout screening",
      "Starlight ceiling with adjustable mood lighting",
    ],
    pricePerHour: 300,
    imageUrl: "/rooms/room-2.jpg",
    tier: "premium",
  },
  {
    id: "room-3",
    name: "The Director's Cut",
    description:
      "Reserved for those who treat cinema as sacred ritual. This VIP suite features museum-quality acoustics, a curated film library, and seating designed by a Milan-based furniture atelier. Every screening here feels like a world premiere.",
    capacity: 8,
    features: [
      "40-foot IMAX-grade dual laser projection",
      "Dolby Atmos 11.1.6 reference-grade audio",
      "Bespoke Italian leather daybeds with cashmere throws",
      "Private chef service with multi-course tasting menu",
      "Rare whisky and champagne lounge",
      "Acoustic isolation rated to studio standard",
      "Pre-screening film introduction by in-house cinephile",
      "Complimentary valet parking",
      "Heated floors with imported marble",
    ],
    pricePerHour: 500,
    imageUrl: "/rooms/room-3.jpg",
    tier: "vip",
  },
  {
    id: "room-4",
    name: "The Noir Suite",
    description:
      "The pinnacle of private cinema. Designed for couples and the most intimate of gatherings, Kino Screens is less a screening room and more a private world. With only four seats arranged around a stunning curved screen, every frame feels like it was projected for you alone.",
    capacity: 4,
    features: [
      "Curved 35-foot OLED micro-LED wall",
      "Dolby Atmos 13.1.8 bespoke speaker array",
      "Four hand-crafted chaise lounges with heated massage",
      "Private sommelier and mixologist on call",
      "Seven-course cinematic dining experience",
      "Hermès blankets and silk pillows",
      "Scent diffusion system matched to film genre",
      "Zero-gravity reclining positions",
      "24-karat gold accent lighting fixtures",
      "Soundproofed to absolute silence rating",
      "Post-screening car service included",
    ],
    pricePerHour: 800,
    imageUrl: "/rooms/room-4.jpg",
    tier: "ultra",
  },
];

// -----------------------------------------------------------------------------
// Screening Data
// -----------------------------------------------------------------------------

function futureDate(daysFromNow: number, hour: number, minute: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const screenings: Screening[] = [
  // Day 1
  {
    id: "screening-1",
    filmId: "film-1",
    roomId: "room-1",
    dateTime: futureDate(1, 19, 0),
    availableSeats: 14,
    totalSeats: 20,
    pricePerSeat: 45,
  },
  {
    id: "screening-2",
    filmId: "film-3",
    roomId: "room-2",
    dateTime: futureDate(1, 20, 30),
    availableSeats: 8,
    totalSeats: 12,
    pricePerSeat: 75,
  },
  // Day 2
  {
    id: "screening-3",
    filmId: "film-8",
    roomId: "room-4",
    dateTime: futureDate(2, 21, 0),
    availableSeats: 2,
    totalSeats: 4,
    pricePerSeat: 200,
  },
  {
    id: "screening-4",
    filmId: "film-5",
    roomId: "room-1",
    dateTime: futureDate(2, 18, 30),
    availableSeats: 18,
    totalSeats: 20,
    pricePerSeat: 45,
  },
  // Day 3
  {
    id: "screening-5",
    filmId: "film-2",
    roomId: "room-3",
    dateTime: futureDate(3, 20, 0),
    availableSeats: 5,
    totalSeats: 8,
    pricePerSeat: 120,
  },
  {
    id: "screening-6",
    filmId: "film-7",
    roomId: "room-2",
    dateTime: futureDate(3, 19, 30),
    availableSeats: 10,
    totalSeats: 12,
    pricePerSeat: 75,
  },
  // Day 5
  {
    id: "screening-7",
    filmId: "film-4",
    roomId: "room-1",
    dateTime: futureDate(5, 19, 0),
    availableSeats: 20,
    totalSeats: 20,
    pricePerSeat: 45,
  },
  {
    id: "screening-8",
    filmId: "film-6",
    roomId: "room-4",
    dateTime: futureDate(5, 21, 30),
    availableSeats: 3,
    totalSeats: 4,
    pricePerSeat: 200,
  },
  // Day 7
  {
    id: "screening-9",
    filmId: "film-1",
    roomId: "room-3",
    dateTime: futureDate(7, 20, 0),
    availableSeats: 6,
    totalSeats: 8,
    pricePerSeat: 120,
  },
  {
    id: "screening-10",
    filmId: "film-3",
    roomId: "room-1",
    dateTime: futureDate(7, 18, 0),
    availableSeats: 16,
    totalSeats: 20,
    pricePerSeat: 45,
  },
  // Day 10
  {
    id: "screening-11",
    filmId: "film-8",
    roomId: "room-2",
    dateTime: futureDate(10, 20, 30),
    availableSeats: 12,
    totalSeats: 12,
    pricePerSeat: 75,
  },
  {
    id: "screening-12",
    filmId: "film-6",
    roomId: "room-3",
    dateTime: futureDate(10, 21, 0),
    availableSeats: 7,
    totalSeats: 8,
    pricePerSeat: 120,
  },
  // Day 12
  {
    id: "screening-13",
    filmId: "film-2",
    roomId: "room-4",
    dateTime: futureDate(12, 20, 0),
    availableSeats: 4,
    totalSeats: 4,
    pricePerSeat: 200,
  },
  {
    id: "screening-14",
    filmId: "film-5",
    roomId: "room-2",
    dateTime: futureDate(12, 19, 0),
    availableSeats: 9,
    totalSeats: 12,
    pricePerSeat: 75,
  },
];

// -----------------------------------------------------------------------------
// Testimonial Data
// -----------------------------------------------------------------------------

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Courage Amayo",
    avatar: "/avatars/testimonial-1.jpg",
    role: "Full-Stack Developer & Philanthropist",
    quote:
      "Kino Screens redefined what I thought a private screening could be. The scent diffusion alone -- sandalwood and cedar for the noir we watched -- transformed the entire experience. It was not watching a film. It was inhabiting one.",
    rating: 5,
  },
  {
    id: "testimonial-2",
    name: "Sure Omoruyi",
    avatar: "/avatars/testimonial-2.jpg",
    role: "CEO, Open Shore",
    quote:
      "I have screened dailies in studios across two continents, and Kino Screens rivals any of them. The acoustics are museum-grade, the projection is flawless, and the tasting menu they served between reels was genuinely Michelin-worthy. This is where cinema lives now.",
    rating: 5,
  },
  {
    id: "testimonial-3",
    name: "Precious Chioma",
    avatar: "/avatars/testimonial-3.jpg",
    role: "Nurse, University of Benin Medical Center",
    quote:
      "We hosted our nurses wrap party in The Kino Lounge. Twelve of us, a private sommelier, and a film none of us had seen. It was the most memorable evening we have had as a team. The attention to detail is extraordinary -- they even matched the ambient lighting to the film's color palette.",
    rating: 5,
  },
  {
    id: "testimonial-4",
    name: "Jonathan & Priya Osawa",
    avatar: "/avatars/testimonial-4.jpg",
    role: "Private Members since March 2026",
    quote:
      "We celebrated our anniversary at Kino Screens with a seven-course dinner and our favorite film. From the moment we arrived -- valet, champagne, the low hum of the lobby -- everything felt impossibly elegant. We have been back four times since. It has become our ritual.",
    rating: 5,
  },
];

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

export function getFilmById(id: string): Film | undefined {
  return films.find((film) => film.id === id);
}

export function getRoomById(id: string): CinemaRoom | undefined {
  return rooms.find((room) => room.id === id);
}

export function getScreeningsByFilm(filmId: string): Screening[] {
  return screenings.filter((screening) => screening.filmId === filmId);
}

export function getScreeningsByRoom(roomId: string): Screening[] {
  return screenings.filter((screening) => screening.roomId === roomId);
}

export function getUpcomingScreenings(): Screening[] {
  const now = new Date().toISOString();
  return screenings
    .filter((screening) => screening.dateTime > now)
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime));
}

export function getFeaturedFilms(): Film[] {
  return films.slice(0, 4);
}

export function getMoviePackageFilmById(id: string): MoviePackageFilm | undefined {
  return moviePackageFilms.find((film) => film.id === id);
}

export function getFeaturedMoviePackageFilms(): MoviePackageFilm[] {
  return moviePackageFilms.slice(0, 6);
}
