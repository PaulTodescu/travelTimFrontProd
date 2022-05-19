import { Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MapComponent} from "../../map/map.component";
import {LodgingService} from "../../services/lodging/lodging.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ImageService} from "../../services/image/image.service";
import {LegalPersonLodgingOfferBaseDetailsDTO} from "../../entities/legalPersonLodgingOfferBaseDetailsDTO";
import {LegalPersonLodgingOfferDetailsDTO} from "../../entities/legalPersonLodgingOfferDetailsDTO";
import {BusinessService} from "../../services/business/business.service";
import {FoodService} from "../../services/food/food.service";
import {FoodOfferDetails} from "../../entities/foodOfferDetails";
import {FoodMenuCategory} from "../../entities/foodMenuCategory";
import {AttractionService} from "../../services/attraction/attraction.service";
import {ActivityService} from "../../services/activity/activity.service";
import {AttractionOfferDetails} from "../../entities/attractionOfferDetails";
import {Ticket} from "../../entities/ticket";
import {ActivityOfferDetails} from "../../entities/activityOfferDetails";
import {DomSanitizer} from "@angular/platform-browser";
import {CurrencyService} from "../../services/currency/currency.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {
  BusinessScheduleComponent
} from "../../business/business-schedule/business-schedule.component";
import {DaySchedule} from "../../entities/daySchedule";
import {PhysicalPersonLodgingOfferDetails} from "../../entities/physicalPersonLodgingOfferDetails";
import {OfferContact} from "../../entities/offerContact";
import {BusinessSocials} from "../../entities/businessSocials";
import {DisabledOfferDialogComponent} from "../disabled-offer-dialog/disabled-offer-dialog.component";

@Component({
  selector: 'app-offer-container',
  templateUrl: './offer-container.component.html',
  styleUrls: ['./offer-container.component.scss']
})
export class OfferContainerComponent implements OnInit {

  @ViewChild(MapComponent) mapComponent: any;
  offerId: number | undefined
  businessId: number | undefined;
  userId: number | undefined;

  businessSchedule: DaySchedule[] | undefined;
  offerCategory: string | undefined;
  offerType: string | undefined;

  offerTitle: string | undefined;
  offerAddress: string | undefined;
  offerCity: string | undefined;
  offerDescription: string | undefined;

  hasOfferBusiness: boolean = false;

  currencies: string[] = ['RON', 'EUR', 'USD', 'GBP'];
  selectedCurrency: string = this.currencies[0];

  offerProviderName: string | undefined;
  offerProviderImage: string | undefined;

  offerContact: OfferContact | undefined;
  businessSocials: BusinessSocials | undefined;

  legalPersonLodgingOffers: LegalPersonLodgingOfferDetailsDTO[] = [];
  physicalPersonLodgingOffer: PhysicalPersonLodgingOfferDetails | undefined;

  foodOfferMenu: FoodMenuCategory[] | undefined;

  tickets: Ticket[] | undefined;

  constructor(
    private lodgingService: LodgingService,
    private foodService: FoodService,
    private attractionService: AttractionService,
    private activityService: ActivityService,
    private businessService: BusinessService,
    private imageService: ImageService,
    private dialog: MatDialog,
    private currencyService: CurrencyService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
    data => {
      this.offerId = data.id;
      this.offerCategory = data.category;
      this.offerType = data.type;
    });
  }

  images: string[] = [];

  imageObjects: Array<object> = new Array<object>();

  selectedImage: string = this.images[0];

  selectedImageIndex: number = -1;
  showImageModalFlag: boolean = false;

  public getOffer(): void{
    if (this.offerId !== undefined) {
      this.getOfferImages(this.offerId);
      if (this.offerCategory === 'lodging') {
        if (this.offerType === 'legal'){
          this.getLegalPersonLodgingOffer(this.offerId);
        }
        else if (this.offerType === 'physical') {
          this.getPhysicalPersonLodgingOffer(this.offerId);
        }
      } else if (this.offerCategory === 'food') {
        this.getFoodOffer(this.offerId);
      } else if (this.offerCategory === 'attractions') {
        this.getAttractionOffer(this.offerId);
      } else if (this.offerCategory === 'activities') {
        this.getActivityOffer(this.offerId);
      }
    }
  }

  public getLegalPersonLodgingOffer(offerId: number): void {
    this.lodgingService.getLegalLodgingOfferById(offerId).subscribe(
      (response: LegalPersonLodgingOfferBaseDetailsDTO) => {
        this.hasOfferBusiness = true;
        this.businessId = response.business.id;
        this.businessSchedule = response.business.schedule;
        this.getLegalPersonLodgingOffersDetails(response.business.id);
        this.offerAddress = response.business.address;
        this.offerCity = response.business.city;
        this.setLocationMarkerOnMap();
        this.offerDescription = response.description;
        this.offerProviderName = response.business.name;
        this.offerContact = new OfferContact(response.business.email, response.business.phoneNumber);
        this.businessSocials = new BusinessSocials(
          response.business.websiteLink,
          response.business.facebookLink,
          response.business.twitterLink);
        this.getOfferImages(response.business.id);
        if (response.business?.id !== undefined) {
          this.getProviderImage(response.business.id);
        }
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getLegalPersonLodgingOffersDetails(id: number): void {
    this.businessService.getLodgingOffers(id, this.selectedCurrency).subscribe(
      (response: LegalPersonLodgingOfferDetailsDTO[]) => {
        this.legalPersonLodgingOffers = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getPhysicalPersonLodgingOffer(offerId: number): void {
    this.lodgingService.getPhysicalLodgingOfferById(offerId).subscribe(
      (response: PhysicalPersonLodgingOfferDetails) => {
        if (response.status !== 'active') {
          this.showDisabledOfferDialog();
        }
        this.physicalPersonLodgingOffer = response;
        this.offerTitle = response.title;
        this.offerAddress = response.address;
        this.offerCity = response.city;
        this.setLocationMarkerOnMap();
        this.offerDescription = response.description;
        if (response.user !== undefined) {
          this.userId = response.user.id;
          this.offerProviderName = response.user.firstName + ' ' + response.user.lastName;
          this.offerContact =
            new OfferContact(response.offerContact.email, response.offerContact.phoneNumber);
          this.getProviderImage(response.user?.id);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getFoodOffer(offerId: number) {
    this.foodService.getFoodOfferDetails(offerId).subscribe(
      (response: FoodOfferDetails) => {
        this.hasOfferBusiness = true;
        this.offerAddress = response.business.address;
        this.offerCity = response.business.city;
        this.setLocationMarkerOnMap();
        if (response.status !== 'active') {
          this.showDisabledOfferDialog();
        }
        this.offerDescription = response.description;
        this.offerProviderName = response.business.name;
        this.offerContact = new OfferContact(response.offerContact.email, response.offerContact.phoneNumber);
        this.businessId = response.business.id;
        this.businessSchedule = response.business.schedule;
        this.businessSocials = new BusinessSocials(
          response.business.websiteLink,
          response.business.facebookLink,
          response.business.twitterLink
        )
        this.getProviderImage(response.business.id);
        this.foodOfferMenu = response.foodMenuCategories;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getAttractionOffer(offerId: number): void {
    this.attractionService.getAttractionOfferDetails(offerId).subscribe(
      (response: AttractionOfferDetails) => {
        if (response.business !== null) {
          this.hasOfferBusiness = true;
          this.businessId = response.business.id;
          this.offerProviderName = response.business.name;
          this.businessSchedule = response.business.schedule;
          this.businessSocials = new BusinessSocials(
            response.business.websiteLink,
            response.business.facebookLink,
            response.business.twitterLink
          )
          this.getProviderImage(response.business.id);
        } else {
          this.userId = response.user?.id;
          this.offerProviderName = response.user?.firstName + ' ' + response.user?.lastName;
          this.getProviderImage(response.user.id);
        }
        this.offerTitle = response.title;
        this.offerAddress = response.address;
        this.offerCity = response.city;
        if (response.status !== 'active') {
          this.showDisabledOfferDialog();
        }
        this.setLocationMarkerOnMap();
        this.offerDescription = response.description;
        this.offerContact = new OfferContact(response.offerContact.email, response.offerContact.phoneNumber);
        this.tickets = response.tickets;
      }
    )
  }

  public getActivityOffer(offerId: number): void {
    this.activityService.getActivityOfferDetails(offerId).subscribe(
      (response: ActivityOfferDetails) => {
        if (response.business !== null) {
          this.businessId = response.business.id;
          this.hasOfferBusiness = true;
          this.offerProviderName = response.business.name;
          this.businessSchedule = response.business.schedule;
          this.businessSocials = new BusinessSocials(
            response.business.websiteLink,
            response.business.facebookLink,
            response.business.twitterLink
          )
          this.getProviderImage(response.business.id);
        } else {
          this.userId = response.user?.id;
          this.offerProviderName = response.user?.firstName + ' ' + response.user?.lastName;
          this.getProviderImage(response.user.id);
        }
        this.offerTitle = response.title;
        this.offerAddress = response.address;
        this.offerCity = response.city;
        this.setLocationMarkerOnMap();
        this.offerDescription = response.description;
        if (response.status !== 'active') {
          this.showDisabledOfferDialog();
        }
        this.offerContact = new OfferContact(response.offerContact.email, response.offerContact.phoneNumber);
        this.tickets = response.tickets;
      }
    )
  }

  public getProviderImage(id: number) {
    if (this.hasOfferBusiness){
      this.imageService.getBusinessFrontImage(id).subscribe(
        (response: string) => {
          this.offerProviderImage = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
    else {
      this.imageService.getUserImage(id).subscribe(
        (response: string) => {
          this.offerProviderImage = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public setLocationMarkerOnMap(): void {
   this.setMarker(this.offerAddress + ' ' + this.offerCity);
  }

  public getSanitizerUrl(url : string | undefined) {
    if (url !== undefined) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return null;
  }

  public setImage(image: string): void {
    this.selectedImage = image;
  }

  public mapImageObjects(){
    this.imageObjects = this.images.map((image) => ({image: image, alt: '...'}));
  }


  public getOfferImages(id: number){
    if (this.offerCategory !== undefined) {
      if (this.offerCategory === 'lodging' && this.offerType === 'legal') {
        this.imageService.getBusinessImages(id).subscribe(
          (response: string[]) => {
            this.images = response;
            this.mapImageObjects();
            this.selectedImage = response[0];
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      } else {
        this.imageService.getOfferImages(id, this.offerCategory).subscribe(
          (response: string[]) => {
            this.images = response;
            this.mapImageObjects();
            this.selectedImage = response[0];
          }
        )
      }
    }
  }

  public showImageModal(selectedImage: string): void {
    this.selectedImageIndex = this.images.indexOf(selectedImage);
    this.showImageModalFlag = true;
  }

  public closeImageModal() {
    this.showImageModalFlag = false;
    this.selectedImageIndex = -1;
  }

  public setMarker(address: string): void {
    //this.mapComponent.setMarker(address);
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

  public changeCurrency(currency: string): void {
    if (this.offerCategory === 'lodging' &&
      this.offerId !== undefined &&
      this.selectedCurrency.localeCompare(currency) !== 0){
      this.setConvertedLodgingOfferPrices(this.selectedCurrency, currency);
    }
      this.selectedCurrency = currency;
  }

  public setConvertedLodgingOfferPrices(fromCode: string, toCode: string): void {
    this.currencyService.getCurrencyConversionRate(fromCode, toCode).subscribe(
      (response: number) => {
        if (this.offerType === 'legal'){
          if (this.legalPersonLodgingOffers !== undefined) {
            for (let offer of this.legalPersonLodgingOffers) {
              offer.price = offer.price * response;
              offer.currency = toCode;
            }
          }
        } else if (this.offerType === 'physical'){
          if (this.physicalPersonLodgingOffer !== undefined){
            this.physicalPersonLodgingOffer.price =
              this.physicalPersonLodgingOffer.price * response;
            this.physicalPersonLodgingOffer.currency = toCode;
          }
        }
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getFormattedOfferPrice(price: number | undefined): number {
    alert(price)
    if (price) {
      if (price % 1 < 0.1 || price % 1 > 0.9){
        return Math.round(price);
      }
      return parseFloat(price.toFixed(2));
    }
    return NaN;
  }

  public goToProviderPage(): void {
    if (this.businessId) {
      this.router.navigate(['offers/business'], {
        queryParams: {
          id: this.businessId
        }
      });
    } else if (this.userId){
      this.router.navigate(['offers/user'], {
        queryParams: {
          id: this.userId
        }
      });
    }
  }

  public showDisabledOfferDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.backdropClass = 'dark-background';
    this.dialog.open(DisabledOfferDialogComponent, dialogConfig);
  }

  ngOnInit(): void {
    this.getOffer();
  }

}
