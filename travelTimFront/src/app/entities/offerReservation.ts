export class OfferReservation {
  id: number | undefined;
  arrivalDate: Date;
  arrivalTime: string;
  departureDate: Date;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  totalPrice: number;
  currency: string;


  constructor(arrivalDate: Date, arrivalTime: string, departureDate: Date, firstName: string,
              lastName: string, email: string, phoneNumber: string, totalPrice: number, currency: string) {
    this.arrivalDate = arrivalDate;
    this.arrivalTime = arrivalTime;
    this.departureDate = departureDate;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.totalPrice = totalPrice;
    this.currency = currency;
  }
}
