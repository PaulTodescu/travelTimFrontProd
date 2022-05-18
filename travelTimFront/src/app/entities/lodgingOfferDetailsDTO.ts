import {LodgingUtility} from "./lodgingUtility";

export interface LodgingOfferDetailsDTO {
  id: number;
  nrRooms: number;
  nrBathrooms: number;
  nrSingleBeds: number;
  nrDoubleBeds: number;
  floor: number;
  price: number;
  currency: string;
  address: string;
  utilities: LodgingUtility[];
}
