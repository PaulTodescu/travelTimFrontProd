import { Component, OnInit } from '@angular/core';
import {FavouriteOffer} from "../../entities/favouriteOffer";
import {FavouritesService} from "../../services/favourites/favourites.service";
import {UserService} from "../../services/user/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {

  favouriteOffers: FavouriteOffer[] = [];
  userId: number | undefined;

  page: number = 1;
  nrItemsOnPage: number = 10;
  nrOffers: number = 0;

  showLoadingSpinner = true;
  showNoOffersMessage: boolean = false;

  sortingMethod: string = 'latest';

  constructor(
    private userService: UserService,
    private favouritesService: FavouritesService,
    private sanitizer: DomSanitizer,
    private router: Router) { }

  public getLoggedInUserId(): void {
    if (this.userService.checkIfUserIsLoggedIn()){
      this.userService.getLoggedInUserId().subscribe(
        (response: number) => {
          this.userId = response;
          this.getFavouriteOffers();
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public getFavouriteOffers(): void{
    if (this.userId){
      this.favouritesService.getFavouriteOffersForUser(this.userId).subscribe(
        (response: FavouriteOffer[]) => {
          this.favouriteOffers = response;
          this.nrOffers = response.length;
          this.showLoadingSpinner = false;
          this.sortOffers(this.sortingMethod);
          if (response.length === 0){
            this.showNoOffersMessage = true;
          }
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public removeOfferFromFavourites(offerId: number, offerCategory: string) {
    if (this.userId) {
      this.favouritesService.removeOfferFromFavourites(this.userId, offerId, offerCategory).subscribe(
        () => {
          this.favouriteOffers.splice(this.favouriteOffers?.findIndex(
            offer => offer.id === offerId && offer.category === offerCategory
          ), 1);
          this.showSuccessfulToastMessage('Offer removed from favourites');
          if (this.favouriteOffers.length === 0){
            this.showNoOffersMessage = true;
          }
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public getSanitizerUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public goToOfferPage(queryParams: any): void {
    this.router.navigate(['offer'], {
      queryParams: queryParams
    });
  }

  public sortOffers(sortingMethod: string): void {
    this.sortingMethod = sortingMethod;
    if (this.sortingMethod === 'latest'){
      this.favouriteOffers = this.favouriteOffers.sort((o1, o2) => {
        return o1.createdAt < o2.createdAt ? 1 : -1
      })
    } else if (this.sortingMethod === 'oldest'){
      this.favouriteOffers = this.favouriteOffers.sort((o1, o2) => {
        return o1.createdAt > o2.createdAt ? 1 : -1
      })
    }
    else if (this.sortingMethod === 'nameAsc'){
      this.favouriteOffers = this.favouriteOffers.sort((o1, o2) => {
        return o1.title.toLocaleLowerCase() > o2.title.toLocaleLowerCase() ? 1 : -1;
      })
    } else if (this.sortingMethod === 'nameDesc') {
      this.favouriteOffers = this.favouriteOffers.sort((o1, o2) => {
        return o1.title.toLocaleLowerCase() < o2.title.toLocaleLowerCase() ? 1 : -1;
      })
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

  ngOnInit(): void {
    this.getLoggedInUserId();
  }
}
