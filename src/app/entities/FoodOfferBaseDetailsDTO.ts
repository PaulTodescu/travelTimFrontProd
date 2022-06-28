import {BusinessDTO} from "./businessDTO";

export interface FoodOfferBaseDetailsDTO {
  id: number;
  business: BusinessDTO;
  status: string;
  createdAt: string;
  image: string;
}
