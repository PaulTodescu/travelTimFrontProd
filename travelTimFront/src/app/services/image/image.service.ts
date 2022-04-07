import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public uploadProfileImage(image: File | undefined): Observable<void>{
    const formData = new FormData();
    // @ts-ignore
    formData.append("image", image);
    return this.http.post<void>(`${this.apiUrl}/image/user`, formData);
  }

  public getProfileImageForLoggedInUser(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/image/user`, {responseType: 'text' as 'json'});
  }

  public getUserImage(userId: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/image/user/${userId}`, {responseType: 'text' as 'json'});
  }

  public uploadBusinessImage(image: File | undefined, businessId: number): Observable<void>{
    const formData = new FormData();
    // @ts-ignore
    formData.append("image", image);
    return this.http.post<void>(`${this.apiUrl}/image/business/${businessId}`, formData);
  }

  public getBusinessImage(businessId: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/image/business/${businessId}`, {responseType: 'text' as 'json'});
  }

  public uploadOfferImages(offerId: number, offerType: string, images: File[]): Observable<void>{
    const formData = new FormData();
    // @ts-ignore
    formData.append("offerType", offerType);
    for (let i=0; i<images?.length; i++){
      formData.append("images", images[i]);
    }
    return this.http.post<void>(`${this.apiUrl}/image/offer/${offerId}`, formData);
  }

  public getBusinessImagePath(businessId: number){
    return this.http.get<any>(`${this.apiUrl}/image/business/${businessId}/name`, {responseType: 'text' as 'json'});
  }

  public getOfferImages(offerId: number, offerType: string): Observable<any>{
    let params = new HttpParams().set('offerType', offerType);
    return this.http.get<any>(`${this.apiUrl}/image/offer/${offerId}`, {params: params});
  }

}
