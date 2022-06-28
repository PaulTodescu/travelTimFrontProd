import {DaySchedule} from "./daySchedule";

export interface BusinessDetailsDTO {
  id: number;
  name: string;
  address: string;
  city: string;
  websiteLink: string;
  facebookLink: string;
  twitterLink: string;
  schedule: DaySchedule[];
}
