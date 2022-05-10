import {FoodMenuCategory} from "./foodMenuCategory";

export interface FoodOfferIdMenuImageDTO {
  id: number;
  foodMenuCategories: FoodMenuCategory[];
  image: string;
}
