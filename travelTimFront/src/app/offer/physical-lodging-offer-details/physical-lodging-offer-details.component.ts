import {Component, Input, OnInit} from '@angular/core';
import {PhysicalPersonLodgingOffer} from "../../entities/physicalPersonLodgingOffer";
import {LodgingOfferPriceDTO} from "../../entities/lodgingOfferPriceDTO";

@Component({
  selector: 'app-physical-lodging-offer-details',
  templateUrl: './physical-lodging-offer-details.component.html',
  styleUrls: ['./physical-lodging-offer-details.component.scss']
})
export class PhysicalLodgingOfferDetailsComponent implements OnInit {

  @Input() offer: PhysicalPersonLodgingOffer | undefined;
  @Input() offerPrice: LodgingOfferPriceDTO | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
