import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ReviewSaveDTO} from "../../entities/reviewSaveDTO";
import {ReviewDTO} from "../../entities/reviewDTO";
import {ReviewForUserDTO} from "../../entities/reviewForUserDTO";
import {ReviewRatingDTO} from "../../entities/reviewRatingDTO";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public addReviewForUser(userId: number, review: ReviewSaveDTO): Observable<ReviewDTO> {
    return this.http.post<ReviewDTO>(`${this.apiUrl}/review/user/${userId}`, review);
  }

  public addReviewForBusiness(businessId: number, review: ReviewSaveDTO): Observable<ReviewDTO> {
    return this.http.post<ReviewDTO>(`${this.apiUrl}/review/business/${businessId}`, review);
  }

  public getReviewsForTargetUser(userId: number): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.apiUrl}/review/user/${userId}`);
  }

  public getReviewsForBusiness(businessId: number): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.apiUrl}/review/business/${businessId}`);
  }

  public getReviewsForUser(): Observable<ReviewForUserDTO[]> {
    return this.http.get<ReviewForUserDTO[]>(`${this.apiUrl}/review/user`);
  }

  public deleteReview(reviewId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/review/${reviewId}`);
  }

  public getRatingForUser(userId: number): Observable<ReviewRatingDTO> {
    return this.http.get<ReviewRatingDTO>(`${this.apiUrl}/review/user/${userId}/rating`);
  }

  public getRatingForBusiness(businessId: number): Observable<ReviewRatingDTO> {
    return this.http.get<ReviewRatingDTO>(`${this.apiUrl}/review/business/${businessId}/rating`);
  }

}
