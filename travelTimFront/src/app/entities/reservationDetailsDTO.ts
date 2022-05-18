import {LodgingOfferForReservationDetailsDTO} from "./lodgingOfferForReservationDetailsDTO";

export interface ReservationDetailsDTO {
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  totalPrice: number;
  currency: string;
  nrNights: number;
  createdAt: string;
  lodgingOffer: LodgingOfferForReservationDetailsDTO;
  providerName: string;
  providerEmail: string;
  providerPhone: string;
  address: string;
  city: string;
}
