export class BusinessContactDetails {
  email: string;
  phoneNumber: string;
  websiteLink: string;
  facebookLink: string;
  twitterLink: string;

  constructor(email: string, phoneNumber: string, websiteLink: string, facebookLink: string,
              twitterLink: string) {
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.websiteLink = websiteLink;
    this.facebookLink = facebookLink;
    this.twitterLink = twitterLink;
  }

}
