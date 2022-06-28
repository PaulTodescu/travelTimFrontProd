import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Business} from "../../entities/business";
import {LegalPersonLodgingOfferDetailsDTO} from "../../entities/legalPersonLodgingOfferDetailsDTO";
import {DaySchedule} from "../../entities/daySchedule";
import {LegalPersonLodgingOfferDTO} from "../../entities/LegalPersonLodgingOfferDTO";
import {FoodOfferIdMenuImageDTO} from "../../entities/foodOfferIdMenuImageDTO";
import {AttractionOfferForBusinessDTO} from "../../entities/attractionOfferForBusinessDTO";
import {ActivityOfferForBusinessPageDTO} from "../../entities/activityOfferForBusinessPageDTO";

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public addBusiness(business: Business): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/business`, business);
  }

  public addBusinessSchedule(businessId: number, schedule: DaySchedule[]): Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/business/${businessId}/schedule`, schedule);
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

  public getLodgingOffersIDs(businessId: number): Observable<number[]>{
    return this.http.get<number[]>(`${this.apiUrl}/business/${businessId}/offers/lodging/ids`);
  }

  public getLodgingOffersForBusinessPage(businessId: number): Observable<LegalPersonLodgingOfferDTO[]>{
    return this.http.get<LegalPersonLodgingOfferDTO[]>(
      `${this.apiUrl}/business/${businessId}/offers/lodging/business-page`);
  }

  public getFoodOffer(businessId: number): Observable<FoodOfferIdMenuImageDTO>{
    return this.http.get<FoodOfferIdMenuImageDTO>(
      `${this.apiUrl}/business/${businessId}/offers/food`);
  }

  public getAttractionOffers(businessId: number): Observable<AttractionOfferForBusinessDTO[]>{
    return this.http.get<AttractionOfferForBusinessDTO[]>(
      `${this.apiUrl}/business/${businessId}/offers/attractions`);
  }

  public getActivityOffers(businessId: number): Observable<ActivityOfferForBusinessPageDTO[]>{
    return this.http.get<ActivityOfferForBusinessPageDTO[]>(
      `${this.apiUrl}/business/${businessId}/offers/activities`);
  }

}
