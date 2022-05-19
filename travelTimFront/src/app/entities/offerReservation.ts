export class OfferReservation {
  id: number | undefined;
  createdAt: string | undefined;
  arrivalDate: string;
  arrivalTime: string | undefined;
  departureDate: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | undefined;
  totalPrice: number;
  currency: string;
  nrNights: number;
  nrRooms: number;
  nrBathrooms: number;
  nrSingleBeds: number;
  nrDoubleBeds: number;
  floor: number;
  providerName: string;
  providerEmail: string;
  providerPhone: string | undefined;
  offerTitle: string;
  address: string;
  city: string;


  constructor(arrivalDate: string, arrivalTime: string | undefined, departureDate: string,
              firstName: string, lastName: string, email: string, phoneNumber: string | undefined,
              totalPrice: number, currency: string, nrNights: number, nrRooms: number, nrBathrooms: number,
              nrSingleBeds: number, nrDoubleBeds: number, floor: number, providerName: string,
              providerEmail: string, providerPhone: string | undefined, offerTitle: string, address: string,
              city: string) {
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
    this.nrRooms = nrRooms;
    this.nrBathrooms = nrBathrooms;
    this.nrSingleBeds = nrSingleBeds;
    this.nrDoubleBeds = nrDoubleBeds;
    this.floor = floor;
    this.providerName = providerName;
    this.providerEmail = providerEmail;
    this.providerPhone = providerPhone;
    this.offerTitle = offerTitle;
    this.address = address;
    this.city = city;
  }
}
