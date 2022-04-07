import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Business} from "../../entities/business";
import {LegalPersonLodgingOfferDetailsDTO} from "../../entities/legalPersonLodgingOfferDetailsDTO";

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public addBusiness(business: Business): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/business`, business);
  }

  public getBusinessById(businessId: number): Observable<Business>{
    return this.http.get<Business>(`${this.apiUrl}/business/${businessId}`);
  }

  public editBusiness(business: Business, businessId: number){
    return this.http.put<Business>(`${this.apiUrl}/business/${businessId}`, business);
  }

  public deleteBusiness(businessId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/business/${businessId}`);
  }

  public getLodgingOffers(businessId: number, currency: string): Observable<LegalPersonLodgingOfferDetailsDTO[]>{
    let params: HttpParams = new HttpParams().set('currency', currency);
    return this.http.get<LegalPersonLodgingOfferDetailsDTO[]>(
      `${this.apiUrl}/business/${businessId}/offers/lodging`, {params: params});
  }

}
