import {Business} from "./business";

export interface LodgingOfferDTO {
  id: number;
  business: Business | undefined;
  nrLodgingOffers: number | undefined;
  title: string | undefined;
  address: string | undefined;
  city: string | undefined;
  createdAt: string;
  price: number;
  image: string;
}
