import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AttractionOffer} from "../../entities/attractionOffer";
import {AttractionOfferDetails} from "../../entities/attractionOfferDetails";
import {AttractionOfferEditDTO} from "../../entities/attractionOfferEditDTO";
import {OfferContact} from "../../entities/offerContact";
import {AttractionOffersStatistics} from "../../entities/attractionOffersStatistics";

@Injectable({
  providedIn: 'root'
})
export class AttractionService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public addAttractionOffer(attractionOffer: AttractionOffer): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/attraction`, attractionOffer);
  }

  public getAttractionOfferById(offerId: number): Observable<AttractionOffer>{
    return this.http.get<AttractionOffer>(`${this.apiUrl}/attraction/${offerId}`);
  }

  public deleteAttractionOffer(offerId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/attraction/${offerId}`);
  }

  public getAttractionOfferDetails(offerId: number): Observable<AttractionOfferDetails>{
    return this.http.get<AttractionOfferDetails>(`${this.apiUrl}/attraction/${offerId}/details`);
  }

  public getAttractionOfferForEdit(offerId: number): Observable<AttractionOfferEditDTO>{
    return this.http.get<AttractionOfferEditDTO>(`${this.apiUrl}/attraction/edit/get/${offerId}`);
  }

  public editAttractionOffer(offer: AttractionOfferEditDTO, offerId: number){
    return this.http.put<void>(`${this.apiUrl}/attraction/${offerId}`, offer);
  }

  public changeAttractionOfferStatus(offerId: number, status: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<void>(`${this.apiUrl}/attraction/${offerId}/status/change`,
      JSON.stringify(status), httpOptions);
  }

  public getAttractionOffersStatistics(): Observable<AttractionOffersStatistics>{
    return this.http.get<AttractionOffersStatistics>(`${this.apiUrl}/attraction/statistics`);
  }

}
