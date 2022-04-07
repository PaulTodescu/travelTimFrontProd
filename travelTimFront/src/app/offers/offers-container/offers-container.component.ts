import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../../services/category/category.service";
import {LodgingOfferDTO} from "../../entities/lodgingOfferDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {ImageService} from "../../services/image/image.service";
import {FoodOfferDTO} from "../../entities/foodOfferDTO";
import {AttractionOfferDTO} from "../../entities/attractionOfferDTO";
import {ActivityOfferDTO} from "../../entities/activityOfferDTO";

@Component({
  selector: 'app-offers-container',
  templateUrl: './offers-container.component.html',
  styleUrls: ['./offers-container.component.scss']
})
export class OffersContainerComponent implements OnInit {

  category: string | undefined;

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

  page: number = 1;
  nrItemsOnPage: number = 10;
  sortingMethod: string = 'latest';

  showLoadingSpinner: boolean = true;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private activatedRout: ActivatedRoute) {
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
            alert(error.message);
          }
        )
      }
    }
  }

  public changeNrItemsOnPage(nrItems: number): void {
    this.nrItemsOnPage = nrItems;
    this.page = 1;
  }

  public changePage(pageNumber: number): number {
    return pageNumber;
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
      this.page = 1;
      this.sortOffers(this.sortingMethod);
  }

  public getFilteredFoodOffers(searchValue: string): void {
      this.foodOffers = this.foodOffersCopy.filter(
        offer => {
          return offer.business.name.toLocaleLowerCase().match(searchValue);
        }
      )
      this.page = 1;
      this.sortOffers(this.sortingMethod);
  }

  public getFilteredAttractionOffers(searchValue: string): void {
      this.attractionOffers = this.attractionOffersCopy.filter(
        offer => {
          return offer.title?.toLocaleLowerCase().match(searchValue);
        }
      )
      this.page = 1;
      this.sortOffers(this.sortingMethod);
  }

  public getFilteredActivityOffers(searchValue: string): void {
      this.activityOffers = this.activityOffersCopy.filter(
        offer => {
          return offer.title?.toLocaleLowerCase().match(searchValue);
        }
      )
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

  public goToOfferPage(queryParams: any): void {
    this.router.navigate(['offer'], {
      queryParams: queryParams
    });
  }

  ngOnInit(): void {
    this.getOffers();
  }

}
