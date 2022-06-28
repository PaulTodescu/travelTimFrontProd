import { Component, OnInit } from '@angular/core';
import {BusinessService} from "../../services/business/business.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {Business} from "../../entities/business";
import {HttpErrorResponse, HttpParams} from "@angular/common/http";
import {ImageService} from "../../services/image/image.service";
import {LegalPersonLodgingOfferDTO} from "../../entities/LegalPersonLodgingOfferDTO";
import {FoodOfferIdMenuImageDTO} from "../../entities/foodOfferIdMenuImageDTO";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FoodOfferMenuComponent} from "../../offer/food-offer-menu/food-offer-menu.component";
import {AttractionOfferForBusinessDTO} from "../../entities/attractionOfferForBusinessDTO";
import {Ticket} from "../../entities/ticket";
import {OfferTicketsComponent} from "../../offer/offer-tickets/offer-tickets.component";
import {ActivityOfferForBusinessPageDTO} from "../../entities/activityOfferForBusinessPageDTO";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ReviewRatingDTO} from "../../entities/reviewRatingDTO";
import {ReviewService} from "../../services/review/review.service";
import {DaySchedule} from "../../entities/daySchedule";
import {BusinessScheduleComponent} from "../business-schedule/business-schedule.component";
import {Location} from "@angular/common";

@Component({
  selector: 'app-business-offers',
  templateUrl: './business-offers.component.html',
  styleUrls: ['./business-offers.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('*', style({'opacity': 1})),
      transition('void => *', [
        style({'opacity': 0}),
        animate('300ms linear')
      ])
    ])
  ]
})
export class BusinessOffersComponent implements OnInit {

  business: Business | undefined;
  businessId: number | undefined;
  images: string[] | undefined;
  imageObjects: Array<object> = new Array<object>();

  businessRating: ReviewRatingDTO | undefined;
  businessSchedule: DaySchedule[] | undefined;

  showImageModalFlag: boolean = false;
  carouselImageIndex: number = -1;
  page: number = 1;
  nrItemsOnPage: number = 5;
  lodgingOffers: LegalPersonLodgingOfferDTO[] = [];
  foodOffer: FoodOfferIdMenuImageDTO | undefined;
  attractionOffers: AttractionOfferForBusinessDTO[] = [];
  activityOffers: ActivityOfferForBusinessPageDTO[] = [];

  selectedOfferCategory: string = 'lodging';

  constructor(
    private businessService: BusinessService,
    private imageService: ImageService,
    private reviewService: ReviewService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog,
    private location: Location,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        if (data.id) {
          this.businessId = data.id;
        }
        if (!data.offerCategory) {
          this.selectedOfferCategory = 'lodging';
          this.router.navigate(
            [],
            {
              relativeTo: this.activatedRout,
              queryParams: { category: 'lodging' },
              queryParamsHandling: 'merge'
            });
        } else {
          this.selectedOfferCategory = data.offerCategory;
        }
      });
  }

  public switchSelectedOfferCategory(category: string): void {
    if (this.businessId) {
      this.selectedOfferCategory = category;
      let params = new HttpParams().appendAll({
        id: this.businessId,
        offerCategory: this.selectedOfferCategory
      });
      this.location.replaceState(location.pathname, params.toString());
    }
  }

  public getBusinessById(id: number){
    if (id){
      this.businessService.getBusinessById(id).subscribe(
        (response: Business) => {
          this.business = response;
          this.getBusinessImages(response.id);
          this.getBusinessOffers(response.id);
          this.getBusinessRating(response.id);
          this.businessSchedule = response.schedule;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public getBusinessImages(id: number){
    this.imageService.getBusinessImages(id).subscribe(
      (response: string[]) => {
        this.images = response;
        this.mapImageObjects();
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getBusinessFrontImage(): string {
    if (this.images){
      return this.images[0];
    }
    return '';
  }

  public getSanitizerUrl(url : string | undefined) {
    if (url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return null;
  }

  public mapImageObjects(){
    if (this.images) {
      this.imageObjects = this.images.map((image) => ({image: image, alt: '...'}));
    }
  }

  public showImagesModal(): void {
    if (this.images) {
      this.carouselImageIndex = 0;
      this.showImageModalFlag = true;
    }
  }

  public closeImageModal() {
    this.showImageModalFlag = false;
    this.carouselImageIndex = -1;
  }

  public seeBusinessSchedule(): void {
    if (this.businessSchedule !== undefined) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'dialog-class' // in styles.css
      dialogConfig.data = {
        schedule: this.businessSchedule
      }
      this.dialog.open(BusinessScheduleComponent, dialogConfig);
    }
  }

  public getBusinessOffers(businessId: number): void {
    this.businessService.getLodgingOffersForBusinessPage(businessId).subscribe(
      (response: LegalPersonLodgingOfferDTO[]) => {
        this.lodgingOffers = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    this.businessService.getFoodOffer(businessId).subscribe(
      (response: FoodOfferIdMenuImageDTO) => {
        this.foodOffer = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    this.businessService.getAttractionOffers(businessId).subscribe(
      (response: AttractionOfferForBusinessDTO[]) => {
        this.attractionOffers = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    this.businessService.getActivityOffers(businessId).subscribe(
      (response: ActivityOfferForBusinessPageDTO[]) => {
        this.activityOffers = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getFormattedOfferPrice(price: number): number {
    if (price % 1 < 0.1 || price % 1 > 0.9){
      return Math.round(price);
    }
    return parseFloat(price.toFixed(2));
  }

  public seeFoodOfferMenu(): void {
    if (this.foodOffer !== undefined) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.autoFocus = false;
      dialogConfig.panelClass = 'dialog-class' // in styles.css
      dialogConfig.data = {
        menu: this.foodOffer.foodMenuCategories
      }
      this.dialog.open(FoodOfferMenuComponent, dialogConfig);
    }
  }

  public seeTickets(tickets: Ticket[] | undefined): void {
    if (tickets !== undefined) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.autoFocus = false;
      dialogConfig.panelClass = 'dialog-class' // in styles.css
      dialogConfig.data = {
        tickets: tickets
      }
      this.dialog.open(OfferTicketsComponent, dialogConfig);
    }
  }

  public counter(nr: number): Array<number> {
    return new Array(nr);
  }

  public scroll(el: HTMLElement): void {
    el.scrollIntoView({behavior: 'smooth'});
  }

  public getBusinessRating(businessId: number): void {
    this.reviewService.getRatingForBusiness(businessId).subscribe(
      (response: ReviewRatingDTO) => {
        this.businessRating = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public addedReviewEvent(reviewType: string): void {
    if (reviewType === 'business' && this.business) {
      this.getBusinessRating(this.business.id);
    }
  }

  public getNrFullStars(rating: number | undefined): number {
    if (rating !== undefined) {
      return Math.trunc(this.getRoundedRating(rating));
    }
    return 0;
  }

  public getHalfStar(rating: number  | undefined): number {
    if (rating !== undefined) {
      return Math.round(this.getRoundedRating(rating) % 1);
    }
    return 0;
  }

  public getNrEmptyStars(rating: number  | undefined): number {
    if (rating !== undefined) {
      return 5 - this.getNrFullStars(rating) - this.getHalfStar(rating);
    }
    return 0;
  }

  public getRoundedRating(rating: number): number {
    return Math.round(rating / 0.5) * 0.5;
  }

  public getNrReviews(): number {
    if (this.businessRating) {
      return this.businessRating.nrReviews
    }
    return 0;
  }

  public goToLodgingOfferPage(offer: LegalPersonLodgingOfferDTO): void {
    this.router.navigate(['offer'], {
      queryParams: {
        id: offer.id,
        category: 'lodging',
        type: 'legal'
      }
    });
  }

  public goToFoodOfferPage(offer: FoodOfferIdMenuImageDTO | undefined) {
    if (offer) {
      this.router.navigate(['offer'], {
        queryParams: {
          id: offer.id,
          category: 'food'
        }
      });
    }
  }

  public goToAttractionOfferPage(offer: AttractionOfferForBusinessDTO) {
    this.router.navigate(['offer'], {
      queryParams: {
        id: offer.id,
        category: 'attractions'
      }
    });
  }

  public goToActivityOfferPage(offer: ActivityOfferForBusinessPageDTO) {
    this.router.navigate(['offer'], {
      queryParams: {
        id: offer.id,
        category: 'activities'
      }
    });
  }

  ngOnInit(): void {
    if (this.businessId) {
      this.getBusinessById(this.businessId);
    }
  }



}
