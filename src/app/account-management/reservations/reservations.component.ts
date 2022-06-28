import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {ReservationService} from "../../services/reservation/reservation.service";
import {ReservationDTO} from "../../entities/reservationDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import Swal from "sweetalert2";
import {ReservationDetailsComponent} from "./reservation-details/reservation-details.component";
import {Business} from "../../entities/business";
import {ngxCsv} from "ngx-csv";
import {OfferReservation} from "../../entities/offerReservation";

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

  public getFormattedReservationDate(reservationDate: string): string {
    let date = new Date(reservationDate);
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString(
      'it-IT',
      { hour: '2-digit', minute: '2-digit'}
    );
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
  }

  public deleteReservation(reservationId: number): void {
    this.reservationService.deleteReservation(reservationId).subscribe(
      () => {
        this.onSuccess('Reservation Deleted');
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public exportReservations(): void {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useBom: true,
      noDownload: false,
      headers: ['Arrival Date', 'Arrival Time', 'Departure Date', 'Name', 'Email', 'Phone', 'Total Price', 'Address', 'City',]
    };

    let csvData: any = [];
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    let title = 'TravelTim-Reservations-' + dd + '-' + mm + '-' + yyyy;
      for (let i = 0; i < this.reservations.length; i++) {
        this.reservationService.getReservationDetails(this.reservations[i].id).subscribe(
          (response: OfferReservation) => {
            if (!response.arrivalTime){
              response.arrivalTime = 'Not Provided';
            }
            if (!response.phoneNumber){
              response.phoneNumber = 'Not Provided';
            }
            let entry = {
              "Arrival Date": response.arrivalDate,
              "Arrival Time": response.arrivalTime,
              "Departure Date": response.departureDate,
              "Name": response.firstName + ' ' + response.lastName,
              "Email": response.email,
              "Phone": response.phoneNumber,
              "Total Price": response.totalPrice,
              "Address": response.address,
              "City": response.city
            };
            csvData.push(entry);
            if (i === this.reservations.length - 1) {
              new ngxCsv(csvData, title, options);
            }
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
  }

  public onSuccess(message: string): void{
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000
    }).then(function(){
      location.reload();
    })
  }

  ngOnInit(): void {
    this.getReservations();
  }

}
