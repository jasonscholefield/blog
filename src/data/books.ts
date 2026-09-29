export interface Book {
  title: string;
  author: string;
  // Open Library cover reference — most books resolve fine from isbn, but a
  // few editions have no cover indexed under their ISBN even though a cover
  // exists under a specific Open Library cover id; use `coverId` for those
  // (found via https://openlibrary.org/search.json?q=<title>&fields=cover_i).
  // `coverImageUrl` is a last-resort direct URL for books Open Library has
  // no record of at all (e.g. small-press/tie-in titles).
  isbn?: string;
  coverId?: number;
  coverImageUrl?: string;
  current?: boolean;
}

// The user's real reading list/order (from Goodreads), nearest-to-current
// closest to the `current` entry on each side, furthest out at the ends.
// Mark exactly one `current: true` to drive the "Currently reading" caption.
export const books: Book[] = [
  { title: "Carl's Doomsday Scenario", author: 'Matt Dinniman', coverId: 11702962 },
  { title: 'The Gate of the Feral Gods', author: 'Matt Dinniman', coverId: 15232581 },
  { title: 'Celestial Lights', author: 'Cecile Pin', coverId: 15234968 },
  { title: 'This Inevitable Ruin', author: 'Matt Dinniman', coverId: 15142977 },
  { title: 'HIVE', author: 'Dan Abnett', coverImageUrl: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1777625138i/251691459.jpg' },
  { title: 'The Will of the Many', author: 'James Islington', coverId: 15247547 },
  { title: 'The Strength of the Few', author: 'James Islington', coverId: 15150800, current: true },
  { title: 'War in the Museum', author: 'Robert Rath', coverId: 15233380 },
  { title: 'A Parade of Horribles', author: 'Matt Dinniman', coverId: 15221497 },
  { title: 'The Eye of the Bedlam Bride', author: 'Matt Dinniman', coverId: 15231488 },
  { title: "The Butcher's Masquerade", author: 'Matt Dinniman', coverId: 15231958 },
  { title: "The Dungeon Anarchist's Cookbook", author: 'Matt Dinniman', coverId: 15233609 },
  { title: 'Dungeon Crawler Carl', author: 'Matt Dinniman', coverId: 15143022 },
];

export const coverUrl = (book: Book) => {
  if (book.coverImageUrl) return book.coverImageUrl;
  if (book.coverId) return `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`;
  return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
};
