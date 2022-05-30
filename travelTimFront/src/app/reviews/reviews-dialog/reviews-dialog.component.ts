import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ReviewDTO} from "../../entities/reviewDTO";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-reviews-dialog',
  templateUrl: './reviews-dialog.component.html',
  styleUrls: ['./reviews-dialog.component.scss']
})
export class ReviewsDialogComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: {
      reviews: ReviewDTO[]
    }) { }

  public counter(nr: number): Array<number> {
    return new Array(nr);
  }

  public getSanitizerUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  ngOnInit(): void {

  }

}
