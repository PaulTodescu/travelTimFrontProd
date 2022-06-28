import {LodgingUtility} from "./lodgingUtility";

export interface PhysicalPersonLodgingOfferEditDTO {
  id: number;
  title: string;
  address: string;
  city: string;
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
