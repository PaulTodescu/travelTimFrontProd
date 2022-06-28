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
  status: string;
  nrViews: number;
  business: Business;
  tickets: Ticket[];
  offerContact: OfferContact;
  user: UserDetailsDTO;
}
