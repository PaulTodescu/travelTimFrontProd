export class FoodMenuItem {
  id: number | undefined;
  name: string;
  weight: number;
  price: number;

  constructor(name: string, weight: number, price: number) {
    this.name = name;
    this.weight = weight;
    this.price = price;
  }
}
