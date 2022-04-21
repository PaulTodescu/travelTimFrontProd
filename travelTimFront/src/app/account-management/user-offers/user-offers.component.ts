import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, NavigationStart, Params, Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";
import {LodgingOfferBaseDetailsDTO} from "../../entities/LodgingOfferBaseDetailsDTO";
import {FoodOfferBaseDetailsDTO} from "../../entities/FoodOfferBaseDetailsDTO";
import {AttractionOfferBaseDetailsDTO} from "../../entities/attractionOfferBaseDetailsDTO";
import {ActivityOfferBaseDetailsDTO} from "../../entities/activityOfferBaseDetailsDTO";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FilterOptionsComponent} from "./filter-options/filter-options.component";
import {of} from "rxjs";

@Component({
  selector: 'app-user-offers',
  templateUrl: './user-offers.component.html',
  styleUrls: ['./user-offers.component.scss']
})
export class UserOffersComponent implements OnInit {

  selectedCategory: string | undefined;

  lodgingOffers: LodgingOfferBaseDetailsDTO[] = [];
  lodgingOffersCopy: LodgingOfferBaseDetailsDTO[] = [];
  filteredLodgingOffers: LodgingOfferBaseDetailsDTO[] = [];

  foodOffers: FoodOfferBaseDetailsDTO[] = [];
  attractionOffers: AttractionOfferBaseDetailsDTO[] = [];
  activityOffers: ActivityOfferBaseDetailsDTO[] = [];

  page: number = 1;
  nrItemsOnPage: number = 5;
  showLoadingSpinner: boolean = true;
  showOffers: boolean = false;

  // filter options
  offeredByBusiness: boolean = false;
  offeredByPerson: boolean = false;
  selectedBusinessId: number | undefined;
  sortMethod: string = 'latest';
  currency: string = 'RON';
  nrRooms: number | undefined;
  nrSingleBeds: number | undefined;
  nrDoubleBeds: number | undefined;

  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        this.selectedCategory = data.category;
        this.getOffers();
      });
  }

  public switchSelectedCategory(category: string): void {
    this.router.navigate([],
      {queryParams: {category: category}, queryParamsHandling: 'merge'});
    this.page = 1;
    this.resetFilterOptions();
  }

  public getOffers(): void {
    if (this.selectedCategory === 'lodging') {
      this.userService.getLodgingOffers().subscribe(
        (response: LodgingOfferBaseDetailsDTO[]) => {
          this.lodgingOffers = response;
          this.lodgingOffersCopy = response;
          this.showOffers = true;
          this.showLoadingSpinner = false;
          },
        (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      } else if (this.selectedCategory === 'food & beverage') {
      this.userService.getFoodOffers().subscribe(
        (response: FoodOfferBaseDetailsDTO[]) => {
          this.foodOffers = response;
          this.showOffers = true;
          this.showLoadingSpinner = false;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    } else if (this.selectedCategory === 'attractions') {
      this.userService.getAttractionOffers().subscribe(
        (response: AttractionOfferBaseDetailsDTO[]) => {
          this.attractionOffers = response;
          this.showOffers = true;
          this.showLoadingSpinner = false;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    } else if (this.selectedCategory === 'activities') {
      this.userService.getActivityOffers().subscribe(
        (response: ActivityOfferBaseDetailsDTO[]) => {
          this.activityOffers = response;
          this.showOffers = true;
          this.showLoadingSpinner = false;
        }, (error: HttpErrorResponse) => {
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

  public openFilterOptionsModal(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      offerCategory: this.selectedCategory,
      offeredByBusiness: this.offeredByBusiness,
      offeredByPerson: this.offeredByPerson,
      selectedBusinessId: this.selectedBusinessId,
      sortMethod: this.sortMethod,
      currency: this.currency,
      nrRooms: this.nrRooms,
      nrSingleBeds: this.nrSingleBeds,
      nrDoubleBeds: this.nrDoubleBeds
    };
    const dialogRef = this.dialog.open(FilterOptionsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      this.offeredByBusiness = res.offeredByBusiness;
      this.offeredByPerson = res.offeredByPerson;
      this.selectedBusinessId = res.selectedBusinessId;
      this.sortMethod = res.sortMethod;
      this.currency = res.currency;
      this.nrRooms = res.nrRooms;
      this.nrSingleBeds = res.nrSingleBeds;
      this.nrDoubleBeds = res.nrDoubleBeds;
      if (this.selectedCategory === 'lodging'){
        this.filteredLodgingOffers = this.lodgingOffersCopy;
        this.filterByLodgingOptions();
      }
      this.sortOffers();
    })
  }

  public getBusinessesForOffers(): string[] {
    if (this.selectedCategory === 'lodging'){

    } else if (this.selectedCategory === 'food & beverage') {
      return this.foodOffers.map(offer => offer.business.name);
    } else if (this.selectedCategory === 'attractions') {
    } else if (this.selectedCategory === 'activities') {
    }
    return [];
  }

  public resetFilterOptions(): void {
    this.offeredByBusiness = false;
    this.offeredByPerson = false;
    this.selectedBusinessId = undefined;
    this.sortMethod = 'latest';
    this.currency = 'RON';
    this.nrRooms = undefined;
    this.nrSingleBeds = undefined;
    this.nrDoubleBeds = undefined;
  }

  public filterByLodgingOptions(): void {
    if (this.nrRooms !== undefined){
      this.lodgingOffers = this.filterLodgingOffersByNrRooms();
    }
    if (this.nrSingleBeds !== undefined){
      this.lodgingOffers = this.filterLodgingOffersByNrSingleBeds();
    }
    if (this.nrDoubleBeds !== undefined){
      this.lodgingOffers = this.filterLodgingOffersByNrDoubleBeds();
    }
    this.page = 1;
  }

  public filterLodgingOffersByNrRooms(): LodgingOfferBaseDetailsDTO[] {
    let nrRooms = this.nrRooms;
    this.filteredLodgingOffers = this.filteredLodgingOffers.filter(function (offer){
      return offer["nrRooms"] === nrRooms;
    })
    return this.filteredLodgingOffers;
  }

  public filterLodgingOffersByNrSingleBeds(): LodgingOfferBaseDetailsDTO[] {
    let nrSingleBeds = this.nrSingleBeds;
    this.filteredLodgingOffers = this.filteredLodgingOffers.filter(function (offer){
      return offer["nrSingleBeds"] === nrSingleBeds;
    })
    return this.filteredLodgingOffers;
  }

  public filterLodgingOffersByNrDoubleBeds(): LodgingOfferBaseDetailsDTO[] {
    let nrDoubleBeds = this.nrDoubleBeds;
    this.filteredLodgingOffers = this.filteredLodgingOffers.filter(function (offer){
      return offer["nrDoubleBeds"] === nrDoubleBeds;
    })
    return this.filteredLodgingOffers;
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
      this.lodgingOffers = this.lodgingOffers.sort((o1, o2) => {
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
    }
  }

  ngOnInit(): void {
    this.getOffers();
  }
}
