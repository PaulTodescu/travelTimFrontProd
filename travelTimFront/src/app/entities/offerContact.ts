export class OfferContact {
  email: string | undefined;
  phoneNumber: string | undefined;

  constructor(email: string | undefined, phoneNumber: string | undefined) {
    this.email = email;
    this.phoneNumber = phoneNumber;
  }
}
