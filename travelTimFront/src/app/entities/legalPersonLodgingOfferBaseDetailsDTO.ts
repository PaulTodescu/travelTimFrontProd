import {BusinessDetailsDTO} from "./businessDetailsDTO";
import {OfferContact} from "./offerContact";

export interface LegalPersonLodgingOfferBaseDetailsDTO {
  id: number;
  description: string;
  offerContact: OfferContact;
  business: BusinessDetailsDTO;
}
