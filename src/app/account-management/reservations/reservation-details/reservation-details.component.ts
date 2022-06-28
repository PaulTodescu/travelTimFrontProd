import {Component, Inject, OnInit} from '@angular/core';
import {ReservationService} from "../../../services/reservation/reservation.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DaySchedule} from "../../../entities/daySchedule";
import {ReservationDetailsDTO} from "../../../entities/reservationDetailsDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {OfferReservation} from "../../../entities/offerReservation";

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.scss']
})
export class ReservationDetailsComponent implements OnInit {

  reservation: OfferReservation | undefined;

  constructor(
    private reservationService: ReservationService,
    @Inject(MAT_DIALOG_DATA) public data: {
      reservationId: number}) { }

  public getReservationDetails(): void {
    if (this.data.reservationId) {
      this.reservationService.getReservationDetails(this.data.reservationId).subscribe(
        (response: OfferReservation) => {
          this.reservation = response;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  ngOnInit(): void {
    this.getReservationDetails();
  }

}
