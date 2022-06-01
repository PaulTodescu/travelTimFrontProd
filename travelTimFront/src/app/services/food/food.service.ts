import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {FoodOffer} from "../../entities/foodOffer";
import {FoodMenuItem} from "../../entities/foodMenuItem";
import {FoodOfferDetails} from "../../entities/foodOfferDetails";
import {FoodOfferEditDTO} from "../../entities/foodOfferEditDTO";
import {OfferContact} from "../../entities/offerContact";
import {FoodOffersStatistics} from "../../entities/foodOffersStatistics";

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public addFoodOffer(foodOffer: FoodOffer): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/food`, foodOffer);
  }

  public addFoodMenu(foodOfferId: number, foodMenu: { [key: string]: FoodMenuItem[] }){
    return this.http.put<void>(`${this.apiUrl}/food/${foodOfferId}/menu`, foodMenu);
  }

  public checkIfBusinessHasFoodOffer(businessId: number): Observable<boolean>{
    return this.http.get<boolean>(`${this.apiUrl}/business/${businessId}/foodOffer/check`);
  }

  public getFoodOfferById(offerId: number): Observable<FoodOfferDetails>{
    return this.http.get<FoodOfferDetails>(`${this.apiUrl}/food/${offerId}`);
  }

  public deleteFoodOffer(offerId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/food/${offerId}`);
  }

  public getFoodOfferForEdit(offerId: number): Observable<FoodOfferEditDTO>{
    return this.http.get<FoodOfferEditDTO>(`${this.apiUrl}/food/edit/get/${offerId}`);
  }

  public editFoodOffer(offer: FoodOfferEditDTO, offerId: number){
    return this.http.put<void>(`${this.apiUrl}/food/${offerId}`, offer);
  }

  public getFoodOfferDetails(offerId: number): Observable<FoodOfferDetails>{
    return this.http.get<FoodOfferDetails>(`${this.apiUrl}/food/${offerId}`);
  }

  public addContactDetails(offerId: number, contactDetails: OfferContact){
    return this.http.put<void>(`${this.apiUrl}/food/${offerId}/contact/add`, contactDetails);
  }

  public editContactDetails(offerId: number, contactDetails: OfferContact){
    return this.http.put<void>(`${this.apiUrl}/food/${offerId}/contact/edit`, contactDetails);
  }

  public getContactDetails(offerId: number): Observable<OfferContact>{
    return this.http.get<OfferContact>(`${this.apiUrl}/food/${offerId}/contact`);
  }

  public changeFoodOfferStatus(offerId: number, status: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<void>(`${this.apiUrl}/food/${offerId}/status/change`, JSON.stringify(status), httpOptions);
  }

  public getFoodOffersStatistics(): Observable<FoodOffersStatistics>{
    return this.http.get<FoodOffersStatistics>(`${this.apiUrl}/food/statistics`);
  }

}
