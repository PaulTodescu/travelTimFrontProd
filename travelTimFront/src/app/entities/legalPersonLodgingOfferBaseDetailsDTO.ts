import {Business} from "./business";
import {UserContactDTO} from "./UserContactDTO";

export interface LegalPersonLodgingOfferBaseDetailsDTO {
  id: number;
  description: string;
  user: UserContactDTO;
  business: Business;
}
