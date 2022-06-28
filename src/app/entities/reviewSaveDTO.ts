export class ReviewSaveDTO {
  review: string;
  rating: number;

  constructor(review: string, rating: number) {
    this.review = review;
    this.rating = rating;
  }
}
