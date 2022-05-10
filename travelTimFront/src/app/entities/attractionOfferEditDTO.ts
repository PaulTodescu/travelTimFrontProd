import {Business} from "./business";
import {Ticket} from "./ticket";

export interface AttractionOfferEditDTO {
  id: number;
  title: string;
  address: string;
  description: string;
  city: string;
  business: Business;
  tickets: Ticket[];
}
