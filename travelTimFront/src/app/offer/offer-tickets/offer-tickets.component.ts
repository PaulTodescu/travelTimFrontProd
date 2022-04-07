import {Component, Input, OnInit} from '@angular/core';
import {Ticket} from "../../entities/ticket";

@Component({
  selector: 'app-offer-tickets',
  templateUrl: './offer-tickets.component.html',
  styleUrls: ['./offer-tickets.component.scss']
})
export class OfferTicketsComponent implements OnInit {

  constructor() { }

  @Input() tickets: Ticket[] | undefined;

  ngOnInit(): void {
  }

}
