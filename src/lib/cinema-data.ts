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

export const films: Film[] = [
  {
    id: "film-1",
    title: "Midnight in Vermillion",
    tagline: "Some colors only bleed after dark.",
    genre: "Neo-Noir Thriller",
    duration: 128,
    rating: "R",
    year: 2025,
    director: "Lena Marchetti",
    cast: ["Julian Arevalo", "Camille Duval", "Oscar Thorne", "Rina Kobayashi"],
    synopsis:
      "A reclusive art restorer discovers a hidden painting beneath a centuries-old masterpiece, only to realize the portrait depicts a murder that hasn't happened yet. As she traces the brushstrokes to their origin, she is drawn into the orbit of a charismatic gallery owner whose past is as layered as the canvases he sells. Set against the rain-soaked streets of a European capital, Midnight in Vermillion is a fever dream of obsession, deception, and the things we bury beneath beauty.",
    posterUrl: "/posters/film-1.jpg",
    backdropUrl: "/backdrops/film-1.jpg",
    trailerUrl: "",
    imdbRating: 8.1,
  },
  {
    id: "film-2",
    title: "The Last Projection",
    tagline: "The final reel was never meant to be seen.",
    genre: "Psychological Drama",
    duration: 142,
    rating: "PG-13",
    year: 2025,
    director: "Marcus Hale",
    cast: ["Theodore Crane", "Isabelle Moreau", "Vincent Lau", "Anya Petrov"],
    synopsis:
      "When the last remaining projectionist at a crumbling Art Deco cinema discovers an unmarked 35mm reel hidden in the walls, he screens it alone at midnight. What unfolds on screen mirrors his own life with impossible accuracy -- memories he never shared, conversations no one recorded. As the film plays on, the boundary between the projection and reality begins to dissolve. A haunting meditation on memory, loss, and the stories we tell ourselves to survive.",
    posterUrl: "/posters/film-2.jpg",
    backdropUrl: "/backdrops/film-2.jpg",
    trailerUrl: "",
    imdbRating: 7.9,
  },
  {
    id: "film-3",
    title: "Velvet Requiem",
    tagline: "Every note hides a confession.",
    genre: "Musical Thriller",
    duration: 136,
    rating: "R",
    year: 2024,
    director: "Sofia Bergström",
    cast: ["Eleanora Voss", "Damien Leclerc", "Haruto Tanaka", "Clara Solis"],
    synopsis:
      "A once-celebrated opera singer retreats to a fog-shrouded coastal estate after a scandal destroys her career. When a mysterious composer arrives with an unfinished requiem that seems to channel her deepest secrets, she must decide whether to lend her voice to music that could either redeem or destroy her. As rehearsals intensify, the other musicians begin to unravel, and the requiem takes on a life of its own. A lush, unsettling exploration of art, ambition, and the cost of perfection.",
    posterUrl: "/posters/film-3.jpg",
    backdropUrl: "/backdrops/film-3.jpg",
    trailerUrl: "",
    imdbRating: 8.4,
  },
  {
    id: "film-4",
    title: "Shadows of the Foyer",
    tagline: "The grandest stages hide the darkest acts.",
    genre: "Gothic Mystery",
    duration: 119,
    rating: "PG-13",
    year: 2025,
    director: "Edward Blackwell",
    cast: ["Margaret Ashford", "Simon Rourke", "Liesel Brandt", "James Okafor"],
    synopsis:
      "A newly appointed curator at a legendary but financially crumbling theater discovers that every director who staged a production in its main hall over the past century vanished without a trace. Her investigation leads her through hidden corridors, sealed dressing rooms, and a foyer whose gilded mirrors seem to reflect scenes from the wrong decade. Part detective story, part ghost story, Shadows of the Foyer is an atmospheric descent into a building that remembers everything.",
    posterUrl: "/posters/film-4.jpg",
    backdropUrl: "/backdrops/film-4.jpg",
    trailerUrl: "",
    imdbRating: 7.6,
  },
  {
    id: "film-5",
    title: "The Crimson Reel",
    tagline: "What was captured on film was never meant to escape.",
    genre: "Horror Noir",
    duration: 108,
    rating: "R",
    year: 2025,
    director: "Nikolai Voss",
    cast: ["Raphael Quinn", "Maren Dahl", "Yuki Ishikawa", "Selma Ferreira"],
    synopsis:
      "A film archivist specializing in lost horror movies receives an anonymous shipment: six reels of a film believed to have been destroyed in a studio fire in 1962. As she restores and watches each reel, the footage begins to change between viewings -- scenes rearrange, faces shift, and a figure in the background moves closer to the camera with each screening. The Crimson Reel blurs the line between found-footage terror and slow-burn psychological dread.",
    posterUrl: "/posters/film-5.jpg",
    backdropUrl: "/backdrops/film-5.jpg",
    trailerUrl: "",
    imdbRating: 7.8,
  },
  {
    id: "film-6",
    title: "Nocturne for the Departed",
    tagline: "The dead have their own frequency.",
    genre: "Supernatural Drama",
    duration: 131,
    rating: "PG-13",
    year: 2024,
    director: "Aurelie Fontaine",
    cast: ["Caspian Wolfe", "Nadia Orlov", "Felix Andersson", "Priya Sharma"],
    synopsis:
      "A grief-stricken sound engineer discovers that the ambient recordings he makes in abandoned places contain voices -- not random noise, but coherent messages from people who died in those spaces. When he captures a voice he recognizes as his late wife, he becomes obsessed with recording in increasingly dangerous locations. A tender and eerie story about the lengths we go to hold on to the ones we have lost, and the moment we must finally let the silence in.",
    posterUrl: "/posters/film-6.jpg",
    backdropUrl: "/backdrops/film-6.jpg",
    trailerUrl: "",
    imdbRating: 8.2,
  },
  {
    id: "film-7",
    title: "Celluloid Dreams",
    tagline: "The camera sees what we refuse to remember.",
    genre: "Art-House Romance",
    duration: 115,
    rating: "PG-13",
    year: 2025,
    director: "Tomás Herrera",
    cast: ["Vivienne Marchand", "Leo Strand", "Amara Osei", "Sebastian Cross"],
    synopsis:
      "Two strangers meet at a 24-hour film festival in a decaying Parisian cinema. Over the course of one night, they watch five films together, and between each screening, they share fragments of their lives -- half-truths, fabrications, and eventually, devastating honesty. By dawn, they must decide whether the connection forged in the dark of a theater can survive the light of day. An intimate and visually ravishing love letter to cinema itself.",
    posterUrl: "/posters/film-7.jpg",
    backdropUrl: "/backdrops/film-7.jpg",
    trailerUrl: "",
    imdbRating: 8.0,
  },
  {
    id: "film-8",
    title: "The Phantom Screening",
    tagline: "Invitation only. No one remembers being invited.",
    genre: "Surrealist Thriller",
    duration: 124,
    rating: "R",
    year: 2025,
    director: "Ingrid Sable",
    cast: ["Dorian Ashworth", "Katarina Voss", "Miles Adeyemi", "Helena Park"],
    synopsis:
      "Eight strangers receive hand-delivered invitations to a private screening at a cinema that officially closed decades ago. Upon arrival, they find the theater immaculate, as if frozen in its golden age. The film that plays has no title, no credits, and no end -- but each viewer sees a different story, one that exposes the secret they have spent their life concealing. As the night wears on, leaving becomes impossible, and the audience realizes the screening is not entertainment. It is a trial.",
    posterUrl: "/posters/film-8.jpg",
    backdropUrl: "/backdrops/film-8.jpg",
    trailerUrl: "",
    imdbRating: 8.3,
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
      "The pinnacle of private cinema. Designed for couples and the most intimate of gatherings, The Kino Cinema is less a screening room and more a private world. With only four seats arranged around a stunning curved screen, every frame feels like it was projected for you alone.",
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
      "The Kino Cinema redefined what I thought a private screening could be. The scent diffusion alone -- sandalwood and cedar for the noir we watched -- transformed the entire experience. It was not watching a film. It was inhabiting one.",
    rating: 5,
  },
  {
    id: "testimonial-2",
    name: "Sure Omoruyi",
    avatar: "/avatars/testimonial-2.jpg",
    role: "CEO, Open Shore",
    quote:
      "I have screened dailies in studios across two continents, and The Kino Cinema rivals any of them. The acoustics are museum-grade, the projection is flawless, and the tasting menu they served between reels was genuinely Michelin-worthy. This is where cinema lives now.",
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
    name: "Jonathan & Priya Harrington",
    avatar: "/avatars/testimonial-4.jpg",
    role: "Private Members since March 2026",
    quote:
      "We celebrated our anniversary in The Kino Cinema with a seven-course dinner and our favorite film. From the moment we arrived -- valet, champagne, the low hum of the lobby -- everything felt impossibly elegant. We have been back four times since. It has become our ritual.",
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
