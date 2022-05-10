import {DaySchedule} from "./daySchedule";

export class Business{
  id: number;
  name: string;
  city: string;
  address: string;
  email: string | undefined;
  phoneNumber: string | undefined;
  websiteLink: string | undefined;
  facebookLink: string | undefined;
  twitterLink: string | undefined;
  schedule: DaySchedule[];

  constructor(id: number, name: string, city: string,
              address: string, email: string | undefined, phoneNumber: string | undefined,
              websiteLink: string | undefined, facebookLink: string | undefined,
              twitterLink: string | undefined, schedule: DaySchedule[]){
    this.id = id;
    this.name = name;
    this.city = city;
    this.address = address;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.websiteLink = websiteLink;
    this.facebookLink = facebookLink;
    this.twitterLink = twitterLink;
    this.schedule = schedule;
  }
}
