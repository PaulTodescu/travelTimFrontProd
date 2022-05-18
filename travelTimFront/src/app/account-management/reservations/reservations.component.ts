import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {ReservationService} from "../../services/reservation/reservation.service";
import {ReservationDTO} from "../../entities/reservationDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import Swal from "sweetalert2";
import {ReservationDetailsComponent} from "./reservation-details/reservation-details.component";

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})

export class ReservationsComponent implements OnInit {

  reservations: ReservationDTO[] = [];
  displayedColumns: string[] = ['date', 'title', 'actions'];

  showNoOffersMessage: boolean = false;
  showLoadingSpinner: boolean = true;

  constructor(
    private reservationService: ReservationService,
    private userService: UserService,
    private dialog: MatDialog) { }

  public getReservations(): void {
    if (this.userService.checkIfUserIsLoggedIn()) {
      this.reservationService.getReservationsForUser().subscribe(
        (response: ReservationDTO[]) => {
          this.reservations = response;
          if (response.length === 0) {
            this.showNoOffersMessage = true;
          }
          this.showLoadingSpinner = false;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public openDeleteReservationDialog(reservationId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'If active, this will not cancel your reservation',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonColor: '#c73c3c',
      cancelButtonColor: '#696969',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteReservation(reservationId);
      }
    })
  }

  public openReservationDetailsDialog(reservationId: number): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'reservation-dialog-class' // in styles.css
    dialogConfig.data = {reservationId: reservationId};
    this.dialog.open(ReservationDetailsComponent, dialogConfig);
    this.dialog._getAfterAllClosed().subscribe(() => {});
  }

  public deleteReservation(reservationId: number): void {
    this.reservationService.deleteReservation(reservationId).subscribe(
      () => {
        this.onSuccess('Reservation Deleted');
        let reservation = this.reservations.find(reservation => reservation.id === reservationId);
        if (reservation) {
          this.reservations.splice(this.reservations.indexOf(reservation), 1);
          if (this.reservations.length === 0) {
            this.showNoOffersMessage = true;
          }
        }
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onSuccess(message: string): void{
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000
    }).then(function(){})
  }

  ngOnInit(): void {
    this.getReservations();
  }

}
