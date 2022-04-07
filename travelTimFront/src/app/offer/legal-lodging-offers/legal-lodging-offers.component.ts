import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LegalLodgingOfferDetailsComponent} from "../legal-lodging-offer-details/legal-lodging-offer-details.component";
import {LegalPersonLodgingOfferDetailsDTO} from "../../entities/legalPersonLodgingOfferDetailsDTO";

@Component({
  selector: 'app-legal-lodging-offers',
  templateUrl: './legal-lodging-offers.component.html',
  styleUrls: ['./legal-lodging-offers.component.scss']
})
export class LegalLodgingOffersComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

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

  ngOnInit(): void {
  }

}
