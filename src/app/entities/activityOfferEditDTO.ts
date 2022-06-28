import {Business} from "./business";
import {Ticket} from "./ticket";

export interface ActivityOfferEditDTO {
  id: number;
  title: string;
  address: string;
  description: string;
  city: string;
  business: Business;
  tickets: Ticket[];
}
