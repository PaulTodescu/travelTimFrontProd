import { Component, OnInit } from '@angular/core';
import {BusinessService} from "../../services/business/business.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {Business} from "../../entities/business";
import {HttpErrorResponse} from "@angular/common/http";
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
  images: string[] | undefined;
  imageObjects: Array<object> = new Array<object>();

  showImageModalFlag: boolean = false;
  carouselImageIndex: number = -1;
  page: number = 1;
  nrItemsOnPage: number = 5;

  showBusinessContact: boolean = false;

  lodgingOffers: LegalPersonLodgingOfferDTO[] = [];
  foodOffer: FoodOfferIdMenuImageDTO | undefined;
  attractionOffers: AttractionOfferForBusinessDTO[] = [];
  activityOffers: ActivityOfferForBusinessPageDTO[] = [];

  selectedOfferCategory: string = 'lodging';


  constructor(
    private businessService: BusinessService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        if (data.id) {
          this.getBusinessById(data.id);
        }
      });
  }

  public getBusinessById(id: number){
    if (id){
      this.businessService.getBusinessById(id).subscribe(
        (response: Business) => {
          this.business = response;
          this.getBusinessImages(response.id);
          this.getBusinessOffers(response.id);
          this.checkIfBusinessHasContactInformation(response);
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

  public switchSelectedOfferCategory(category: string): void {
    this.selectedOfferCategory = category;
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

  public checkIfBusinessHasContactInformation(business: Business): void {
    this.showBusinessContact = !!(business.email || business.phoneNumber || business.websiteLink ||
      business.facebookLink || business.twitterLink);
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
  }

}
