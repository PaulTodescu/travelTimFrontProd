import {Business} from "./business";
import {Ticket} from "./ticket";

export class ActivityOffer{
  id: number | undefined;
  business: Business | undefined;
  title: string;
  address: string;
  city: string;
  description: string;
  tickets: Ticket[] | undefined;

  constructor(business: Business, title: string, address: string, city: string, description: string, tickets: Ticket[]) {
    this.business = business;
    this.title = title;
    this.address = address;
    this.city = city;
    this.description = description;
    this.tickets = tickets;
  }

}
