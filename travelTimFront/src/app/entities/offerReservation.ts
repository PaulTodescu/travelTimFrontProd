export class OfferReservation {
  id: number | undefined;
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

  constructor(arrivalDate: string, arrivalTime: string, departureDate: string, firstName: string,
              lastName: string, email: string, phoneNumber: string, totalPrice: number,
              currency: string, nrNights: number) {
    this.arrivalDate = arrivalDate;
    this.arrivalTime = arrivalTime;
    this.departureDate = departureDate;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.totalPrice = totalPrice;
    this.currency = currency;
    this.nrNights = nrNights;
  }
}
