import {Ticket} from "./ticket";

export interface AttractionOfferForBusinessDTO {
  id: number;
  title: string;
  tickets: Ticket[];
  image: string;
}
