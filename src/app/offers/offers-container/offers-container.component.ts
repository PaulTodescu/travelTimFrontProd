import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../../services/category/category.service";
import {LodgingOfferDTO} from "../../entities/lodgingOfferDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {ImageService} from "../../services/image/image.service";
import {FoodOfferDTO} from "../../entities/foodOfferDTO";
import {AttractionOfferDTO} from "../../entities/attractionOfferDTO";
import {ActivityOfferDTO} from "../../entities/activityOfferDTO";
import {CurrencyService} from "../../services/currency/currency.service";
import {FavouritesService} from "../../services/favourites/favourites.service";
import {UserService} from "../../services/user/user.service";
import Swal from "sweetalert2";
import {FavouriteOfferCategoryId} from "../../entities/favouriteOfferCategoryId";
import {BusinessService} from "../../services/business/business.service";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {OfferDistance} from "../../entities/offerDistance";
import {MapComponent} from "../../map/map.component";

@Component({
  selector: 'app-offers-container',
  templateUrl: './offers-container.component.html',
  styleUrls: ['./offers-container.component.scss']
})
export class OffersContainerComponent implements OnInit {

  category: string | undefined;
  userId: number | undefined;
  favouriteOffers: FavouriteOfferCategoryId[] | undefined;

  lodgingOffers: LodgingOfferDTO[] = [];
  lodgingOffersCopy: LodgingOfferDTO[] = []; // used for filtering results

  foodOffers: FoodOfferDTO[] = [];
  foodOffersCopy: FoodOfferDTO[] = []; // used for filtering results

  attractionOffers: AttractionOfferDTO[] = [];
  attractionOffersCopy: AttractionOfferDTO[] = []; // used for filtering results

  activityOffers: ActivityOfferDTO[] = [];
  activityOffersCopy: ActivityOfferDTO[] = []; // used for filtering results

  showNoOffersMessage: boolean = false;
  showFilterOptions: boolean = true;

  currencies: string[] = ['RON', 'EUR', 'USD', 'GBP'];
  selectedCurrency: string = this.currencies[0];

  showCurrency: boolean = true;
  showSorting: boolean = true;
  showSortingByDistance: boolean = false;
  showNrItems: boolean = true;

  page: number = 1;
  nrItemsOnPage: number = 10;
  sortingMethod: string = 'latest';

  showLoadingSpinner: boolean = true;

  locationInput: string | undefined;

  @ViewChild(MapComponent) mapComponent: any;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private imageService: ImageService,
    private userService: UserService,
    private businessService: BusinessService,
    private activatedRout: ActivatedRoute,
    private favouritesService: FavouritesService) {
    this.activatedRout.queryParams.subscribe(
    data => {
      this.category = data.category;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  public getOffers(): void {
    if (this.category !== undefined){
      if (this.category === 'lodging') {
        this.categoryService.getLodgingOffers().subscribe(
          (response: LodgingOfferDTO[]) => {
            this.lodgingOffers = response;
            this.lodgingOffersCopy = response;
            this.showLoadingSpinner = false;
            this.sortOffers(this.sortingMethod);
            if (response.length === 0){
              this.showNoOffersMessage = true;
              this.showFilterOptions = false;
            }
          },
          (error: HttpErrorResponse) => {
            this.showLoadingSpinner = false;
            this.showNoOffersMessage = true;
            alert(error.message);
          }
        )
      } else if (this.category === 'food'){
        this.categoryService.getFoodOffers().subscribe(
          (response: FoodOfferDTO[]) => {
            this.foodOffers = response;
            this.foodOffersCopy = response;
            this.showLoadingSpinner = false;
            this.sortOffers(this.sortingMethod);
            if (response.length === 0){
              this.showNoOffersMessage = true;
              this.showFilterOptions = false;
            }
          },
          (error: HttpErrorResponse) => {
            this.showLoadingSpinner = false;
            this.showNoOffersMessage = true;
            alert(error.message);
          }
        )
      } else if (this.category === 'attractions'){
        this.categoryService.getAttractionOffers().subscribe(
          (response: AttractionOfferDTO[]) => {
            this.attractionOffers = response;
            this.attractionOffersCopy = response;
            this.showLoadingSpinner = false;
            this.sortOffers(this.sortingMethod);
            if (response.length === 0){
              this.showNoOffersMessage = true;
              this.showFilterOptions = false;
            }
          },
          (error: HttpErrorResponse) => {
            this.showLoadingSpinner = false;
            this.showNoOffersMessage = true;
            alert(error.message);
          }
        )
      } else if (this.category === 'activities'){
        this.categoryService.getActivityOffers().subscribe(
          (response: ActivityOfferDTO[]) => {
            this.activityOffers = response;
            this.activityOffersCopy = response;
            this.showLoadingSpinner = false;
            this.sortOffers(this.sortingMethod);
            if (response.length === 0){
              this.showNoOffersMessage = true;
              this.showFilterOptions = false;
            }
          },
          (error: HttpErrorResponse) => {
            this.showLoadingSpinner = false;
            this.showNoOffersMessage = true;
            alert(error.message);
          }
        )
      }
    }
  }

  public counter(nr: number): Array<number> {
    return new Array(nr);
  }

  public changeNrItemsOnPage(nrItems: number): void {
    this.nrItemsOnPage = nrItems;
    this.page = 1;
  }

  public changePage(page: number): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.page = page;
  }

  public changeCurrency(currency: string): void {
    if (this.lodgingOffers.length > 0) {
      if (this.selectedCurrency.localeCompare(currency) !== 0) {
        this.setConvertedLodgingOfferPrices(this.selectedCurrency, currency);
      }
      this.selectedCurrency = currency;
    }
  }

  public setConvertedLodgingOfferPrices(fromCode: string, toCode: string): void {
    this.currencyService.getCurrencyConversionRate(fromCode, toCode).subscribe(
      (response: number) => {
        for (let offer of this.lodgingOffersCopy){
          offer.price = offer.price * response;
          offer.currency = toCode;
        }
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

  public addLodgingOffersToFavourites(id: number): void {
    if (this.userService.checkIfUserIsLoggedIn()) {
      let businessId = this.lodgingOffers.find(offer => offer.id === id)?.business?.id;
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

  public removeOfferFromFavourites(id: number, category: string) {
    if (this.userId && this.category) {
      this.favouritesService.removeOfferFromFavourites(this.userId, id, this.category).subscribe(
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

  public getLoggedInUserId(): void {
    if (this.userService.checkIfUserIsLoggedIn()) {
      this.userService.getLoggedInUserId().subscribe(
        (response: number) => {
          this.userId = response;
          this.getFavouriteOffersForUser();
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public getFavouriteOffersForUser(): void {
    if (this.userId) {
      this.favouritesService.getFavouriteOffersCategoryIdForUser(this.userId).subscribe(
        (response: FavouriteOfferCategoryId[]) => {
          this.favouriteOffers = response;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public checkIfOfferIsInFavourites(id: number, category: string): boolean {
    return !!this.favouriteOffers?.find(
      (offer) => offer.id === id && offer.category === category);
  }

  public getFilteredOffers(searchValue: string): void {
    if (this.category === 'lodging'){
      this.getFilteredLodgingOffers(searchValue);
    } else if (this.category === 'food'){
      this.getFilteredFoodOffers(searchValue);
    } else if (this.category === 'attractions'){
      this.getFilteredAttractionOffers(searchValue)
    } else if (this.category === 'activities'){
      this.getFilteredActivityOffers(searchValue);
    }
  }

  public getFilteredLodgingOffers(searchValue: string): void {
    this.lodgingOffers = this.lodgingOffersCopy.filter(
      offer => {
        return offer.title?.toLocaleLowerCase().match(searchValue) || offer.business?.name.toLocaleLowerCase().match(searchValue);
      }
    )
    this.checkIfLodgingOffersPresent();
    this.page = 1;
    this.sortOffers(this.sortingMethod);
  }

  public getFilteredFoodOffers(searchValue: string): void {
    this.foodOffers = this.foodOffersCopy.filter(
      offer => {
        return offer.business.name.toLocaleLowerCase().match(searchValue);
      }
    )
    this.checkIfFoodOffersPresent();
    this.page = 1;
    this.sortOffers(this.sortingMethod);
  }

  public getFilteredAttractionOffers(searchValue: string): void {
    this.attractionOffers = this.attractionOffersCopy.filter(
      offer => {
        return offer.title?.toLocaleLowerCase().match(searchValue);
      }
    )
    this.checkIfAttractionOffersPresent();
    this.page = 1;
    this.sortOffers(this.sortingMethod);
  }

  public getFilteredActivityOffers(searchValue: string): void {
    this.activityOffers = this.activityOffersCopy.filter(
      offer => {
        return offer.title?.toLocaleLowerCase().match(searchValue);
      }
    )
    this.checkIfActivityOffersPresent();
    this.page = 1;
    this.sortOffers(this.sortingMethod);
  }

  public sortOffers(sortingMethod: string) {
    this.sortingMethod = sortingMethod;
    if (this.category === 'lodging'){
      this.sortLodgingOffers(sortingMethod);
    } else if (this.category === 'food'){
      this.sortFoodOffers(sortingMethod);
    } else if (this.category === 'attractions'){
      this.sortAttractionOffers(sortingMethod);
    } else if (this.category === 'activities'){
      this.sortActivityOffers(sortingMethod);
    }
    this.page = 1;
  }

  private sortLodgingOffers(sortingMethod: string): void {
    if (sortingMethod === 'latest'){
      this.lodgingOffers = this.lodgingOffers.sort((o1, o2) => {
        return o1.createdAt < o2.createdAt ? 1 : -1
      })
    } else if (sortingMethod === 'oldest'){
      this.lodgingOffers = this.lodgingOffers.sort((o1, o2) => {
        return o1.createdAt > o2.createdAt ? 1 : -1
      })
    } else if (sortingMethod === 'priceAsc'){
      this.lodgingOffers = this.lodgingOffers.sort((o1, o2) => {
        return o1.price > o2.price ? 1 : -1
      })
    } else if (sortingMethod === 'priceDesc'){
      this.lodgingOffers = this.lodgingOffers.sort((o1, o2) => {
        return o1.price < o2.price ? 1 : -1
      })
    }
    else if (sortingMethod === 'nameAsc') {
      this.lodgingOffers = this.lodgingOffers.sort((o1, o2) => {
        if (o1.title !== undefined && o2.title !== undefined) {
          return o1.title.toLocaleLowerCase() > o2.title.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.business !== undefined && o2.business !== undefined) {
          return o1.business.name.toLocaleLowerCase() > o2.business.name.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.business !== undefined && o2.title !== undefined) {
          return o1.business.name.toLocaleLowerCase() > o2.title.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.title !== undefined && o2.business !== undefined) {
          return o1.title.toLocaleLowerCase() > o2.business.name.toLocaleLowerCase() ? 1 : -1;
        }
        return 0;
      });
    } else if (sortingMethod === 'nameDesc'){
      this.lodgingOffers = this.lodgingOffers.sort((o1, o2) => {
        if (o1.title !== undefined && o2.title !== undefined) {
          return o1.title.toLocaleLowerCase() < o2.title.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.business !== undefined && o2.business !== undefined) {
          return o1.business.name.toLocaleLowerCase() < o2.business.name.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.business !== undefined && o2.title !== undefined) {
          return o1.business.name.toLocaleLowerCase() < o2.title.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.title !== undefined && o2.business !== undefined) {
          return o1.title.toLocaleLowerCase() < o2.business.name.toLocaleLowerCase() ? 1 : -1;
        }
        return 0;
      });
    } else if (sortingMethod === 'distance'){
      this.lodgingOffers = this.lodgingOffers.sort((o1, o2) => {
        return o1.distance > o2.distance ? 1 : -1
      })
    }
  }

  public sortFoodOffers(sortingMethod: string): void {
    if (sortingMethod === 'latest'){
      this.foodOffers = this.foodOffers.sort((o1, o2) => {
        return o1.createdAt < o2.createdAt ? 1 : -1
      })
    } else if (sortingMethod === 'oldest'){
      this.foodOffers = this.foodOffers.sort((o1, o2) => {
        return o1.createdAt > o2.createdAt ? 1 : -1
      })
    }
    else if (sortingMethod === 'nameAsc'){
      this.foodOffers = this.foodOffers.sort((o1, o2) => {
          return o1.business.name.toLocaleLowerCase() > o2.business.name.toLocaleLowerCase() ? 1 : -1;
      })
    } else if (sortingMethod === 'nameDesc') {
      this.foodOffers = this.foodOffers.sort((o1, o2) => {
          return o1.business.name.toLocaleLowerCase() < o2.business.name.toLocaleLowerCase() ? 1 : -1;
      })
    } else if (sortingMethod === 'distance'){
      this.foodOffers = this.foodOffers.sort((o1, o2) => {
        return o1.distance > o2.distance ? 1 : -1
      })
    }
  }

  public sortAttractionOffers(sortingMethod: string): void {
    if (sortingMethod === 'latest'){
    this.attractionOffers = this.attractionOffers.sort((o1, o2) => {
      return o1.createdAt < o2.createdAt ? 1 : -1
    })
  } else if (sortingMethod === 'oldest'){
    this.attractionOffers = this.attractionOffers.sort((o1, o2) => {
      return o1.createdAt > o2.createdAt ? 1 : -1
    })
  }

    else if (sortingMethod === 'nameAsc'){
      this.attractionOffers = this.attractionOffers.sort((o1, o2) => {
          return o1.title.toLocaleLowerCase() > o2.title.toLocaleLowerCase() ? 1 : -1;
      })
    } else if (sortingMethod === 'nameDesc') {
      this.attractionOffers = this.attractionOffers.sort((o1, o2) => {
        return o1.title.toLocaleLowerCase() < o2.title.toLocaleLowerCase() ? 1 : -1;
      })
    } else if (sortingMethod === 'distance'){
      this.attractionOffers = this.attractionOffers.sort((o1, o2) => {
        return o1.distance > o2.distance ? 1 : -1
      })
    }
  }

  public sortActivityOffers(sortingMethod: string): void {
    if (sortingMethod === 'latest'){
      this.activityOffers = this.activityOffers.sort((o1, o2) => {
        return o1.createdAt < o2.createdAt ? 1 : -1
      })
    } else if (sortingMethod === 'oldest'){
      this.activityOffers = this.activityOffers.sort((o1, o2) => {
        return o1.createdAt > o2.createdAt ? 1 : -1
      })
    }
    else if (sortingMethod === 'nameAsc'){
      this.activityOffers = this.activityOffers.sort((o1, o2) => {
        return o1.title.toLocaleLowerCase() > o2.title.toLocaleLowerCase() ? 1 : -1;
      })
    } else if (sortingMethod === 'nameDesc') {
      this.activityOffers = this.activityOffers.sort((o1, o2) => {
        return o1.title.toLocaleLowerCase() < o2.title.toLocaleLowerCase() ? 1 : -1;
      })
    } else if (sortingMethod === 'distance'){
      this.activityOffers = this.activityOffers.sort((o1, o2) => {
        return o1.distance > o2.distance ? 1 : -1
      })
    }
  }

  offersDistance: OfferDistance[] = [];

  public setOffersDistance(address: Address): void {
    let destinationLocation: string;
    if (address.formatted_address === undefined && this.locationInput){
      // if user types location manually without auto-complete
      destinationLocation = this.locationInput;
    } else {
      destinationLocation = address.formatted_address;
    }
    if (destinationLocation) {
      this.showSortingByDistance = true;
      if (this.category === 'lodging') {
        for (let offer of this.lodgingOffers) {
          let originLocation: string;
          if (offer.business) {
            originLocation = offer.business.address + ', ' + offer.business.city;
          } else {
            originLocation = offer.address + ', ' + offer.city;
          }
          this.mapComponent.getDistance(offer.id, originLocation, destinationLocation);
        }
      } else if (this.category === 'food') {
        for (let offer of this.foodOffers) {
          let originLocation = offer.business.address + ', ' + offer.business.city;
          this.mapComponent.getDistance(offer.id, originLocation, destinationLocation);
        }
      } else if (this.category === 'attractions') {
        for (let offer of this.attractionOffers) {
          let originLocation = offer.address + ', ' + offer.city;
          this.mapComponent.getDistance(offer.id, originLocation, destinationLocation);
        }
      } else if (this.category === 'activities') {
        for (let offer of this.activityOffers) {
          let originLocation = offer.address + ', ' + offer.city;
          this.mapComponent.getDistance(offer.id, originLocation, destinationLocation);
        }
      }
    }
  }

  public getOfferDistance(receivedOfferDistance: OfferDistance): void { // received from map component
    if (this.category === 'lodging'){
      let offer = this.lodgingOffers.find(offer => offer.id === receivedOfferDistance.offerId);
      if (offer) {
        offer.distance = receivedOfferDistance.distance;
      }
    } else if (this.category === 'food'){
      let offer = this.foodOffers.find(offer => offer.id === receivedOfferDistance.offerId);
      if (offer) {
        offer.distance = receivedOfferDistance.distance;
      }
    } else if (this.category === 'attractions'){
      let offer = this.attractionOffers.find(offer => offer.id === receivedOfferDistance.offerId);
      if (offer) {
        offer.distance = receivedOfferDistance.distance;
      }
    } else if (this.category === 'activities'){
      let offer = this.activityOffers.find(offer => offer.id === receivedOfferDistance.offerId);
      if (offer) {
        offer.distance = receivedOfferDistance.distance;
      }
    }
    this.page = 1;
  }

  public checkIfLodgingOffersPresent(): void {
    if (this.lodgingOffers.length === 0){
      this.showCurrency = false;
      this.showSorting = false;
      this.showNrItems = false;
      this.showNoOffersMessage = true;
    } else {
      this.showCurrency = true;
      this.showSorting = true;
      this.showNrItems = true;
      this.showNoOffersMessage = false;
    }
  }

  public checkIfFoodOffersPresent(): void {
    if (this.foodOffers.length === 0){
      this.showSorting = false;
      this.showNrItems = false;
      this.showNoOffersMessage = true;
    } else {
      this.showSorting = true;
      this.showNrItems = true;
      this.showNoOffersMessage = false;
    }
  }

  public checkIfAttractionOffersPresent(): void {
    if (this.attractionOffers.length === 0){
      this.showSorting = false;
      this.showNrItems = false;
      this.showNoOffersMessage = true;
    } else {
      this.showSorting = true;
      this.showNrItems = true;
      this.showNoOffersMessage = false;
    }
  }

  public checkIfActivityOffersPresent(): void {
    if (this.activityOffers.length === 0){
      this.showSorting = false;
      this.showNrItems = false;
      this.showNoOffersMessage = true;
    } else {
      this.showSorting = true;
      this.showNrItems = true;
      this.showNoOffersMessage = false;
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

  public goToOfferPage(queryParams: any): void {
    this.router.navigate(['offer'], {
      queryParams: queryParams
    });
  }

  public getPageTitle(): string {
    if (this.category === 'lodging'){
      return 'Lodging Offers';
    } else if (this.category === 'food'){
      return 'Food Offers';
    } else if (this.category === 'attractions'){
      return 'Attraction Offers';
    } else if (this.category === 'activities'){
      return 'Activity Offers';
    }
    return 'Offers';
  }

  ngOnInit(): void {
    this.getOffers();
    this.getLoggedInUserId();
  }

}
