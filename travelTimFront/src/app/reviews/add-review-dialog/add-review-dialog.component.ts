import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ReviewService} from "../../services/review/review.service";
import {UserService} from "../../services/user/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ReviewSaveDTO} from "../../entities/reviewSaveDTO";
import Swal from "sweetalert2";
import {ReviewDTO} from "../../entities/reviewDTO";

@Component({
  selector: 'app-add-review-dialog',
  templateUrl: './add-review-dialog.component.html',
  styleUrls: ['./add-review-dialog.component.scss']
})
export class AddReviewDialogComponent implements OnInit {

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private injector: Injector,
    @Inject(MAT_DIALOG_DATA) public data: {
      reviewType: string,
      offerUserId: number,
      offerBusinessId: number
  }) { }

  reviewToAdd: string | undefined;
  rating: number = 0;

  savedReview: ReviewDTO | undefined;

  ratingStars: RatingStars[] = [
    {nr: 1, icon: 'star_border', isSet: false},
    {nr: 2, icon: 'star_border', isSet: false},
    {nr: 3, icon: 'star_border', isSet: false},
    {nr: 4, icon: 'star_border', isSet: false},
    {nr: 5, icon: 'star_border', isSet: false},
  ];

  public counter(nr: number): Array<number> {
    return new Array(nr);
  }

  public getRatingStar(starIndex: number): string | undefined {
    return this.ratingStars[starIndex].icon;
  }

  public hoverRatingStar(starIndex: number): void {
    for (let star of this.ratingStars.slice(0, starIndex + 1)) {
      if (!star.isSet) {
        star.icon = 'star';
      }
    }
  }

  public resetRatingStars(starIndex: number): void {
    for (let star of this.ratingStars.slice(0, starIndex + 1)) {
      if (!star.isSet) {
        star.icon = 'star_border';
      }
    }
  }

  public selectRatingStars(starIndex: number): void {
    for (let star of this.ratingStars.slice(0, starIndex + 1)) {
      if (!star.isSet) {
        star.icon = 'star';
        star.isSet = true;
        this.rating = starIndex + 1;
      } else {
        for (let star of this.ratingStars.slice(starIndex + 1)) {
          star.icon = 'star_border';
          star.isSet = false;
          this.rating = starIndex + 1;
        }
      }
    }
  }

  public sendReview(): void {
    if (this.reviewToAdd) {
      if (this.reviewToAdd.length < 10) {
        this.onFail("Enter at least 10 characters");
        return;
      }
      let review: ReviewSaveDTO = new ReviewSaveDTO(this.reviewToAdd, this.rating);
      if (this.data.offerUserId) {
        this.reviewService.addReviewForUser(this.data.offerUserId, review).subscribe(
          (response: ReviewDTO) => {
            this.savedReview = response;
            this.onSuccess();
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      } else if (this.data.offerBusinessId) {
        this.reviewService.addReviewForBusiness(this.data.offerBusinessId, review).subscribe(
          (response: ReviewDTO) => {
            this.savedReview = response;
            this.onSuccess();
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    }
  }

  public onSuccess(): void{
    let dialogRef: MatDialogRef<AddReviewDialogComponent> = this.injector.get(MatDialogRef);
    let review = this.savedReview;
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Review added successfully',
      showConfirmButton: false,
      showCancelButton: false,
      timer: 2200
    }).then(function(){
      dialogRef.close({
        newReview: review
      });
    });
  }

  public onFail(message: string): void{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 2200
    }).then(function(){})
  }

  ngOnInit(): void {
  }

}

interface RatingStars {
  nr: number;
  icon: string;
  isSet: boolean;
}
