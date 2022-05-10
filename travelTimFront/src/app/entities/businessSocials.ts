export class BusinessSocials {
  websiteLink: string | undefined;
  facebookLink: string | undefined;
  twitterLink: string | undefined;

  constructor(websiteLink: string | undefined, facebookLink: string | undefined, twitterLink: string | undefined) {
    this.websiteLink = websiteLink;
    this.facebookLink = facebookLink;
    this.twitterLink = twitterLink;
  }
}
