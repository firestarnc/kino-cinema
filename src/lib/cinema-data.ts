// =============================================================================
// Cinema Data - Mock data for a luxurious private cinema booking app
// =============================================================================

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type FilmRating = "G" | "PG" | "PG-13" | "R" | "NC-17";

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
    genre: "Animation Comedy",
    duration: 100,
    rating: "PG",
    year: 2026,
    director: "Tyree Dillihay",
    cast: ["Caleb McLaughlin", "Gabrielle Union", "Aaron Pierre", "Stephen Curry"],
    synopsis: "A young goat pursues his dream of becoming a professional Roarball player.",
    posterFile: "goat.png",
    posterUrl: buildMoviePackagePosterUrl("goat.png"),
    imdbRating: 7.5,

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
    imdbRating: 7.5,
  },
  {
    id: "themummyle",
    title: "Lee Cronin's The Mummy",
    tagline: "Some Things Are Meant To Stay Buried",
    genre: "Action Horror",
    duration: 134,
    rating: "R",
    year: 2026,
    director: "Lee Cronin",
    cast: ["Jack Reynor", "Laia Costa", "May Calamawy", "Natalie Grace"],
    synopsis:
      "The young daughter of a journalist disappears into the desert without a trace. Eight years later, the broken family is shocked when she is returned to them, as what should be a joyful reunion turns into a living nightmare.",
    posterFile: "themummyle.png",
    posterUrl: buildMoviePackagePosterUrl("themummyle.png"),
    imdbRating: 7.5,  
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
    imdbRating: 8.5,
  },
  {
    id: "beastda",
    title: "Beast",
    tagline: "Legends Are Made In The Cage.",
    genre: "Action Drama",
    duration: 114,
    rating: "R",
    year: 2026,
    director: "Andrew Brenstein, Tyler Atkins",
    cast: ["Russell Crowe", "Mojean Aria", "Daniel MacPherson", "Luke Hemsworth"],
    synopsis:
      "MMA legend Patton James, now a commercial fisherman, is pulled back into the cage when his brother is in danger. Reuniting with his old coach Sammy, he commits to one final fight in ONE Championship against its brutal champion Xavier Grau.",
    posterFile: "beastda.png",
    posterUrl: buildMoviePackagePosterUrl("beastda.png"),
    imdbRating: 7.5,
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
    imdbRating: 7.0,
  },
  {
    id: "furiosamadmx",
    title: "Furiosa: Mad Max Saga",
    tagline: "Her Odyssey Begins.",
    genre: "Sci-Fi Adventure",
    duration: 148,
    rating: "R",
    year: 2024,
    director: "George Miller",
    cast: ["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke", "Alyla Browne"],
    synopsis: "Furiosa fights to return home in a brutal wasteland.",
    posterFile: "furiosamadmx.png",
    posterUrl: buildMoviePackagePosterUrl("furiosamadmx.png"),
    imdbRating: 8.0,
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
    imdbRating: 8.0,
  },
  {
    id: "michaelj",
    title: "Michael",
    tagline: "The King of Pop Lives On.",
    genre: "Biography Drama",
    duration: 127,
    rating: "PG-13",
    year: 2026,
    director: "Antoine Fuqua",
    cast: ["Jaafar Jackson", "Nia Long", "Miles Teller", "Colman Domingo"],
    synopsis:
      "The early life of musician Michael Jackson, from the discovery of his talent as the lead of the Jackson Five to the artist whose creative ambition fueled a pursuit to become the biggest entertainer in the world.",
    posterFile: "michaelj.png",
    posterUrl: buildMoviePackagePosterUrl("michaelj.png"),
    imdbRating: 8.0,
  },
  {
    id: "jurassicworldre",
    title: "Jurassic World: Rebirth",
    tagline: "A New Era Begins.",
    genre: "Sci-Fi Adventure",
    duration: 133,
    rating: "PG-13",
    year: 2025,
    director: "Gareth Edwards",
    cast: ["Scarlett Johansson", "Mahershala Ali", "Jonathan Bailey", "Rupert Friend"],
    synopsis:
      "Five years post-Jurassic World: Dominion (2022), an expedition braves isolated equatorial regions to extract DNA from three massive prehistoric creatures for a groundbreaking medical breakthrough.",
    posterFile: "jurassicworldre.png",
    posterUrl: buildMoviePackagePosterUrl("jurassicworldre.png"),
    imdbRating: 7.5,
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
    imdbRating: 6.5,
  },
  {
    id: "gladiator2",
    title: "Gladiator 2",
    tagline: "What We Do in Life Echoes in Eternity.",
    genre: "Action Historical Drama",
    duration: 148,
    rating: "R",
    year: 2024,
    director: "Ridley Scott",
    cast: ["Paul Mescal", "Pedro Pascal", "Denzel Washington", "Connie Nielsen"],
    synopsis:
      "After his home is conquered by the tyrannical emperors who now lead Rome, Lucius is forced to enter the Colosseum and must look to his past to find strength to return the glory of Rome to its people.",
    posterFile: "gladiator2.png",
    posterUrl: buildMoviePackagePosterUrl("gladiator2.png"),
    imdbRating: 8.0,
  },
  {
    id: "frankeinstein",
    title: "Frankenstein",
    tagline: "A Monster's Tragic Creation.",
    genre: "Horror Fantasy",
    duration: 150,
    rating: "R",
    year: 2025,
    director: "Guillermo del Toro",
    cast: ["Oscar Isaac", "Jacob Elordi", "Mia Goth", "Christoph Waltz"],
    synopsis:
      "Dr. Victor Frankenstein, a brilliant but egotistical scientist, brings a creature to life in a monstrous experiment that ultimately leads to the undoing of both the creator and his tragic creation.",
    posterFile: "frankeinstein.png",
    posterUrl: buildMoviePackagePosterUrl("frankeinstein.png"),
    imdbRating: 7.5,
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
    imdbRating: 7.0,
  },
  {
    id: "wakeupdead",
    title: "Knives Out: Wake Up Dead Man",
    tagline: "The Most Dangerous Case Yet.",
    genre: "Crime Mystery",
    duration: 144,
    rating: "PG-13",
    year: 2025,
    director: "Rian Johnson",
    cast: ["Daniel Craig", "Josh Brolin", "Glenn Close", "Mila Kunis"],
    synopsis:
      "Detective Benoit Blanc teams up with an earnest young priest to investigate a perfectly impossible crime at a small-town church with a dark history.",
    posterFile: "wakeupdead.png",
    posterUrl: buildMoviePackagePosterUrl("wakeupdead.png"),
    imdbRating: 7.5,
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
    imdbRating: 7.5,
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
    imdbRating: 7.5,
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
    imdbRating: 7.5,
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
    imdbRating: 7.5,
  },
  {
    id: "avatarfire",
    title: "Avatar: Fire and Ash",
    tagline: "When the Ashes Fall, Only the Strong will Rise",
    genre: "Action Sci-Fi",
    duration: 197,
    rating: "PG-13",
    year: 2025,
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang"],
    synopsis:
      "Jake and Neytiri's family grapples with grief, encountering a new, aggressive Na'vi tribe, the Ash People, who are led by the fiery Varang, as the conflict on Pandora escalates and a new moral focus emerges.",
    posterFile: "avatarfire.png",
    posterUrl: buildMoviePackagePosterUrl("avatarfire.png"),
    imdbRating: 8.0,
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
