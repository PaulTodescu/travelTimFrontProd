import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {OfferContact} from "../../entities/offerContact";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'https://traveltimback.herokuapp.com';

  constructor(private http: HttpClient) { }

  public setContactDetails(offerId: number, offerType: string, contactDetails: OfferContact){
    return this.http.put<void>(`${this.apiUrl}/contact/${offerType}/${offerId}`, contactDetails);
  }

  public getContactDetails(offerId: number, offerType: string): Observable<OfferContact>{
    return this.http.get<OfferContact>(`${this.apiUrl}/contact/${offerType}/${offerId}`);
  }
}
