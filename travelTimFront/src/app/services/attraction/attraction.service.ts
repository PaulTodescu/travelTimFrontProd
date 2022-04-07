import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AttractionOffer} from "../../entities/attractionOffer";
import {AttractionOfferDetails} from "../../entities/attractionOfferDetails";

@Injectable({
  providedIn: 'root'
})
export class AttractionService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public addAttractionOffer(attractionOffer: AttractionOffer): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/attraction`, attractionOffer);
  }

  public getAttractionOfferById(offerId: number): Observable<AttractionOfferDetails>{
    return this.http.get<AttractionOfferDetails>(`${this.apiUrl}/attraction/${offerId}`);
  }
}
