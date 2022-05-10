import {Business} from "./business";

export interface LodgingOfferDTO {
  id: number;
  business: Business | undefined;
  nrLodgingOffers: number | undefined;
  title: string | undefined;
  address: string | undefined;
  city: string | undefined;
  nrRooms: number;
  nrSingleBeds: number;
  nrDoubleBeds: number;
  floor: number;
  createdAt: string;
  price: number;
  currency: string;
  image: string;
}
