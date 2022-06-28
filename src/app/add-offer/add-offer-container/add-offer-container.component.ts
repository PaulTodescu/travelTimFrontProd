import {Component, Injector, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {LegalPersonLodgingOffer} from "../../entities/legalPersonLodgingOffer";
import {PhysicalPersonLodgingOffer} from "../../entities/physicalPersonLodgingOffer";
import {LodgingService} from "../../services/lodging/lodging.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {FoodOffer} from "../../entities/foodOffer";
import {FoodService} from "../../services/food/food.service";
import {AttractionOffer} from "../../entities/attractionOffer";
import {AttractionService} from "../../services/attraction/attraction.service";
import {ActivityOffer} from "../../entities/activityOffer";
import {ActivityService} from "../../services/activity/activity.service";
import {UserService} from "../../services/user/user.service";
import {ImageService} from "../../services/image/image.service";
import {OfferContact} from "../../entities/offerContact";
import {Business} from "../../entities/business";
import {ContactService} from "../../services/contact/contact.service";

@Component({
  selector: 'app-add-offer-container',
  templateUrl: './add-offer-container.component.html',
  styleUrls: ['./add-offer-container.component.scss'],
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
export class AddOfferContainerComponent implements OnInit {

  selectedCategory: string | undefined;

  lodgingOfferType: string | undefined;

  legalPersonLodgingOffer: LegalPersonLodgingOffer | undefined;
  isLegalPersonLodgingOfferValid: boolean = false;

  physicalPersonLodgingOffer: PhysicalPersonLodgingOffer | undefined;
  isPhysicalPersonLodgingOfferValid: boolean = false;

  foodOffer: FoodOffer | undefined;
  isFoodOfferValid: boolean = false;

  attractionOffer: AttractionOffer | undefined;
  isAttractionOfferValid: boolean = false;

  activityOffer: ActivityOffer | undefined;
  isActivityOfferValid: boolean = false;

  contactDetails: OfferContact | undefined;
  isContactValid: boolean = true;

  selectedBusiness: Business | undefined;

  images: File[] = [];

  constructor(
    private lodgingService: LodgingService,
    private foodService: FoodService,
    private attractionService: AttractionService,
    private activityOfferService: ActivityService,
    private userService: UserService,
    private imageService: ImageService,
    private contactService: ContactService,
    private injector: Injector) { }

  public getSelectedCategory(receivedCategory: string) {
    if (this.selectedCategory !== receivedCategory){
      this.selectedBusiness = undefined;
    }
    this.selectedCategory = receivedCategory;
  }

  public getLegalPersonLodgingFormValue(receivedLegalPersonLodgingOffer: LegalPersonLodgingOffer): void {
    this.legalPersonLodgingOffer = receivedLegalPersonLodgingOffer;
    this.selectedBusiness = receivedLegalPersonLodgingOffer.business;
  }

  public getPhysicalPersonLodgingFormValue(receivedPhysicalPersonLodgingOffer: PhysicalPersonLodgingOffer): void {
    this.physicalPersonLodgingOffer = receivedPhysicalPersonLodgingOffer;
    this.selectedBusiness = undefined;
  }

  public getLodgingOfferType(receivedLodgingOfferType: string): void {
    this.lodgingOfferType = receivedLodgingOfferType;
  }

  public getFoodOfferFormValue(receivedFoodOffer: FoodOffer): void {
    this.foodOffer = receivedFoodOffer;
    this.selectedBusiness  = receivedFoodOffer.business;
  }

  public getAttractionOfferFormValue(receivedAttractionOffer: AttractionOffer): void {
    this.attractionOffer = receivedAttractionOffer;
    this.selectedBusiness = receivedAttractionOffer.business;
  }

  public getActivityOfferFormValue(receivedActivityOffer: ActivityOffer): void {
    this.activityOffer = receivedActivityOffer;
    this.selectedBusiness = receivedActivityOffer.business;
  }

  public getContactDetails(contactDetails: OfferContact) {
    this.contactDetails = contactDetails;
  }

  public getImages(receivedImages: File[]): void {
    this.images = receivedImages;
  }

  public checkLegalPersonLodgingFormValidity(isValid: boolean) {
    this.isLegalPersonLodgingOfferValid = isValid;
  }

  public checkPhysicalPersonLodgingFormValidity(isValid: boolean) {
    this.isPhysicalPersonLodgingOfferValid = isValid;
  }

  public checkFoodOfferFormValidity(isValid: boolean) {
    this.isFoodOfferValid = isValid;
  }

  public checkAttractionsFormValidity(isValid: boolean) {
    this.isAttractionOfferValid = isValid;
  }

  public checkActivityFormValidity(isValid: boolean){
    this.isActivityOfferValid = isValid;
  }

  public checkContactValidity(isValid: boolean){
    this.isContactValid = isValid;
  }

  public addOffer(): void {
    if (this.selectedCategory === 'lodging'){
      this.addLodgingOffer();
    } else if (this.selectedCategory === 'food'){
      this.addFoodOffer();
    } else if (this.selectedCategory === 'attractions'){
      this.addAttractionOffer();
    } else if (this.selectedCategory === 'activities'){
      this.addActivityOffer();
    }

  }

  public addLodgingOffer(): void {
    if (this.lodgingOfferType === 'legal'){
      if (!this.isLegalPersonLodgingOfferValid){
        this.onFail("Form is invalid");
        return;
      }
      if (this.images.length < 1){
        this.onFail("Add at least one image");
        return;
      }
      if (!this.isContactValid){
        this.onFail("Invalid Contact Information");
        return;
      }
      if (this.legalPersonLodgingOffer !== undefined) {
        this.lodgingService.addLegalPersonLodgingOffer(this.legalPersonLodgingOffer).subscribe(
          (offerId: number) => {
            this.addContactDetails(offerId, 'lodging', this.contactDetails);
            this.addImages(offerId);
            this.onSuccess();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      }
    } else if (this.lodgingOfferType === 'physical'){
      if (!this.isPhysicalPersonLodgingOfferValid){
        this.onFail("Form is invalid");
        return;
      }
      if (this.images.length < 1){
        this.onFail("Add at least one image");
        return;
      }
      if (!this.isContactValid){
        this.onFail("Invalid Contact Information");
        return;
      }
      if (this.physicalPersonLodgingOffer !== undefined) {
        this.lodgingService.addPhysicalPersonLodgingOffer(this.physicalPersonLodgingOffer).subscribe(
          (offerId: number) => {
            this.addContactDetails(offerId, 'lodging', this.contactDetails);
            this.addImages(offerId);
            this.onSuccess();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      }
    }
  }

  public addFoodOffer(): void {
    if (!this.isFoodOfferValid){
      this.onFail("Form is invalid");
      return;
    }
    if (this.images.length < 1){
      this.onFail("Add at least one image");
      return;
    }
    if (!this.isContactValid){
      this.onFail("Invalid Contact Information");
      return;
    }
    if (this.foodOffer !== undefined) {
      for (let key of Object.keys(this.foodOffer.menu)) {
        if (this.foodOffer.menu[key].length === 0){
          this.onFail("Menu category should contain at least one item");
          return;
        }
        for (let menuItem of this.foodOffer.menu[key]) {
          if (menuItem.name === undefined || menuItem.name === '' || menuItem.weight <= 0 || menuItem.price <= 0 ) {
            this.onFail("Invalid menu item added");
            return;
          }
        }
      }

      this.foodService.checkIfBusinessHasFoodOffer(this.foodOffer.business.id).subscribe(
        (response: boolean) => {
          if (response){
            this.onFail("Selected business already has a food offer\nManage from your account");
          } else if (this.foodOffer !== undefined) {
            this.foodService.addFoodOffer(this.foodOffer).subscribe(
              (offerId: number) => {
                this.addContactDetails(offerId, 'food', this.contactDetails);
                this.addFoodMenu(offerId);
                this.addImages(offerId);
                this.onSuccess();
              },
              (error: HttpErrorResponse) => {
                alert(error.message)
              }
            )
          }
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public addFoodMenu(foodOfferId: number): void {
    if (this.foodOffer !== undefined) {
      this.foodService.addFoodMenu(foodOfferId, this.foodOffer.menu).subscribe(
        () => {},
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public addAttractionOffer(): void {
    if (!this.isAttractionOfferValid){
      this.onFail("Form is invalid");
      return;
    }
    if (this.images.length < 1){
      this.onFail("Add at least one image");
      return;
    }
    if (!this.isContactValid){
      this.onFail("Invalid Contact Information");
      return;
    }
    if (this.attractionOffer !== undefined) {
      let tickets = this.attractionOffer.tickets;
      if (tickets !== undefined) {
        for (let i = 0; i < tickets.length; i++) {
          if (tickets[i].name === undefined || tickets[i].name === '' || isNaN(tickets[i].price)) {
            this.onFail("Invalid ticket added");
            return;
          }
        }
      }
      this.attractionService.addAttractionOffer(this.attractionOffer).subscribe(
        (offerId: number) => {
          this.addContactDetails(offerId, 'attractions', this.contactDetails);
          this.addImages(offerId);
          this.onSuccess();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public addActivityOffer(): void {
    if (!this.isActivityOfferValid){
      this.onFail("Form is invalid");
      return;
    }
    if (this.images.length < 1){
      this.onFail("Add at least one image");
      return;
    }
    if (!this.isContactValid){
      this.onFail("Invalid Contact Information");
      return;
    }
    if (this.activityOffer !== undefined){
      let tickets = this.activityOffer.tickets;
      if (tickets !== undefined) {
        for (let i = 0; i < tickets.length; i++) {
          if (tickets[i].name === undefined || tickets[i].name === '' || isNaN(tickets[i].price)) {
            this.onFail("Invalid ticket added");
            return;
          }
        }
      }
      this.activityOfferService.addActivityOffer(this.activityOffer).subscribe(
        (offerId: number) => {
          this.addContactDetails(offerId, 'activities', this.contactDetails);
          this.addImages(offerId);
          this.onSuccess();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  private addContactDetails(offerId: number, offerType: string, contactDetails: OfferContact | undefined) {
    if (contactDetails !== undefined){
      this.contactService.setContactDetails(offerId, offerType, contactDetails).subscribe(
        () => {},
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public addImages(offerId: number): void{
    if (this.selectedCategory !== undefined) {
      this.imageService.uploadOfferImages(offerId, this.selectedCategory, this.images).subscribe(
        () => {
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public onSuccess(): void{
    let router: Router = this.injector.get(Router);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Offer added successfully',
      showConfirmButton: false,
      timer: 2000
    }).then(function(){
      router.navigateByUrl('home');
    })
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

}
