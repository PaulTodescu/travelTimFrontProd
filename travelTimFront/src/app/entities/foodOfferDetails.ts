import {UserContactDTO} from "./UserContactDTO";
import {Business} from "./business";
import {FoodMenuCategory} from "./foodMenuCategory";
import {OfferContact} from "./offerContact";

export interface FoodOfferDetails {
  id: number;
  user: UserContactDTO;
  business: Business;
  description: string;
  offerContact: OfferContact;
  foodMenuCategories: FoodMenuCategory[];
  status: string;
  nrViews: number;
}
