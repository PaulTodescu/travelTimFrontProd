import {Ticket} from "./ticket";

export interface ActivityOfferForBusinessPageDTO {
  id: number;
  title: string;
  tickets: Ticket[];
  image: string;
}
