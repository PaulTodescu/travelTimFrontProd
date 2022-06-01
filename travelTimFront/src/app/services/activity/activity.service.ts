import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ActivityOffer} from "../../entities/activityOffer";
import {ActivityOfferDetails} from "../../entities/activityOfferDetails";
import {ActivityOfferEditDTO} from "../../entities/activityOfferEditDTO";
import {OfferContact} from "../../entities/offerContact";
import {ActivityOffersStatistics} from "../../entities/activityOffersStatistics";

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public addActivityOffer(activityOffer: ActivityOffer): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/activity`, activityOffer);
  }

  public getActivityOfferById(offerId: number): Observable<ActivityOffer>{
    return this.http.get<ActivityOffer>(`${this.apiUrl}/activity/${offerId}`);
  }

  public getActivityOfferDetails(offerId: number): Observable<ActivityOfferDetails>{
    return this.http.get<ActivityOfferDetails>(`${this.apiUrl}/activity/${offerId}/details`);
  }

  public deleteActivityOffer(offerId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/activity/${offerId}`);
  }

  public getActivityOfferForEdit(offerId: number): Observable<ActivityOfferEditDTO>{
    return this.http.get<ActivityOfferEditDTO>(`${this.apiUrl}/activity/edit/get/${offerId}`);
  }

  public editActivityOffer(offer: ActivityOfferEditDTO, offerId: number){
    return this.http.put<void>(`${this.apiUrl}/activity/${offerId}`, offer);
  }

  public addContactDetails(offerId: number, contactDetails: OfferContact){
    return this.http.put<void>(`${this.apiUrl}/activity/${offerId}/contact/add`, contactDetails);
  }

  public editContactDetails(offerId: number, contactDetails: OfferContact){
    return this.http.put<void>(`${this.apiUrl}/activity/${offerId}/contact/edit`, contactDetails);
  }

  public getContactDetails(offerId: number): Observable<OfferContact>{
    return this.http.get<OfferContact>(`${this.apiUrl}/activity/${offerId}/contact`);
  }

  public changeActivityOfferStatus(offerId: number, status: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<void>(`${this.apiUrl}/activity/${offerId}/status/change`, JSON.stringify(status), httpOptions);
  }

  public getActivityOffersStatistics(): Observable<ActivityOffersStatistics>{
    return this.http.get<ActivityOffersStatistics>(`${this.apiUrl}/activity/statistics`);
  }

}
