import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FoodOffer} from "../../entities/foodOffer";
import {FoodMenuItem} from "../../entities/foodMenuItem";
import {FoodOfferDetails} from "../../entities/foodOfferDetails";

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

}
