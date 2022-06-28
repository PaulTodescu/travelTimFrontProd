import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OfferReservation} from "../../entities/offerReservation";
import {ReservationDTO} from "../../entities/reservationDTO";
import {ReservationDetailsDTO} from "../../entities/reservationDetailsDTO";
import {LodgingOfferDetailsForReservationDTO} from "../../entities/lodgingOfferDetailsForReservationDTO";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'https://traveltimback.herokuapp.com/';

  constructor(private http: HttpClient) { }

  public addReservation(userId: number, offerId: number, reservation: OfferReservation): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reservation/user/${userId}/offer/${offerId}`, reservation);
  }

  public getReservationsForUser(): Observable<ReservationDTO[]> {
    return this.http.get<ReservationDTO[]>(`${this.apiUrl}/reservation/user/all`);
  }

  public deleteReservation(reservationId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/reservation/${reservationId}`);
  }

  public getReservationDetails(reservationId: number): Observable<OfferReservation> {
    return this.http.get<OfferReservation>(`${this.apiUrl}/reservation/${reservationId}/details`);
  }

  public getLodgingOfferDetailsForReservation(reservationId: number): Observable<LodgingOfferDetailsForReservationDTO> {
    return this.http.get<LodgingOfferDetailsForReservationDTO>(`${this.apiUrl}/reservation/${reservationId}/offer/details`);
  }
}
