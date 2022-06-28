import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {LodgingOfferDTO} from "../../entities/lodgingOfferDTO";
import {FoodOfferDTO} from "../../entities/foodOfferDTO";
import {AttractionOfferDTO} from "../../entities/attractionOfferDTO";
import {ActivityOfferDTO} from "../../entities/activityOfferDTO";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {

  private apiUrl = 'https://traveltimback.herokuapp.com/';

  constructor(private http: HttpClient) { }

  public getRecommendedLodgingOffersForUsers(): Observable<LodgingOfferDTO[]>{
    return this.http.get<LodgingOfferDTO[]>(`${this.apiUrl}/recommendations/lodging/user-type`)
  }

  public getRecommendedLodgingOffersForBusinesses(): Observable<LodgingOfferDTO[]>{
    return this.http.get<LodgingOfferDTO[]>(`${this.apiUrl}/recommendations/lodging/business-type`)
  }

  public getRecommendedFoodOffers(): Observable<FoodOfferDTO[]>{
    return this.http.get<FoodOfferDTO[]>(`${this.apiUrl}/recommendations/food`)
  }

  public getRecommendedAttractionOffersForBusinesses(): Observable<AttractionOfferDTO[]>{
    return this.http.get<AttractionOfferDTO[]>(`${this.apiUrl}/recommendations/attractions/business-type`)
  }

  public getRecommendedAttractionOffersForUsers(): Observable<AttractionOfferDTO[]>{
    return this.http.get<AttractionOfferDTO[]>(`${this.apiUrl}/recommendations/attractions/user-type`)
  }

  public getRecommendedActivityOffersForBusinesses(): Observable<ActivityOfferDTO[]>{
    return this.http.get<ActivityOfferDTO[]>(`${this.apiUrl}/recommendations/activities/business-type`)
  }

  public getRecommendedActivityOffersForUsers(): Observable<ActivityOfferDTO[]>{
    return this.http.get<ActivityOfferDTO[]>(`${this.apiUrl}/recommendations/activities/user-type`)
  }
}
