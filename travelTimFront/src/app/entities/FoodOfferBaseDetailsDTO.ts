import {BusinessDTO} from "./businessDTO";

export interface FoodOfferBaseDetailsDTO {
  id: number;
  business: BusinessDTO;
  createdAt: string;
  image: string;
}
