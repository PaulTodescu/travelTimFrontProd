import { Component, OnInit } from '@angular/core';
import {LodgingOfferDTO} from "../../entities/lodgingOfferDTO";
import {RecommendationsService} from "../../services/recommendations/recommendations.service";
import {HttpErrorResponse, HttpParams} from "@angular/common/http";
import {FoodOfferDTO} from "../../entities/foodOfferDTO";
import {AttractionOfferDTO} from "../../entities/attractionOfferDTO";
import {ActivityOfferDTO} from "../../entities/activityOfferDTO";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {FavouriteOfferCategoryId} from "../../entities/favouriteOfferCategoryId";
import {UserService} from "../../services/user/user.service";
import {FavouritesService} from "../../services/favourites/favourites.service";
import {BusinessService} from "../../services/business/business.service";
import Swal from "sweetalert2";
import {CurrencyService} from "../../services/currency/currency.service";
import {Location} from "@angular/common";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-offer-recommendations',
  templateUrl: './offer-recommendations.component.html',
  styleUrls: ['./offer-recommendations.component.scss'],
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
export class OfferRecommendationsComponent implements OnInit {

  selectedCategory: string = 'lodging';

  currencies: string[] = ['RON', 'EUR', 'USD', 'GBP'];
  selectedCurrency: string = this.currencies[0];

  businessLodgingOffers: LodgingOfferDTO[] = [];
  userLodgingOffers: LodgingOfferDTO[] = [];
  noBusinessLodgingOffers: boolean = false;
  noUserLodgingOffers: boolean = false;

  foodOffers: FoodOfferDTO[] = [];
  noFoodOffers: boolean = false;

  businessAttractionOffers: AttractionOfferDTO[] = [];
  userAttractionOffers: AttractionOfferDTO[] = [];
  noBusinessAttractionOffers: boolean = false;
  noUserAttractionOffers: boolean = false;

  businessActivityOffers: ActivityOfferDTO[] = [];
  userActivityOffers: ActivityOfferDTO[] = [];
  noBusinessActivityOffers: boolean = false;
  noUserActivityOffers: boolean = false;

  userId: number | undefined;
  favouriteOffers: FavouriteOfferCategoryId[] | undefined;

  showLoadingSpinner: boolean = true;

  constructor(
    private recommendationsService: RecommendationsService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private favouritesService: FavouritesService,
    private currencyService: CurrencyService,
    private businessService: BusinessService,
    private location: Location,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        if (!data.category) {
          this.selectedCategory = 'lodging';
          this.router.navigate(
            [],
            {
              relativeTo: this.activatedRout,
              queryParams: { category: 'lodging' },
              queryParamsHandling: 'merge'
            });
        } else {
          this.selectedCategory = data.category;
        }
        this.getOffers();
      });
  }

  public switchSelectedCategory(category: string): void {
      this.selectedCategory = category;
      let params = new HttpParams().appendAll({
        category: this.selectedCategory
      });
      this.location.replaceState(location.pathname, params.toString());
      this.getOffers();
  }

  public getOffers(): void {
      if (this.selectedCategory === 'lodging') {
        this.recommendationsService.getRecommendedLodgingOffersForBusinesses().subscribe(
          (response: LodgingOfferDTO[]) => {
            this.businessLodgingOffers = response;
            if (response.length === 0) {
              this.noBusinessLodgingOffers = true;
            }
            this.showLoadingSpinner = false;
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
        this.recommendationsService.getRecommendedLodgingOffersForUsers().subscribe(
          (response: LodgingOfferDTO[]) => {
            this.userLodgingOffers = response;
            if(response.length === 0) {
              this.noUserLodgingOffers = true;
            }
            this.showLoadingSpinner = false;
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      } else if (this.selectedCategory === 'food & beverage'){
        this.recommendationsService.getRecommendedFoodOffers().subscribe(
          (response: FoodOfferDTO[]) => {
            this.foodOffers = response;
            if (response.length === 0) {
              this.noFoodOffers = true;
            }
            this.showLoadingSpinner = false;
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      } else if (this.selectedCategory === 'attractions'){
        this.recommendationsService.getRecommendedAttractionOffersForBusinesses().subscribe(
          (response: AttractionOfferDTO[]) => {
            this.businessAttractionOffers = response;
            if (response.length === 0) {
              this.noBusinessAttractionOffers = true;
            }
            this.showLoadingSpinner = false;
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
        this.recommendationsService.getRecommendedAttractionOffersForUsers().subscribe(
          (response: AttractionOfferDTO[]) => {
            this.userAttractionOffers = response;
            if(response.length === 0) {
              this.noUserAttractionOffers = true;
            }
            this.showLoadingSpinner = false;
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      } else if (this.selectedCategory === 'activities'){
        this.recommendationsService.getRecommendedActivityOffersForBusinesses().subscribe(
          (response: ActivityOfferDTO[]) => {
            this.businessActivityOffers = response;
            if (response.length === 0) {
              this.noBusinessActivityOffers = true;
            }
            this.showLoadingSpinner = false;
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
        this.recommendationsService.getRecommendedActivityOffersForUsers().subscribe(
          (response: ActivityOfferDTO[]) => {
            this.userActivityOffers = response;
            if(response.length === 0) {
              this.noUserActivityOffers = true;
            }
            this.showLoadingSpinner = false;
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      }
    }

  public changeCurrency(currency: string): void {
    if (this.selectedCurrency.localeCompare(currency) !== 0) {
      this.setConvertedLodgingOfferPrices(this.selectedCurrency, currency);
    }
    this.selectedCurrency = currency;
  }

  public setConvertedLodgingOfferPrices(fromCode: string, toCode: string): void {
    this.currencyService.getCurrencyConversionRate(fromCode, toCode).subscribe(
      (response: number) => {
        for (let offer of this.businessLodgingOffers){
          offer.price = offer.price * response;
          offer.currency = toCode;
        }
        for (let offer of this.userLodgingOffers){
          offer.price = offer.price * response;
          offer.currency = toCode;
        }
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getSanitizerUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public goToOfferPage(queryParams: any): void {
    this.router.navigate(['offer'], {
      queryParams: queryParams
    });
  }

  public getFormattedOfferPrice(price: number): number {
    if (price % 1 < 0.1 || price % 1 > 0.9){
      return Math.round(price);
    }
    return parseFloat(price.toFixed(2));
  }

  public getLoggedInUserId(): void {
    if (this.userService.checkIfUserIsLoggedIn()) {
      this.userService.getLoggedInUserId().subscribe(
        (response: number) => {
          this.userId = response;
          this.getFavouriteOffersForUser(response);
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public getFavouriteOffersForUser(userId: number): void {
    this.favouritesService.getFavouriteOffersCategoryIdForUser(userId).subscribe(
      (response: FavouriteOfferCategoryId[]) => {
        this.favouriteOffers = response;
        }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public checkIfOfferIsInFavourites(id: number, category: string): boolean {
    return !!this.favouriteOffers?.find(
      (offer) => offer.id === id && offer.category === category);
  }

  public addLodgingOffersToFavourites(id: number): void {
    if (this.userService.checkIfUserIsLoggedIn()) {
      let lodgingOffers = this.businessLodgingOffers.concat(this.userLodgingOffers);
      let businessId = lodgingOffers.find(offer => offer.id === id)?.business?.id;
      if (businessId) {
        this.businessService.getLodgingOffersIDs(businessId).subscribe(
          (offerIDs: number[]) => {
            for (let offerId of offerIDs) {
              this.addOfferToFavourites(offerId, 'lodging');
            }
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      } else {
        this.addOfferToFavourites(id, 'lodging');
      }
    } else {
      this.showErrorToastMessage("You must log in to your account");
    }
  }

  public removeOfferFromFavourites(id: number, category: string) {
    if (this.userId) {
      this.favouritesService.removeOfferFromFavourites(this.userId, id, this.selectedCategory).subscribe(
        () => {
          this.favouriteOffers?.splice(this.favouriteOffers?.findIndex(
            offer => offer.id === id && offer.category === category
          ), 1);
          this.showSuccessfulToastMessage('Offer removed from favourites');
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public addOfferToFavourites(id: number, category: string) {
    if (this.userId) {
      this.favouritesService.addOfferToFavourites(this.userId, id, category).subscribe(
        () => {
          this.favouriteOffers?.push(new FavouriteOfferCategoryId(id, category));
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
      this.showSuccessfulToastMessage('Offer added to favourites');
    } else if (!this.userService.checkIfUserIsLoggedIn()){
      this.showErrorToastMessage("You must log in to your account");
    }
  }

  public showSuccessfulToastMessage(message: string) {
    Swal.fire({
      toast: true,
      position: 'bottom-left',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    }).then(function(){})
  }

  public showErrorToastMessage(message: string) {
    Swal.fire({
      toast: true,
      position: 'bottom-left',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    }).then(function(){})
  }

  ngOnInit(): void {
    this.getLoggedInUserId();
  }

}
