import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse, HttpParams} from "@angular/common/http";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";
import {LodgingOfferBaseDetailsDTO} from "../../entities/LodgingOfferBaseDetailsDTO";
import {FoodOfferBaseDetailsDTO} from "../../entities/FoodOfferBaseDetailsDTO";
import {AttractionOfferBaseDetailsDTO} from "../../entities/attractionOfferBaseDetailsDTO";
import {ActivityOfferBaseDetailsDTO} from "../../entities/activityOfferBaseDetailsDTO";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FilterOptionsComponent} from "./filter-options/filter-options.component";
import {CurrencyService} from "../../services/currency/currency.service";
import Swal from "sweetalert2";
import {LodgingService} from "../../services/lodging/lodging.service";
import {FoodService} from "../../services/food/food.service";
import {AttractionService} from "../../services/attraction/attraction.service";
import {ActivityService} from "../../services/activity/activity.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Location} from "@angular/common";
import {OffersStatisticsComponent} from "./offers-statistics/offers-statistics.component";

@Component({
  selector: 'app-user-offers',
  templateUrl: './user-offers.component.html',
  styleUrls: ['./user-offers.component.scss'],
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
export class UserOffersComponent implements OnInit {

  selectedCategory: string | undefined;

  lodgingOffers: LodgingOfferBaseDetailsDTO[] = [];
  filteredLodgingOffers: LodgingOfferBaseDetailsDTO[] = [];

  foodOffers: FoodOfferBaseDetailsDTO[] = [];
  filteredFoodOffers: FoodOfferBaseDetailsDTO[] = [];

  attractionOffers: AttractionOfferBaseDetailsDTO[] = [];
  filteredAttractionOffers: AttractionOfferBaseDetailsDTO[] = [];

  activityOffers: ActivityOfferBaseDetailsDTO[] = [];
  filteredActivityOffers: ActivityOfferBaseDetailsDTO[] = [];

  page: number = 1;
  nrItemsOnPage: number = 5;
  showLoadingSpinner: boolean = true;
  showNoOffersMessage: boolean = false;
  showFilterOptions: boolean = false;

  // filter options
  offeredByBusiness: boolean = false;
  offeredByPerson: boolean = false;
  selectedBusiness: string | undefined;
  sortMethod: string = 'latest';
  originalCurrency: string = 'RON';
  currency: string = this.originalCurrency;
  status: string | undefined;
  nrRooms: number | undefined;
  nrSingleBeds: number | undefined;
  nrDoubleBeds: number | undefined;

  constructor(
    private router: Router,
    private userService: UserService,
    private currencyService: CurrencyService,
    private dialog: MatDialog,
    private lodgingService: LodgingService,
    private foodService: FoodService,
    private attractionService: AttractionService,
    private activityService: ActivityService,
    private location: Location,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        if (data.section === 'offers') {
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
        }
      });
  }

  public switchSelectedCategory(category: string): void {
    this.selectedCategory = category;
    let params = new HttpParams().appendAll({
      section: 'offers',
      category: this.selectedCategory
    });
    this.location.replaceState(location.pathname, params.toString());
    this.showNoOffersMessage = false;
    this.showFilterOptions = false;
    this.getOffers();
    this.page = 1;
    this.resetFilterOptions();
  }

  public getOffers(): void {
    this.showLoadingSpinner = true;
    if (this.selectedCategory === 'lodging') {
      this.userService.getLodgingOffers().subscribe(
        (response: LodgingOfferBaseDetailsDTO[]) => {
          this.showLoadingSpinner = false;
          this.lodgingOffers = response;
          this.filteredLodgingOffers = response;
          if (response.length === 0) {
            this.showNoOffersMessage = true;
          } else {
            this.showFilterOptions = true;
          }
        },
        (error: HttpErrorResponse) => {
          this.showLoadingSpinner = false;
          alert(error.message);
          }
        )
      } else if (this.selectedCategory === 'food & beverage') {
      this.userService.getFoodOffers().subscribe(
        (response: FoodOfferBaseDetailsDTO[]) => {
          this.showLoadingSpinner = false;
          this.foodOffers = response;
          this.filteredFoodOffers = response;
          if (response.length === 0) {
            this.showNoOffersMessage = true;
          } else {
            this.showFilterOptions = true;
          }
        }, (error: HttpErrorResponse) => {
          this.showLoadingSpinner = false;
          alert(error.message);
        }
      )
    } else if (this.selectedCategory === 'attractions') {
      this.userService.getAttractionOffers().subscribe(
        (response: AttractionOfferBaseDetailsDTO[]) => {
          this.showLoadingSpinner = false;
          this.attractionOffers = response;
          this.filteredAttractionOffers = response;
          if (response.length === 0) {
            this.showNoOffersMessage = true;
          }
          else {
            this.showFilterOptions = true;
          }
        }, (error: HttpErrorResponse) => {
          this.showLoadingSpinner = false;
          alert(error.message);
        }
      )
    } else if (this.selectedCategory === 'activities') {
      this.userService.getActivityOffers().subscribe(
        (response: ActivityOfferBaseDetailsDTO[]) => {
          this.showLoadingSpinner = false;
          this.activityOffers = response;
          this.filteredActivityOffers = response;
          if (response.length === 0) {
            this.showNoOffersMessage = true;
          }
          else {
            this.showFilterOptions = true;
          }
          this.showLoadingSpinner = false;
        }, (error: HttpErrorResponse) => {
          this.showLoadingSpinner = false;
          alert(error.message);
        }
      )
    }
  }

  public goToLodgingOfferPage(offer: LodgingOfferBaseDetailsDTO): void {
    let queryParams: Params;
    if (offer.business !== undefined){
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

  public goToEditLodgingOfferPage(offer: LodgingOfferBaseDetailsDTO): void {
    let queryParams: Params;
    if (offer.business !== undefined){
      queryParams = {
        id: offer.id,
        type: 'legal'
      }
    } else {
      queryParams = {
        id: offer.id,
        type: 'physical'
      }
    }
    this.router.navigate(['offer/lodging/edit'], {
      queryParams: queryParams
    });
  }

  public goToFoodOfferPage(offer: FoodOfferBaseDetailsDTO): void {
    this.router.navigate(['offer'], {
      queryParams: {
        id: offer.id,
        category: 'food'
      }
    });
  }

  public goToEditFoodOfferPage(offer: FoodOfferBaseDetailsDTO): void{
    this.router.navigate(['offer/food/edit'], {
      queryParams: {
        id: offer.id
      }
    });
  }

  public goToAttractionOfferPage(offer: AttractionOfferBaseDetailsDTO): void {
    this.router.navigate(['offer'], {
      queryParams: {
        id: offer.id,
        category: 'attractions'
      }
    });
  }

  public goToEditAttractionOfferPage(offer: AttractionOfferBaseDetailsDTO): void {
    this.router.navigate(['offer/attraction/edit'], {
      queryParams: {
        id: offer.id,
      }
    });
  }

  public goToActivityOfferPage(offer: ActivityOfferBaseDetailsDTO): void {
    this.router.navigate(['offer'], {
      queryParams: {
        id: offer.id,
        category: 'activities'
      }
    });
  }

  public goToEditActivityOfferPage(offer: ActivityOfferBaseDetailsDTO): void {
    this.router.navigate(['offer/activity/edit'], {
      queryParams: {
        id: offer.id,
      }
    });
  }

  public openFilterOptionsModal(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      offerCategory: this.selectedCategory,
      offeredByBusiness: this.offeredByBusiness,
      offeredByPerson: this.offeredByPerson,
      businesses: this.getBusinessesForOffers(),
      selectedBusiness: this.selectedBusiness,
      sortMethod: this.sortMethod,
      currency: this.currency,
      status: this.status,
      nrRooms: this.nrRooms,
      nrSingleBeds: this.nrSingleBeds,
      nrDoubleBeds: this.nrDoubleBeds
    };
    const dialogRef = this.dialog.open(FilterOptionsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        this.offeredByBusiness = res.offeredByBusiness;
        this.offeredByPerson = res.offeredByPerson;
        this.selectedBusiness = res.selectedBusiness;
        this.sortMethod = res.sortMethod;
        this.currency = res.currency;
        this.status = res.status;
        if (this.currency !== this.originalCurrency) {
          this.setConvertedLodgingOfferPrices(this.originalCurrency, this.currency);
          this.originalCurrency = this.currency;
        }
        this.nrRooms = res.nrRooms;
        this.nrSingleBeds = res.nrSingleBeds;
        this.nrDoubleBeds = res.nrDoubleBeds;
        if (this.selectedCategory === 'lodging') {
          this.filteredLodgingOffers = this.lodgingOffers;
          this.filterByLodgingOptions();
          this.filterLodgingOffersByBusiness(this.selectedBusiness);
        } else if (this.selectedCategory === 'food & beverage') {
          this.filteredFoodOffers = this.foodOffers;
          this.filterFoodOffersByBusiness(this.selectedBusiness);
        } else if (this.selectedCategory === 'attractions') {
          this.filteredAttractionOffers = this.attractionOffers;
          this.filterAttractionOffersByBusiness(this.selectedBusiness);
        } else if (this.selectedCategory === 'activities') {
          this.filteredActivityOffers = this.activityOffers;
          this.filterActivityOffersByBusiness(this.selectedBusiness);
        }
        this.filterOffersByStatus();
        this.sortOffers();
      }
    });
  }

  public openStatisticsModal(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      offerCategory: this.selectedCategory,
    };
    this.dialog.open(OffersStatisticsComponent, dialogConfig);
  }


  public setConvertedLodgingOfferPrices(fromCode: string, toCode: string): void {
    this.currencyService.getCurrencyConversionRate(fromCode, toCode).subscribe(
      (response: number) => {
        for (let offer of this.filteredLodgingOffers){
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

  public getBusinessesForOffers(): string[] { // extract business names from offers
    let businessNames: string[] = [];
    if (this.selectedCategory === 'lodging'){
      for (let offer of this.lodgingOffers){
        if (offer.business !== undefined){
          businessNames.push(offer.business.name);
        }
      }
    } else if (this.selectedCategory === 'food & beverage') {
      for (let offer of this.foodOffers){
        businessNames.push(offer.business.name);
      }
    } else if (this.selectedCategory === 'attractions') {
      for (let offer of this.attractionOffers){
        if (offer.business !== null){
          businessNames.push(offer.business.name);
        }
      }
    } else if (this.selectedCategory === 'activities') {
      for (let offer of this.activityOffers){
        if (offer.business !== null){
          businessNames.push(offer.business.name);
        }
      }
    }
    return businessNames.filter((offer, index) =>
      businessNames.indexOf(offer) === index)
  }

  public filterLodgingOffersByBusiness(businessName: string | undefined): void{
    if (this.offeredByBusiness) {
      if (businessName !== undefined){
        this.filteredLodgingOffers = this.filteredLodgingOffers.filter(offer => offer.business?.name === businessName);
      } else {
        this.filteredLodgingOffers = this.filteredLodgingOffers.filter(offer => offer.business !== undefined);
      }
    } else if (this.offeredByPerson){
      this.filteredLodgingOffers = this.filteredLodgingOffers.filter(offer => offer.business === undefined);
    }
    this.checkIfOffersArePresent();
  }

  public filterFoodOffersByBusiness(businessName: string | undefined): void{
    if (businessName !== undefined){
      this.filteredFoodOffers = this.filteredFoodOffers.filter(offer => offer.business.name === businessName);
    }
    this.checkIfOffersArePresent();
  }

  public filterAttractionOffersByBusiness(businessName: string | undefined): void{
    if (this.offeredByBusiness) {
      if (businessName !== undefined){
        this.filteredAttractionOffers = this.filteredAttractionOffers.filter(offer => offer.business?.name === businessName);
      } else {
        this.filteredAttractionOffers = this.filteredAttractionOffers.filter(offer => offer.business !== null);
      }
    } else if (this.offeredByPerson){
      this.filteredAttractionOffers = this.filteredAttractionOffers.filter(offer => offer.business === null);
    }
    this.checkIfOffersArePresent();
  }

  public filterActivityOffersByBusiness(businessName: string | undefined): void{
    if (this.offeredByBusiness) {
      if (businessName !== undefined){
        this.filteredActivityOffers = this.filteredActivityOffers.filter(offer => offer.business?.name === businessName);
      } else {
        this.filteredActivityOffers = this.filteredActivityOffers.filter(offer => offer.business !== null);
      }
    } else if (this.offeredByPerson){
      this.filteredActivityOffers = this.filteredActivityOffers.filter(offer => offer.business === null);
    }
    this.checkIfOffersArePresent();
  }

  public resetFilterOptions(): void {
    this.offeredByBusiness = false;
    this.offeredByPerson = false;
    this.selectedBusiness = undefined;
    this.sortMethod = 'latest';
    this.currency = 'RON';
    this.status = undefined;
    this.nrRooms = undefined;
    this.nrSingleBeds = undefined;
    this.nrDoubleBeds = undefined;
    this.filteredLodgingOffers = [];
    this.filteredFoodOffers = [];
    this.filteredAttractionOffers = [];
    this.filteredActivityOffers = [];
  }

  public filterByLodgingOptions(): void {
    if (this.nrRooms !== undefined){
      this.filterLodgingOffersByNrRooms();
    }
    if (this.nrSingleBeds !== undefined){
      this.filterLodgingOffersByNrSingleBeds();
    }
    if (this.nrDoubleBeds !== undefined){
      this.filterLodgingOffersByNrDoubleBeds();
    }
    this.page = 1;
    this.checkIfOffersArePresent();
  }

  public filterLodgingOffersByNrRooms(): LodgingOfferBaseDetailsDTO[] {
    let nrRooms = this.nrRooms;
    this.filteredLodgingOffers = this.filteredLodgingOffers.filter(function (offer){
      return offer["nrRooms"] === nrRooms;
    });
    return this.filteredLodgingOffers;
  }

  public filterLodgingOffersByNrSingleBeds(): LodgingOfferBaseDetailsDTO[] {
    let nrSingleBeds = this.nrSingleBeds;
    this.filteredLodgingOffers = this.filteredLodgingOffers.filter(function (offer){
      return offer["nrSingleBeds"] === nrSingleBeds;
    });
    return this.filteredLodgingOffers;
  }

  public filterLodgingOffersByNrDoubleBeds(): LodgingOfferBaseDetailsDTO[] {
    let nrDoubleBeds = this.nrDoubleBeds;
    this.filteredLodgingOffers = this.filteredLodgingOffers.filter(function (offer){
      return offer["nrDoubleBeds"] === nrDoubleBeds;
    });
    return this.filteredLodgingOffers;
  }

  public filterOffersByStatus(): void {
    if (this.status) {
      if (this.selectedCategory === 'lodging') {
        this.filterLodgingOffersByStatus(this.status);
      } else if (this.selectedCategory === 'food & beverage') {
        this.filterFoodOffersByStatus(this.status);
      } else if (this.selectedCategory === 'attractions') {
        this.filterAttractionOffersByStatus(this.status);
      } else if (this.selectedCategory === 'activities') {
        this.filterActivityOffersByStatus(this.status);
      }
    }
    this.checkIfOffersArePresent();
  }

  public filterLodgingOffersByStatus(status: string): LodgingOfferBaseDetailsDTO[] {
    this.filteredLodgingOffers = this.filteredLodgingOffers.filter(function (offer){
      return offer["status"] === status;
    });
    return this.filteredLodgingOffers;
  }

  public filterFoodOffersByStatus(status: string): FoodOfferBaseDetailsDTO[] {
    this.filteredFoodOffers = this.filteredFoodOffers.filter(function (offer){
      return offer["status"] === status;
    });
    return this.filteredFoodOffers;
  }

  public filterAttractionOffersByStatus(status: string): AttractionOfferBaseDetailsDTO[] {
    this.filteredAttractionOffers = this.filteredAttractionOffers.filter(function (offer){
      return offer["status"] === status;
    });
    return this.filteredAttractionOffers;
  }

  public filterActivityOffersByStatus(status: string): ActivityOfferBaseDetailsDTO[] {
    this.filteredActivityOffers = this.filteredActivityOffers.filter(function (offer){
      return offer["status"] === status;
    });
    return this.filteredActivityOffers;
  }

  public openDeleteOfferDialog(offerId: number): void{
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#696969',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteOffer(offerId);
      }
    })
  }

  public deleteOffer(offerId: number): void {
    Swal.fire({
      title: 'Please Wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });
    if (this.selectedCategory === 'lodging') {
      this.deleteLodgingOffer(offerId);
    } else if (this.selectedCategory === 'food & beverage') {
      this.deleteFoodOffer(offerId);
    } else if (this.selectedCategory === 'attractions') {
      this.deleteAttractionOffer(offerId);
    } else if (this.selectedCategory === 'activities') {
      this.deleteActivityOffer(offerId);
    }
  }

  public deleteLodgingOffer(offerId: number): void {
    this.lodgingService.deleteLodgingOffer(offerId).subscribe(
      () => {
        this.onDeleteOfferSuccess();
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.checkIfOffersArePresent();
  }

  public deleteFoodOffer(offerId: number): void {
    Swal.fire({
      title: 'Please Wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });
    this.foodService.deleteFoodOffer(offerId).subscribe(
      () => {
        this.onDeleteOfferSuccess();
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    this.checkIfOffersArePresent();
  }

  public deleteAttractionOffer(offerId: number): void {
    this.attractionService.deleteAttractionOffer(offerId).subscribe(
      () => {
        this.onDeleteOfferSuccess();
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.checkIfOffersArePresent();
  }

  public deleteActivityOffer(offerId: number): void {
    this.activityService.deleteActivityOffer(offerId).subscribe(
      () => {
        this.onDeleteOfferSuccess();
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.checkIfOffersArePresent();
  }

  public onDeleteOfferSuccess(): void {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Offer Deleted!',
      showConfirmButton: false,
      timer: 2200,
    }).then(function(){
      location.reload();
    })
  }

  public sortOffers(): void {
    if (this.sortMethod !== undefined) {
      if (this.selectedCategory === 'lodging') {
        this.sortLodgingOffers(this.sortMethod);
      } else if (this.selectedCategory === 'food & beverage') {
        this.sortFoodOffers(this.sortMethod);
      } else if (this.selectedCategory === 'attractions') {
        this.sortAttractionOffers(this.sortMethod);
      } else if (this.selectedCategory === 'activities') {
        this.sortActivityOffers(this.sortMethod);
      }
    }
    this.page = 1;
  }

  private sortLodgingOffers(sortingMethod: string): void {
    if (sortingMethod === 'latest'){
      this.filteredLodgingOffers = this.filteredLodgingOffers.sort((o1, o2) => {
        return o1.createdAt < o2.createdAt ? 1 : -1
      })
    } else if (sortingMethod === 'oldest'){
      this.filteredLodgingOffers = this.filteredLodgingOffers.sort((o1, o2) => {
        return o1.createdAt > o2.createdAt ? 1 : -1
      })
    } else if (sortingMethod === 'priceAsc'){
      this.filteredLodgingOffers = this.filteredLodgingOffers.sort((o1, o2) => {
        return o1.price > o2.price ? 1 : -1
      })
    } else if (sortingMethod === 'priceDesc'){
      this.filteredLodgingOffers = this.filteredLodgingOffers.sort((o1, o2) => {
        return o1.price < o2.price ? 1 : -1
      })
    }
    else if (sortingMethod === 'nameAsc') {
      this.filteredLodgingOffers = this.filteredLodgingOffers.sort((o1, o2) => {
        if (o1.title !== undefined && o2.title !== undefined) {
          return o1.title.toLocaleLowerCase() > o2.title.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.business?.name !== undefined && o2.business?.name !== undefined) {
          return o1.business?.name.toLocaleLowerCase() > o2.business?.name.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.business?.name !== undefined && o2.title !== undefined) {
          return o1.business?.name.toLocaleLowerCase() > o2.title.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.title !== undefined && o2.business?.name !== undefined) {
          return o1.title.toLocaleLowerCase() > o2.business?.name.toLocaleLowerCase() ? 1 : -1;
        }
        return 0;
      });
    } else if (sortingMethod === 'nameDesc'){
      this.filteredLodgingOffers = this.filteredLodgingOffers.sort((o1, o2) => {
        if (o1.title !== undefined && o2.title !== undefined) {
          return o1.title.toLocaleLowerCase() < o2.title.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.business?.name !== undefined && o2.business?.name !== undefined) {
          return o1.business?.name.toLocaleLowerCase() < o2.business?.name.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.business?.name !== undefined && o2.title !== undefined) {
          return o1.business?.name.toLocaleLowerCase() < o2.title.toLocaleLowerCase() ? 1 : -1;
        } else if (o1.title !== undefined && o2.business?.name !== undefined) {
          return o1.title.toLocaleLowerCase() < o2.business?.name.toLocaleLowerCase() ? 1 : -1;
        }
        return 0;
      });
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
    }
  }

  public sortAttractionOffers(sortingMethod: string): void {
    if (sortingMethod === 'latest'){
      this.filteredAttractionOffers = this.filteredAttractionOffers.sort((o1, o2) => {
        return o1.createdAt < o2.createdAt ? 1 : -1
      })
    } else if (sortingMethod === 'oldest'){
      this.filteredAttractionOffers = this.filteredAttractionOffers.sort((o1, o2) => {
        return o1.createdAt > o2.createdAt ? 1 : -1
      })
    }

    else if (sortingMethod === 'nameAsc'){
      this.filteredAttractionOffers = this.filteredAttractionOffers.sort((o1, o2) => {
        return o1.title.toLocaleLowerCase() > o2.title.toLocaleLowerCase() ? 1 : -1;
      })
    } else if (sortingMethod === 'nameDesc') {
      this.filteredAttractionOffers = this.filteredAttractionOffers.sort((o1, o2) => {
        return o1.title.toLocaleLowerCase() < o2.title.toLocaleLowerCase() ? 1 : -1;
      })
    }
  }

  public sortActivityOffers(sortingMethod: string): void {
    if (sortingMethod === 'latest'){
      this.filteredActivityOffers = this.filteredActivityOffers.sort((o1, o2) => {
        return o1.createdAt < o2.createdAt ? 1 : -1
      })
    } else if (sortingMethod === 'oldest'){
      this.filteredActivityOffers = this.filteredActivityOffers.sort((o1, o2) => {
        return o1.createdAt > o2.createdAt ? 1 : -1
      })
    }
    else if (sortingMethod === 'nameAsc'){
      this.filteredActivityOffers = this.filteredActivityOffers.sort((o1, o2) => {
        return o1.title.toLocaleLowerCase() > o2.title.toLocaleLowerCase() ? 1 : -1;
      })
    } else if (sortingMethod === 'nameDesc') {
      this.filteredActivityOffers = this.filteredActivityOffers.sort((o1, o2) => {
        return o1.title.toLocaleLowerCase() < o2.title.toLocaleLowerCase() ? 1 : -1;
      })
    }
  }

  public checkLodgingOfferStatusAndChange(offerId: number, status: string): void {
    let offer = this.filteredLodgingOffers.find(offer => offer.id === offerId);
    if (offer) {
      if (offer.status === 'reserved') {
        Swal.fire({
          title: 'Are you sure?',
          text: 'This offer is currently marked as reserved',
          icon: 'warning',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Yes, activate it!',
          confirmButtonColor: '#0275d8',
          cancelButtonColor: '#696969'
        }).then((result) => {
          if (result.isConfirmed) {
            if (offer) {
              this.changeLodgingOfferStatus(offer.id, status);
            }
          }
        })
      } else {
        this.changeLodgingOfferStatus(offer.id, status);
      }
    }
  }

  public changeLodgingOfferStatus(offerId: number, status: string): void {
    this.lodgingService.changeLodgingOfferStatus(offerId, status).subscribe(
      () => {
        if (status === 'disabled') {
          this.onSuccessToast("Offer disabled");
        } else if (status === 'active') {
          this.onSuccessToast("Offer activated");
        }
        let offer = this.filteredLodgingOffers.find(offer => offer.id === offerId);
        if (offer) {
          offer.status = status;
        }
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public changeFoodOfferStatus(offerId: number, status: string): void {
    this.foodService.changeFoodOfferStatus(offerId, status).subscribe(
      () => {
        if (status === 'disabled') {
          this.onSuccessToast("Offer disabled");
        } else if (status === 'active'){
          this.onSuccessToast("Offer activated");
        }
        let offer = this.filteredFoodOffers.find(offer => offer.id === offerId);
        if (offer) {
          offer.status = status;
        }
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public changeAttractionOfferStatus(offerId: number, status: string): void {
    this.attractionService.changeAttractionOfferStatus(offerId, status).subscribe(
      () => {
        if (status === 'disabled') {
          this.onSuccessToast("Offer disabled");
        } else if (status === 'active'){
          this.onSuccessToast("Offer activated");
        }
        let offer = this.filteredAttractionOffers.find(offer => offer.id === offerId);
        if (offer) {
          offer.status = status;
        }
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public changeActivityOfferStatus(offerId: number, status: string): void {
    this.activityService.changeActivityOfferStatus(offerId, status).subscribe(
      () => {
        if (status === 'disabled') {
          this.onSuccessToast("Offer disabled");
        } else if (status === 'active'){
          this.onSuccessToast("Offer activated");
        }
        let offer = this.filteredActivityOffers.find(offer => offer.id === offerId);
        if (offer) {
          offer.status = status;
        }
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public checkIfOffersArePresent(): void { // extract business names from offers
    this.showNoOffersMessage = false;
    if (this.selectedCategory === 'lodging'){
      if (this.filteredLodgingOffers.length === 0) {
        this.showNoOffersMessage = true;
      }
    } else if (this.selectedCategory === 'food & beverage') {
      if (this.filteredFoodOffers.length === 0) {
        this.showNoOffersMessage = true;
      }
    } else if (this.selectedCategory === 'attractions') {
      if (this.filteredAttractionOffers.length === 0) {
        this.showNoOffersMessage = true;
      }
    } else if (this.selectedCategory === 'activities') {
      if (this.filteredActivityOffers.length === 0) {
        this.showNoOffersMessage = true;
      }
    }
  }

  public changePage(page: number): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.page = page;
  }

  public onSuccessToast(message: string): void {
    Swal.fire({
      toast: true,
      position: 'bottom-start',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    }).then(function(){})
  }

  ngOnInit(): void {
  }
}
