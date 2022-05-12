import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LegalLodgingOfferDetailsComponent} from "../legal-lodging-offer-details/legal-lodging-offer-details.component";
import {LegalPersonLodgingOfferDetailsDTO} from "../../entities/legalPersonLodgingOfferDetailsDTO";
import {OfferReservationComponent} from "../offer-reservation/offer-reservation.component";
import {UserService} from "../../services/user/user.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-legal-lodging-offers',
  templateUrl: './legal-lodging-offers.component.html',
  styleUrls: ['./legal-lodging-offers.component.scss']
})
export class LegalLodgingOffersComponent implements OnInit {

  constructor(
    private userService: UserService,
    private dialog: MatDialog) { }

  @Input() offers: LegalPersonLodgingOfferDetailsDTO[] | undefined;

  public openLegalLodgingOfferDetails(offerIndex: number): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'dialog-class' // in styles.css
    if (this.offers !== undefined) {
      dialogConfig.data = {
        id: this.offers[offerIndex].id,
        description: this.offers[offerIndex].description,
        utilities: this.offers[offerIndex].utilities
      }
    }
    this.dialog.open(LegalLodgingOfferDetailsComponent, dialogConfig);
    this.dialog._getAfterAllClosed().subscribe(() => {
    });
  }

  public getFormattedOfferPrice(price: number | undefined): number {
    if (price !== undefined) {
      return parseFloat(price.toFixed(2));
    }
    return NaN;
  }

  public makeReservation(offerId: number | undefined) {
    if (this.userService.checkIfUserIsLoggedIn()) {
      if (offerId) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.autoFocus = false;
        dialogConfig.panelClass = 'dialog-class' // in styles.css
        if (this.offers !== undefined) {
          dialogConfig.data = {
            id: offerId
          }
        }
        this.dialog.open(OfferReservationComponent, dialogConfig);
        this.dialog._getAfterAllClosed().subscribe(() => {
        });
      }
    } else {
      this.onFail("You must log in to your account");
    }
  }


  public onFail(message: string): void{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 2500
    }).then(function(){})
  }

  ngOnInit(): void {
    this.makeReservation(23);
  }

}
