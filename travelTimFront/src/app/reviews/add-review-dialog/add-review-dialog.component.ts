import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-review-dialog',
  templateUrl: './add-review-dialog.component.html',
  styleUrls: ['./add-review-dialog.component.scss']
})
export class AddReviewDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    offerId: number,
    offerCategory: string
  }) { }

  ngOnInit(): void {
  }

}
