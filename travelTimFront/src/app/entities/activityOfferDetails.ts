import {Business} from "./business";
import {UserDetailsDTO} from "./UserDetailsDTO";
import {Ticket} from "./ticket";
import {OfferContact} from "./offerContact";

export interface ActivityOfferDetails {
  id: number;
  title: string;
  address: string;
  city: string;
  description: string;
  business: Business;
  tickets: Ticket[];
  offerContact: OfferContact;
  user: UserDetailsDTO;
}
