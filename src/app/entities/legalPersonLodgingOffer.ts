import {Business} from "./business";
import {LodgingUtility} from "./lodgingUtility";

export class LegalPersonLodgingOffer {

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

  constructor(business: Business, nrRooms: number, nrBathrooms: number,
              nrSingleBeds: number, nrDoubleBeds: number, floor: number, price: number, currency: string,
              description: string, utilities: LodgingUtility[]) {
    this.business = business;
    this.nrRooms = nrRooms;
    this.nrBathrooms = nrBathrooms;
    this.nrSingleBeds = nrSingleBeds;
    this.nrDoubleBeds = nrDoubleBeds;
    this.floor = floor;
    this.price = price;
    this.currency = currency;
    this.description = description;
    this.utilities = utilities;
  }
}
