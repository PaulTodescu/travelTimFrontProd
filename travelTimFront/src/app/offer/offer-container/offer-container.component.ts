import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MapComponent} from "../../map/map.component";
import {PhysicalPersonLodgingOffer} from "../../entities/physicalPersonLodgingOffer";
import {LodgingService} from "../../services/lodging/lodging.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ImageService} from "../../services/image/image.service";
import {LegalPersonLodgingOfferBaseDetailsDTO} from "../../entities/legalPersonLodgingOfferBaseDetailsDTO";
import {UserContactDTO} from "../../entities/UserContactDTO";
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

@Component({
  selector: 'app-offer-container',
  templateUrl: './offer-container.component.html',
  styleUrls: ['./offer-container.component.scss']
})
export class OfferContainerComponent implements OnInit, AfterViewInit {

  @ViewChild(MapComponent) mapComponent: any;
  offerId: number | undefined
  businessId: number | undefined;
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

  contactDetails: UserContactDTO | undefined;

  legalPersonLodgingOffers: LegalPersonLodgingOfferDetailsDTO[] | undefined;
  physicalPersonLodgingOffer: PhysicalPersonLodgingOffer | undefined;
  foodOfferMenu: FoodMenuCategory[] | undefined;

  tickets: Ticket[] | undefined;

  constructor(
    private lodgingService: LodgingService,
    private foodService: FoodService,
    private attractionService: AttractionService,
    private activityService: ActivityService,
    private businessService: BusinessService,
    private imageService: ImageService,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
    data => {
      this.offerId = data.id;
      this.offerCategory = data.category;
      this.offerType = data.type;
    });}

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
        this.getLegalPersonLodgingOffersDetails(response.business.id);
        this.offerAddress = response.business.address;
        this.offerCity = response.business.city;
        this.setMarker(response.business.address + ' ' + response.business.city);
        this.offerDescription = response.description;
        this.offerProviderName = response.business.name;
        this.contactDetails = new UserContactDTO(response.user.email, response.user.phoneNumber);
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
    this.lodgingService.getPhysicalLodgingOfferById(offerId, this.selectedCurrency).subscribe(
      (response: PhysicalPersonLodgingOffer) => {
        this.physicalPersonLodgingOffer = response;
        this.offerTitle = response.title;
        this.offerAddress = response.address;
        this.offerCity = response.city;
        this.setMarker(response.address + ', ' + response.city);
        this.offerDescription = response.description;
        this.offerProviderName = response.user?.firstName + ', ' + response.user?.lastName;
        if (response.user !== undefined) {
          this.contactDetails = new UserContactDTO(response.user.email, response.user.phoneNumber);
          this.getProviderImage(response.user?.id);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getFoodOffer(offerId: number) {
    this.foodService.getFoodOfferById(offerId).subscribe(
      (response: FoodOfferDetails) => {
        this.hasOfferBusiness = true;
        this.offerAddress = response.business.address;
        this.offerCity = response.business.city;
        this.setMarker(response.business.address + ' ' + response.business.city);
        this.offerDescription = response.description;
        this.offerProviderName = response.business.name;
        this.contactDetails = new UserContactDTO(response.user.email, response.user.phoneNumber);
        if (response.business?.id !== undefined) {
          this.getProviderImage(response.business.id);
        }
        this.foodOfferMenu = response.foodMenuCategories;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getAttractionOffer(offerId: number): void {
    this.attractionService.getAttractionOfferById(offerId).subscribe(
      (response: AttractionOfferDetails) => {
        if (response.business !== null) {
          this.hasOfferBusiness = true;
          this.offerProviderName = response.business.name;
          this.getProviderImage(response.business.id);
        } else {
          this.offerProviderName = response.user?.firstName + ', ' + response.user?.lastName;
          this.getProviderImage(response.user.id);
        }
        this.offerTitle = response.title;
        this.offerAddress = response.address;
        this.offerCity = response.city;
        this.setMarker(response.address + ' ' + response.city);
        this.offerDescription = response.description;
        this.contactDetails = new UserContactDTO(response.user.email, response.user.phoneNumber);
        this.tickets = response.tickets;
      }
    )
  }

  public getActivityOffer(offerId: number): void {
    this.activityService.getActivityOfferById(offerId).subscribe(
      (response: ActivityOfferDetails) => {
        if (response.business !== null) {
          this.hasOfferBusiness = true;
          this.offerProviderName = response.business.name;
          this.getProviderImage(response.business.id);
        } else {
          this.offerProviderName = response.user?.firstName + ', ' + response.user?.lastName;
          this.getProviderImage(response.user.id);
        }
        this.offerTitle = response.title;
        this.offerAddress = response.address;
        this.offerCity = response.city;
        this.setMarker(response.address + ' ' + response.city);
        this.offerDescription = response.description;
        this.contactDetails = new UserContactDTO(response.user.email, response.user.phoneNumber);
        this.tickets = response.tickets;
      }
    )
  }

  public getProviderImage(id: number) {
    if (this.hasOfferBusiness){
      this.imageService.getBusinessImage(id).subscribe(
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

  setImage(image: string) {
    this.selectedImage = image;
  }

  public mapImageObjects(){
    this.imageObjects = this.images.map((image) => ({image: image, alt: '...'}));
  }


  public getOfferImages(offerId: number){
    if (this.offerCategory !== undefined && offerId !== undefined) {
      this.imageService.getOfferImages(offerId, this.offerCategory).subscribe(
        (response: string[]) => {
          this.images = response;
          this.mapImageObjects();
          this.selectedImage = response[0];
        }
      )
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
    this.mapComponent.setMarker(address);
  }
  public changeCurrency(currency: string): void {
    this.selectedCurrency = currency;
    if (this.offerCategory === 'lodging' && this.offerId !== undefined){
      if (this.offerType === 'legal') {
        if (this.businessId !== undefined) {
          this.getLegalPersonLodgingOffersDetails(this.businessId);
        }
      } else if (this.offerType === 'physical') {
        this.getPhysicalPersonLodgingOffer(this.offerId);
      }
    }
  }


  ngOnInit(): void {
    this.getOffer();
  }

  ngAfterViewInit(): void {
  }

}
