import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user/user.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ActivatedRoute, Router} from "@angular/router";
import {UserDTO} from "../entities/userDTO";
import {ImageService} from "../services/image/image.service";
import {HttpErrorResponse} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {LegalPersonLodgingOfferDTO} from "../entities/LegalPersonLodgingOfferDTO";
import {PhysicalPersonLodgingOfferDTO} from "../entities/physicalPersonLodgingOfferDTO";
import {AttractionOfferForBusinessDTO} from "../entities/attractionOfferForBusinessDTO";
import {ActivityOfferForBusinessPageDTO} from "../entities/activityOfferForBusinessPageDTO";
import {Ticket} from "../entities/ticket";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {OfferTicketsComponent} from "../offer/offer-tickets/offer-tickets.component";

@Component({
  selector: 'app-user-provider-offers',
  templateUrl: './user-provider-offers.component.html',
  styleUrls: ['./user-provider-offers.component.scss'],
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
export class UserProviderOffersComponent implements OnInit {

  user: UserDTO | undefined;
  profileImage: string | undefined;

  selectedOfferCategory: string = 'lodging';
  page: number = 1;
  nrItemsOnPage: number = 5;

  lodgingOffers: PhysicalPersonLodgingOfferDTO[] = [];
  attractionOffers: AttractionOfferForBusinessDTO[] = [];
  activityOffers: ActivityOfferForBusinessPageDTO[] = [];

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        if (data.id) {
          this.getUser(data.id);
        }
      });
  }

  public getUser(userId: number): void {
    this.userService.getUserDetailsById(userId).subscribe(
      (response: UserDTO) => {
        this.user = response;
        this.getUserImage(response.id);
        this.getUserOffers(response.id);
      }
    )
  }

  public getUserImage(userId: number): void {
    this.imageService.getUserImage(userId).subscribe(
      (response: string) => {
        this.profileImage = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getSanitizerUrl(url : string | undefined) {
    if (url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return null;
  }

  public getUserOffers(userId: number): void {
    this.userService.getLodgingOffersForUserPage(userId).subscribe(
      (response: PhysicalPersonLodgingOfferDTO[]) => {
        this.lodgingOffers = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    this.userService.getAttractionOffersForUserPage(userId).subscribe(
      (response: AttractionOfferForBusinessDTO[]) => {
        this.attractionOffers = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    this.userService.getActivityOffersForUserPage(userId).subscribe(
      (response: ActivityOfferForBusinessPageDTO[]) => {
        this.activityOffers = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public switchSelectedOfferCategory(category: string): void {
    this.selectedOfferCategory = category;
  }

  public seeTickets(tickets: Ticket[] | undefined): void {
    if (tickets !== undefined) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.autoFocus = false;
      dialogConfig.panelClass = 'dialog-class' // in styles.css
      dialogConfig.data = {
        tickets: tickets
      }
      this.dialog.open(OfferTicketsComponent, dialogConfig);
    }
  }

  public goToLodgingOfferPage(offer: LegalPersonLodgingOfferDTO): void {
    this.router.navigate(['offer'], {
      queryParams: {
        id: offer.id,
        category: 'lodging',
        type: 'physical'
      }
    });
  }

  public goToAttractionOfferPage(offer: AttractionOfferForBusinessDTO) {
    this.router.navigate(['offer'], {
      queryParams: {
        id: offer.id,
        category: 'attractions'
      }
    });
  }

  public goToActivityOfferPage(offer: ActivityOfferForBusinessPageDTO) {
    this.router.navigate(['offer'], {
      queryParams: {
        id: offer.id,
        category: 'activities'
      }
    });
  }

  ngOnInit(): void {
  }

}
