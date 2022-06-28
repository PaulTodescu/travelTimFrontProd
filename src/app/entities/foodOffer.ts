import {Business} from "./business";
import {FoodMenuItem} from "./foodMenuItem";

export class FoodOffer {

  id: number | undefined;
  business: Business;
  description: string;
  menu: { [key: string]: FoodMenuItem[] };

  constructor(business: Business, description: string, menu: { [key: string]: FoodMenuItem[] }) {
    this.business = business;
    this.description = description;
    this.menu = menu;
  }

}
