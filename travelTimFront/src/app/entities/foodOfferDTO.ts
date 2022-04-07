import {Business} from "./business";

export interface FoodOfferDTO {
  id: number;
  business: Business;
  createdAt: string;
  image: string;
}
