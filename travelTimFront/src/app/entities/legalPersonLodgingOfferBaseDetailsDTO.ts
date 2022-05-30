import {OfferContact} from "./offerContact";
import {Business} from "./business";

export interface LegalPersonLodgingOfferBaseDetailsDTO {
  id: number;
  description: string;
  offerContact: OfferContact;
  business: Business;
  nrViews: number;
}
