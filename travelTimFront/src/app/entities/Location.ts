export class Location {
  id: number | undefined;
  address: string;
  city: string;

  constructor(address: string, city: string) {
    this.address = address;
    this.city = city;
  }
}
