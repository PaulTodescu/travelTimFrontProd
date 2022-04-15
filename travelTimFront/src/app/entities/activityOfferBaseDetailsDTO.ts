import {BusinessDTO} from "./businessDTO";

export interface ActivityOfferBaseDetailsDTO {
  id: number;
  title: string;
  address: string;
  city: string;
  business: BusinessDTO | undefined;
  createdAt: string;
  image: string;
}
