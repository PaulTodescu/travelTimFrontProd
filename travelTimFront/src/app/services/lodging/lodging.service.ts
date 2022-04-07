import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PhysicalPersonLodgingOffer} from "../../entities/physicalPersonLodgingOffer";
import {LegalPersonLodgingOffer} from "../../entities/legalPersonLodgingOffer";
import {LodgingUtility} from "../../entities/lodgingUtility";
import {LegalPersonLodgingOfferBaseDetailsDTO} from "../../entities/legalPersonLodgingOfferBaseDetailsDTO";

@Injectable({
  providedIn: 'root'
})
export class LodgingService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public addPhysicalPersonLodgingOffer(lodgingOffer: PhysicalPersonLodgingOffer): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/lodging/physical`, lodgingOffer);
  }

  public addLegalPersonLodgingOffer(lodgingOffer: LegalPersonLodgingOffer): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/lodging/legal`, lodgingOffer);
  }

  public addLodgingUtilities(lodgingOfferId: number, lodgingOfferServices: LodgingUtility[]): Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/lodging/${lodgingOfferId}/utilities`, lodgingOfferServices);
  }

  public getPhysicalLodgingOfferById(offerId: number, currency: string): Observable<PhysicalPersonLodgingOffer>{
    let params: HttpParams = new HttpParams().set('currency', currency);
    return this.http.get<PhysicalPersonLodgingOffer>(`${this.apiUrl}/lodging/physical/${offerId}`, {params: params});
  }

  public getLegalLodgingOfferById(offerId: number): Observable<LegalPersonLodgingOfferBaseDetailsDTO>{
    return this.http.get<LegalPersonLodgingOfferBaseDetailsDTO>(`${this.apiUrl}/lodging/legal/${offerId}`);
  }

}
