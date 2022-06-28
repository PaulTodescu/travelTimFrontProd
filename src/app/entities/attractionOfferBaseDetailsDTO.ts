import {BusinessDTO} from "./businessDTO";

export interface AttractionOfferBaseDetailsDTO {
  id: number;
  title: string;
  address: string;
  city: string;
  status: string;
  business: BusinessDTO;
  createdAt: string;
  image: string;
}
