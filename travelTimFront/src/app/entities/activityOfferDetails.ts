import {Business} from "./business";
import {UserDetailsDTO} from "./UserDetailsDTO";
import {Ticket} from "./ticket";

export interface ActivityOfferDetails {
  id: number;
  business: Business;
  title: string;
  address: string;
  city: string;
  description: string;
  user: UserDetailsDTO;
  tickets: Ticket[];
}
