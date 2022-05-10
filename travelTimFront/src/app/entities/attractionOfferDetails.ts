import {Business} from "./business";
import {Ticket} from "./ticket";
import {UserDetailsDTO} from "./UserDetailsDTO";
import {OfferContact} from "./offerContact";

export interface AttractionOfferDetails {
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
