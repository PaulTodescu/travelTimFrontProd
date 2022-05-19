import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-disabled-offer-dialog',
  templateUrl: './disabled-offer-dialog.component.html',
  styleUrls: ['./disabled-offer-dialog.component.scss']
})
export class DisabledOfferDialogComponent implements OnInit {

  constructor(private location: Location) { }

  public goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
  }

}
