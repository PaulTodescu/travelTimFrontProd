import {BusinessDTO} from "./businessDTO";

export interface LodgingOfferBaseDetailsDTO {
  id: number;
  title: string | undefined;
  business: BusinessDTO | undefined;
  address: string;
  city: string;
  nrRooms: number;
  nrSingleBeds: number;
  nrDoubleBeds: number;
  createdAt: string;
  price: number;
  currency: string;
  image: string;

}
