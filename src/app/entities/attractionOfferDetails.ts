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
  status: string;
  nrViews: number,
  business: Business;
  tickets: Ticket[];
  offerContact: OfferContact;
  user: UserDetailsDTO;
}
