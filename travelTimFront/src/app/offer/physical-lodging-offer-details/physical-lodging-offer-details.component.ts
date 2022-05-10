import {Component, Input, OnInit} from '@angular/core';
import {PhysicalPersonLodgingOffer} from "../../entities/physicalPersonLodgingOffer";

@Component({
  selector: 'app-physical-lodging-offer-details',
  templateUrl: './physical-lodging-offer-details.component.html',
  styleUrls: ['./physical-lodging-offer-details.component.scss']
})
export class PhysicalLodgingOfferDetailsComponent implements OnInit {

  @Input() offer: PhysicalPersonLodgingOffer | undefined;

  constructor() { }

  public getFormattedOfferPrice(price: number | undefined): number {
    if (price) {
      return parseFloat(price.toFixed(2));
    }
    return NaN;
  }

  ngOnInit(): void {
  }

}
