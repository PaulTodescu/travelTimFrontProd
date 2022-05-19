import {LodgingUtility} from "./lodgingUtility";
import {UserDetailsDTO} from "./UserDetailsDTO";
import {OfferContact} from "./offerContact";

export interface PhysicalPersonLodgingOfferDetails {
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
  user: UserDetailsDTO;
  offerContact: OfferContact;
  status: string;
}
