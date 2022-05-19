import {LodgingUtility} from "./lodgingUtility";

export interface LodgingOfferDetailsForReservationDTO {
  id: number;
  price: number;
  currency: string;
  nrRooms: number;
  nrBathrooms: number;
  nrSingleBeds: number;
  nrDoubleBeds: number;
  floor: number;
  providerName: string;
  providerEmail: string;
  providerPhone: string | undefined;
  offerTitle: string;
  address: string;
  city: string;
  utilities: LodgingUtility[];
}
