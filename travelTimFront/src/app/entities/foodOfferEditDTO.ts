import {Business} from "./business";
import {FoodMenuCategory} from "./foodMenuCategory";

export interface FoodOfferEditDTO {
  id: number;
  business: Business;
  description: string;
  foodMenuCategories: FoodMenuCategory[];
}
