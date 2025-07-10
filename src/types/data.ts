export interface User {
  userId: number;
  gender: string;
  age: number;
  occupation: number;
  zipCode: string;
}

export interface Rating {
  userId: number;
  movieId: number;
  rating: number;
  timestamp: number;
}

export interface ProcessedResult {
  userId: number;
  age: number;
  gender: string;
  ratingCount: number;
}

export interface UserRatingCount {
  userId: number;
  count: number;
}