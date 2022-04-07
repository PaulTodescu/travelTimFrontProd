import {Business} from "./business";
import {Ticket} from "./ticket";
import {UserDetailsDTO} from "./UserDetailsDTO";

export interface AttractionOfferDetails {
  id: number;
  business: Business;
  title: string;
  address: string;
  city: string;
  description: string;
  user: UserDetailsDTO;
  tickets: Ticket[];
}
