import {FoodMenuItem} from "./foodMenuItem";

export class FoodMenuCategory {
  id: number;
  name: string;
  foodMenuItems: FoodMenuItem[];

  constructor(id: number, name: string, foodMenuItems: FoodMenuItem[]) {
    this.id = id;
    this.name = name;
    this.foodMenuItems = foodMenuItems;
  }
}
