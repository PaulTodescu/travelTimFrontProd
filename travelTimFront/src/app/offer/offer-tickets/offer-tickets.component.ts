import {Component, Inject, Input, OnInit} from '@angular/core';
import {Ticket} from "../../entities/ticket";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-offer-tickets',
  templateUrl: './offer-tickets.component.html',
  styleUrls: ['./offer-tickets.component.scss']
})
export class OfferTicketsComponent implements OnInit {

  @Input() tickets: Ticket[] | undefined;

  constructor( @Inject(MAT_DIALOG_DATA) public data: {
    tickets: Ticket[]
  }) {
    if (this.data.tickets){
      this.tickets = this.data.tickets;
    }
  }

  ngOnInit(): void {
  }

}
