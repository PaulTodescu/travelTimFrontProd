import {UserContactDTO} from "./UserContactDTO";
import {Business} from "./business";
import {FoodMenuCategory} from "./foodMenuCategory";

export interface FoodOfferDetails {
  id: number;
  user: UserContactDTO;
  business: Business;
  description: string;
  foodMenuCategories: FoodMenuCategory[];
}
