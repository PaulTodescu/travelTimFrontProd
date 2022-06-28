import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddReviewDialogComponent} from "./add-review-dialog/add-review-dialog.component";
import {UserService} from "../services/user/user.service";
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {ReviewService} from "../services/review/review.service";
import {ReviewDTO} from "../entities/reviewDTO";
import {DomSanitizer} from "@angular/platform-browser";
import {ReviewsDialogComponent} from "./reviews-dialog/reviews-dialog.component";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnChanges {

  @Input() offerProviderName: string | undefined;
  @Input() reviewType: string | undefined;
  @Input() offerUserId: number | undefined;
  @Input() offerBusinessId: number | undefined;

  @Output() reviewAddedEvent = new EventEmitter<string>();

  reviews: ReviewDTO[] = [];

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog) {
  }

  public getReviews(): void {
    if (this.offerUserId) {
      this.reviewService.getReviewsForTargetUser(this.offerUserId).subscribe(
        (response: ReviewDTO[]) => {
          this.reviews = response;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    } else if (this.offerBusinessId) {
      this.reviewService.getReviewsForBusiness(this.offerBusinessId).subscribe(
        (response: ReviewDTO[]) => {
          this.reviews = response;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public getFirstNReviews(n: number): ReviewDTO[] {
    if (this.reviews.length > n) {
      return this.reviews.slice(0, n);
    }
    return this.reviews;
  }

  public getFormattedReviewDate(reviewDate: string): string {
    let date = new Date(reviewDate);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
  }

  public openAddReviewDialog(): void {
    if (this.userService.checkIfUserIsLoggedIn()) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "40%";
      dialogConfig.data = {
        reviewType: this.reviewType,
        offerUserId: this.offerUserId,
        offerBusinessId: this.offerBusinessId
      };
      const dialogRef = this.dialog.open(AddReviewDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
        if (res.newReview) {
          this.reviews.splice(0, 0, res.newReview);
          if (this.offerUserId) {
            this.reviewAddedEvent.emit('user');
          } else if (this.offerBusinessId) {
            this.reviewAddedEvent.emit('business');
          }
        }
      });
    } else {
      this.onFail("You must log in to your account");
    }
  }

  public counter(nr: number): Array<number> {
    return new Array(nr);
  }

  public getSanitizerUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public openAllReviewsModal(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-class';
    dialogConfig.data = {
      reviews: this.reviews
    };
    this.dialog.open(ReviewsDialogComponent, dialogConfig);
  }

  public onFail(message: string): void{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 2500
    }).then(function(){})
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reviewType = changes.reviewType?.currentValue;
    this.offerUserId = changes.offerUserId?.currentValue;
    this.offerBusinessId = changes.offerBusinessId?.currentValue;
    if (this.offerUserId || this.offerBusinessId) {
      this.getReviews()
    }
  }

}
