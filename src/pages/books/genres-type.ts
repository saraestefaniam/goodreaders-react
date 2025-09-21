export const VALID_GENRES = [
  "fantasy",
  "science-fiction",
  "romance",
  "thriller",
  "non-fiction",
  "historical",
  "mystery",
] as const;

export type Genre = (typeof VALID_GENRES)[number];