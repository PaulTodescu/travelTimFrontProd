import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ActivityOffer} from "../../entities/activityOffer";
import {ActivityOfferDetails} from "../../entities/activityOfferDetails";

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public addActivityOffer(activityOffer: ActivityOffer): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/activity`, activityOffer);
  }

  public getActivityOfferById(offerId: number): Observable<ActivityOfferDetails>{
    return this.http.get<ActivityOfferDetails>(`${this.apiUrl}/activity/${offerId}`);
  }
}
