import {LodgingUtility} from "./lodgingUtility";
import {Business} from "./business";

export interface LegalPersonLodgingOfferEditDTO {
  id: number;
  business: Business;
  nrRooms: number;
  nrBathrooms: number;
  nrSingleBeds: number;
  nrDoubleBeds: number;
  floor: number;
  price: number;
  currency: string;
  description: string;
  utilities: LodgingUtility[];
}
