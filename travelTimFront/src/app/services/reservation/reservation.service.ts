import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OfferReservation} from "../../entities/offerReservation";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public addReservation(userId: number, offerId: number, reservation: OfferReservation): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reservation/user/${userId}/offer/${offerId}`, reservation);
  }
}
