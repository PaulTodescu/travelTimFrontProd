import {LodgingUtility} from "./lodgingUtility";
import {UserDetailsDTO} from "./UserDetailsDTO";

export class PhysicalPersonLodgingOffer {
  id: number | undefined;
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
  user: UserDetailsDTO | undefined;

  constructor(title: string, address: string, city: string, nrRooms: number, nrBathrooms: number,
              nrSingleBeds: number, nrDoubleBeds: number, floor: number, price: number, currency: string,
              description: string, utilities: LodgingUtility[]) {
    this.title = title;
    this.address = address;
    this.city = city;
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
