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
    posterUrl: "/posters/film-1.jpg",
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
    posterUrl: "/posters/film-2.jpeg",
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
    posterUrl: "/posters/film-3.jpeg",
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
    posterUrl: "/posters/film-4.jpeg",
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
    posterUrl: "/posters/film-5.jpeg",
    backdropUrl: "/backdrops/film-5.jpeg",
    trailerUrl: "",
    imdbRating: 8.5,
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
    name: "Jonathan & Priya Harrington",
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
