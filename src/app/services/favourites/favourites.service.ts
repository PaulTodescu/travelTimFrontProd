import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FavouriteOffer} from "../../entities/favouriteOffer";
import {FavouriteOfferCategoryId} from "../../entities/favouriteOfferCategoryId";

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  private apiUrl = 'https://traveltimback.herokuapp.com';

  constructor(private http: HttpClient) { }

  public addOfferToFavourites(userId: number, offerId: number, offerCategory: string) {
    return this.http.put(`${this.apiUrl}/favourites/offer/${offerId}/user/${userId}/add?offerCategory=` + offerCategory, {});
  }

  public removeOfferFromFavourites(userId: number, offerId: number, offerCategory: string) {
    let params = new HttpParams()
    params.append('offerCategory', offerCategory);
    return this.http.put(`${this.apiUrl}/favourites/offer/${offerId}/user/${userId}/remove?offerCategory=` + offerCategory, {});
  }

  public getFavouriteOffersForUser(userId: number): Observable<FavouriteOffer[]>{
    return this.http.get<FavouriteOffer[]>(`${this.apiUrl}/favourites/user/${userId}`);
  }

  public getFavouriteOffersCategoryIdForUser(userId: number): Observable<FavouriteOfferCategoryId[]>{
    return this.http.get<FavouriteOfferCategoryId[]>(`${this.apiUrl}/favourites/user/${userId}/category-id`);
  }
}
