import {Component, OnInit} from '@angular/core';
import {ReviewService} from "../../services/review/review.service";
import {UserService} from "../../services/user/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {ReviewForUserDTO} from "../../entities/reviewForUserDTO";
import Swal from "sweetalert2";

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss']
})
export class UserReviewsComponent implements OnInit {

  reviews: ReviewForUserDTO[] = [];
  showNoReviewsMessage: boolean = false;
  showLoadingSpinner: boolean = true;

  page: number = 1;
  nrItemsOnPage: number = 5;
  nrOffers: number = 0;

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private reviewService: ReviewService) { }

  public getReviews(): void {
    this.reviewService.getReviewsForUser().subscribe(
      (response: ReviewForUserDTO[]) => {
        this.reviews = response;
        if (response.length === 0) {
          this.showNoReviewsMessage = true;
        }
        this.showLoadingSpinner = false;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public counter(nr: number): Array<number> {
    return new Array(nr);
  }

  public getFormattedReviewDate(reviewDate: string): string {
    let date = new Date(reviewDate);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
  }

  public openDeleteReviewDialog(reviewId: number, targetName: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This review will be removed from ' + targetName,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonColor: '#c73c3c',
      cancelButtonColor: '#696969',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteReview(reviewId);
      }
    });
  }

  public deleteReview(reviewId: number): void {
    this.reviewService.deleteReview(reviewId).subscribe(
      () => {
        this.onSuccess('Review Deleted');
      },(error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public changePage(page: number): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.page = page;
  }

  public onSuccess(message: string): void{
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000
    }).then(function(){
      location.reload();
    })
  }

  ngOnInit(): void {
    this.getReviews();
  }

}
