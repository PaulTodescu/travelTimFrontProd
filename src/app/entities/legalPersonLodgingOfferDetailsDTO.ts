import {LodgingUtility} from "./lodgingUtility";
import {OfferContact} from "./offerContact";

export interface LegalPersonLodgingOfferDetailsDTO {

  id: number;
  nrRooms: number;
  nrBathrooms: number;
  nrSingleBeds: number;
  nrDoubleBeds: number;
  floor: number;
  price: number;
  currency: string;
  description: string;
  address: string;
  utilities: LodgingUtility[];
  offerContact: OfferContact
}
