import {Component, Input, OnInit} from '@angular/core';
import {PhysicalPersonLodgingOffer} from "../../entities/physicalPersonLodgingOffer";
import {LegalPersonLodgingOfferDetailsDTO} from "../../entities/legalPersonLodgingOfferDetailsDTO";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {OfferReservationComponent} from "../offer-reservation/offer-reservation.component";
import Swal from "sweetalert2";
import {LodgingOfferDetailsDTO} from "../../entities/lodgingOfferDetailsDTO";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-physical-lodging-offer-details',
  templateUrl: './physical-lodging-offer-details.component.html',
  styleUrls: ['./physical-lodging-offer-details.component.scss']
})
export class PhysicalLodgingOfferDetailsComponent implements OnInit {

  @Input() offer: PhysicalPersonLodgingOffer | undefined;

  constructor(
    private userService: UserService,
    private dialog: MatDialog) { }

  public getFormattedOfferPrice(price: number | undefined): number {
    if (price) {
      return parseFloat(price.toFixed(2));
    }
    return NaN;
  }

  public makeReservation() {
    if (this.userService.checkIfUserIsLoggedIn()) {
      if (this.offer) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.autoFocus = false;
        dialogConfig.panelClass = 'dialog-class' // in styles.css
        dialogConfig.data = {
          offer: this.getMappedOfferToLodgingDetails(this.offer)
        }
        this.dialog.open(OfferReservationComponent, dialogConfig);
        this.dialog._getAfterAllClosed().subscribe(() => {
        });
      }
    } else {
      this.onFail("You must log in to your account");
    }
  }

  public getMappedOfferToLodgingDetails(offer: PhysicalPersonLodgingOffer): LodgingOfferDetailsDTO | null {
    if (offer.id) {
      return {
        id: offer.id,
        nrRooms: offer.nrRooms,
        nrBathrooms: offer.nrBathrooms,
        nrSingleBeds: offer.nrSingleBeds,
        nrDoubleBeds: offer.nrDoubleBeds,
        floor: offer.floor,
        price: offer.price,
        currency: offer.currency,
        address: offer.address,
        utilities: offer.utilities
      }
    }
    return null;
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
  }

}
