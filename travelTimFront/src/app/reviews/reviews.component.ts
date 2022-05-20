import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddReviewDialogComponent} from "./add-review-dialog/add-review-dialog.component";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  @Input() offerProviderName: string | undefined;
  @Input() offerId: number | undefined;
  @Input() offerCategory: string | undefined

  constructor(private dialog: MatDialog) { }

  public openAddReviewDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      offerId: this.offerId,
      offerCategory: this.offerCategory
    };
    this.dialog.open(AddReviewDialogComponent, dialogConfig);
    this.dialog._getAfterAllClosed().subscribe(() => {

    });
  }

  ngOnInit(): void {
  }

}
