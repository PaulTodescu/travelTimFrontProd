import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";
import {LodgingOfferBaseDetailsDTO} from "../../entities/LodgingOfferBaseDetailsDTO";
import {FoodOfferBaseDetailsDTO} from "../../entities/FoodOfferBaseDetailsDTO";
import {AttractionOfferBaseDetailsDTO} from "../../entities/attractionOfferBaseDetailsDTO";
import {ActivityOfferBaseDetailsDTO} from "../../entities/activityOfferBaseDetailsDTO";

@Component({
  selector: 'app-user-offers',
  templateUrl: './user-offers.component.html',
  styleUrls: ['./user-offers.component.scss']
})
export class UserOffersComponent implements OnInit {

  category: string = 'lodging';

  lodgingOffers: LodgingOfferBaseDetailsDTO[] = [];
  foodOffers: FoodOfferBaseDetailsDTO[] = [];
  attractionOffers: AttractionOfferBaseDetailsDTO[] = [];
  activityOffers: ActivityOfferBaseDetailsDTO[] = [];

  page: number = 1;
  nrItemsOnPage: number = 5;
  showLoadingSpinner: boolean = true;
  showNoOffersMessage: boolean = false;

  showOffers: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService) { }

  public switchSelectedCategory(category: string): void {
    this.category = category;
    this.page = 1;
    this.getOffers();
  }

  public getOffers(): void {
    if (this.category === 'lodging') {
      this.userService.getLodgingOffers().subscribe(
        (response: LodgingOfferBaseDetailsDTO[]) => {
          this.lodgingOffers = response;
          this.showOffers = true;
          this.showLoadingSpinner = false;
          if (this.lodgingOffers.length === 0){
            this.showNoOffersMessage = true;
          }
          },
        (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      } else if (this.category === 'food & beverage') {
      this.userService.getFoodOffers().subscribe(
        (response: FoodOfferBaseDetailsDTO[]) => {
          this.foodOffers = response;
          this.showOffers = true;
          this.showLoadingSpinner = false;
          if (this.foodOffers.length === 0){
            this.showNoOffersMessage = true;
          }
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    } else if (this.category === 'attractions') {
      this.userService.getAttractionOffers().subscribe(
        (response: AttractionOfferBaseDetailsDTO[]) => {
          this.attractionOffers = response;
          this.showOffers = true;
          this.showLoadingSpinner = false;
          if (this.attractionOffers.length === 0){
            this.showNoOffersMessage = true;
          }
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    } else if (this.category === 'activities') {
      this.userService.getActivityOffers().subscribe(
        (response: ActivityOfferBaseDetailsDTO[]) => {
          this.activityOffers = response;
          this.showOffers = true;
          this.showLoadingSpinner = false;
          if (this.activityOffers.length === 0){
            this.showNoOffersMessage = true;
          }
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public goToLodgingOfferPage(offer: LodgingOfferBaseDetailsDTO): void {
    let queryParams: any;
    if (offer.businessName !== undefined){
      queryParams = {
        id: offer.id,
        category: 'lodging',
        type: 'legal'
      }
    } else {
      queryParams = {
        id: offer.id,
        category: 'lodging',
        type: 'physical'
      }
    }
    this.router.navigate(['offer'], {
      queryParams: queryParams
    });
  }

  public goToFoodOfferPage(offer: FoodOfferBaseDetailsDTO): void {
    let queryParams = {
      id: offer.id,
      category: 'food'
    }
    this.router.navigate(['offer'], {
      queryParams: queryParams
    });
  }

  public goToAttractionOfferPage(offer: AttractionOfferBaseDetailsDTO): void {
    let queryParams = {
      id: offer.id,
      category: 'attractions'
    }
    this.router.navigate(['offer'], {
      queryParams: queryParams
    });
  }

  public goToActivityOfferPage(offer: ActivityOfferBaseDetailsDTO): void {
    let queryParams = {
      id: offer.id,
      category: 'activities'
    }
    this.router.navigate(['offer'], {
      queryParams: queryParams
    });
  }

  ngOnInit(): void {
    this.getOffers();
  }

}
