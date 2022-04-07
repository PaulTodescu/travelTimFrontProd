export class Business{
  id: number;
  name: string;
  city: string;
  address: string;
  cui: string;

  constructor(id: number, name: string, city: string, address: string, cui: string){
    this.id = id;
    this.name = name;
    this.city = city;
    this.address = address;
    this.cui = cui;
  }
}
