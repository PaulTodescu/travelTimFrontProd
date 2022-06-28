import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CategoryDTO} from "../../entities/categoryDTO";
import {Category} from "../../entities/category";
import {LodgingOfferDTO} from "../../entities/lodgingOfferDTO";
import {FoodOfferDTO} from "../../entities/foodOfferDTO";
import {AttractionOfferDTO} from "../../entities/attractionOfferDTO";
import {ActivityOfferDTO} from "../../entities/activityOfferDTO";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'https://traveltimback.herokuapp.com';

  constructor(private http: HttpClient) { }

  public getCategories(): Observable<CategoryDTO[]>{
    return this.http.get<CategoryDTO[]>(`${this.apiUrl}/category/all`);
  }

  public getCategoryById(categoryId: number): Observable<Category>{
    return this.http.get<Category>(`${this.apiUrl}/category/${categoryId}`);
  }

  public getLodgingOffers(): Observable<LodgingOfferDTO[]>{
    return this.http.get<LodgingOfferDTO[]>(`${this.apiUrl}/category/offers/lodging`)
  }

  public getFoodOffers(): Observable<FoodOfferDTO[]>{
    return this.http.get<FoodOfferDTO[]>(`${this.apiUrl}/category/offers/food`)
  }

  public getAttractionOffers(): Observable<AttractionOfferDTO[]>{
    return this.http.get<AttractionOfferDTO[]>(`${this.apiUrl}/category/offers/attractions`)
  }

  public getActivityOffers(): Observable<ActivityOfferDTO[]>{
    return this.http.get<ActivityOfferDTO[]>(`${this.apiUrl}/category/offers/activities`)
  }
}
