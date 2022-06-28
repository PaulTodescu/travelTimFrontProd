import {Component, Injector, OnInit} from '@angular/core';
import {Business} from "../../entities/business";
import {Ticket} from "../../entities/ticket";
import {UserService} from "../../services/user/user.service";
import {LocationService} from "../../services/location/location.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ActivityService} from "../../services/activity/activity.service";
import {ActivityOfferEditDTO} from "../../entities/activityOfferEditDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {AddBusinessComponent} from "../../business/add-business/add-business.component";
import {ImageService} from "../../services/image/image.service";
import {Location} from "@angular/common";
import Swal from "sweetalert2";
import {OfferContact} from "../../entities/offerContact";
import {ContactService} from "../../services/contact/contact.service";

@Component({
  selector: 'app-edit-activity-offer',
  templateUrl: './edit-activity-offer.component.html',
  styleUrls: ['./edit-activity-offer.component.scss']
})
export class EditActivityOfferComponent implements OnInit {

  id: number | undefined;
  activityOffer: ActivityOfferEditDTO | undefined;
  showBusinessInput: boolean = false;
  userBusinesses: Business[] | undefined;
  cities: string[] = [];
  tickets: Ticket[] = [];
  images: File[] = [];
  contactDetails: OfferContact | undefined;
  isContactValid: boolean = true;

  constructor(
    private userService: UserService,
    private activityService: ActivityService,
    private locationService: LocationService,
    private dialog: MatDialog,
    private imageService: ImageService,
    private contactService: ContactService,
    private injector: Injector,
    private formBuilder: FormBuilder,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        this.id = data.id;
      });
    this.getActivityOfferToEdit();
  }

  EditActivityOfferForm: FormGroup = this.formBuilder.group({
    business:[undefined],
    title: [undefined, [Validators.required, Validators.minLength(5)]],
    address: [undefined, [Validators.required, Validators.minLength(5)]],
    city:[undefined],
    description: [undefined, [Validators.required, Validators.minLength(10)]]
  })

  public getActivityOfferToEdit(): void {
    if (this.id !== undefined) {
      this.activityService.getActivityOfferForEdit(this.id).subscribe(
        (response: ActivityOfferEditDTO) => {
          this.activityOffer = response;
          if (response.business !== null){
            this.showBusinessInput = true;
          }
          this.setActivityOfferInitialValues(response);
          this.getInitialContactDetails(response.id);
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public getInitialContactDetails(offerId: number): void{
    this.contactService.getContactDetails(offerId, 'activities').subscribe(
      (response: OfferContact) => {
        this.contactDetails = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getContactDetails(contactDetails: OfferContact) {
    this.contactDetails = contactDetails;
  }

  public checkContactValidity(isValid: boolean){
    this.isContactValid = isValid;
  }

  public setActivityOfferInitialValues(offer: ActivityOfferEditDTO): void {
    this.EditActivityOfferForm.patchValue({
      business: offer.business,
      title: offer.title,
      address: offer.address,
      city: offer.city,
      description: offer.description
    })
    this.tickets = offer.tickets;
  }

  public editActivityOffer(): void {
    this.activityOffer = Object.assign(this.activityOffer, this.EditActivityOfferForm.value);
    if (!this.EditActivityOfferForm.valid){
      this.onFail("Form is invalid");
      return;
    }
    if (!this.isContactValid){
      this.onFail("Invalid Contact Information");
      return;
    }
    if (this.images.length < 1){
      this.onFail("Add at least one image");
      return;
    }
    if(this.activityOffer !== undefined && this.id !== undefined){
      let tickets = this.activityOffer.tickets;
      if (tickets !== undefined) {
        for (let i = 0; i < tickets.length; i++) {
          if (tickets[i].name === undefined || tickets[i].name === '' || isNaN(tickets[i].price)) {
            this.onFail("Invalid ticket added");
            return;
          }
        }
      }
      this.activityService.editActivityOffer(this.activityOffer, this.id).subscribe(
        () => {
          this.sendImages();
          this.editActivityOfferContactDetails();
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  private editActivityOfferContactDetails() {
    if (this.id && this.contactDetails){
      this.contactService.setContactDetails(this.id, 'activities', this.contactDetails).subscribe(
        () => {},
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public toggleBusinessInput(): void {
    this.showBusinessInput = !this.showBusinessInput;
    if (!this.showBusinessInput){
      this.EditActivityOfferForm.get('business')?.setValue(null);
    }
  }

  private getBusinessesForCurrentUser() {
    this.userService.getBusinessesForCurrentUser().subscribe(
      (response: Business[]) => {
        this.userBusinesses = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  compareBusinesses(b1: Business, b2: Business): boolean {
    if (b1 !== null && b2 !== null) {
      return b1.id === b2.id;
    }
    return false;
  }

  public openAddBusinessModal(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-class' // in styles.css
    this.dialog.open(AddBusinessComponent, dialogConfig);
    this.dialog._getAfterAllClosed().subscribe(() => {
      this.getBusinessesForCurrentUser();
    });
  }

  public getCities(): void{
    this.locationService.getCities().subscribe(
      (response: string[]) => {
        this.cities = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getImages(receivedImages: File[]): void {
    this.images = receivedImages;
  }

  public sendImages(): void {
    if (this.id !== undefined){
      Swal.fire({
        title: 'Please Wait...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      });
      this.imageService.uploadOfferImages(this.id, 'activities', this.images).subscribe(
        () => {
          this.onSuccess();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public addTicket(): void {
    this.tickets.push(new Ticket('', NaN));
  }

  public getTickets(): Ticket[] {
    return this.tickets;
  }

  public changeTicketName(ticketName: string, ticketIndex: number){
    let ticket = this.tickets[ticketIndex];
    ticket.name = ticketName;
    this.tickets.splice(ticketIndex, 1, ticket);
  }

  public changeTicketPrice(ticketPrice: string, ticketIndex: number){
    let ticket = this.tickets[ticketIndex];
    if (Number(ticketPrice) >= 0 && ticketPrice.length > 0) {
      ticket.price = Number(ticketPrice);
    } else {
      ticket.price = NaN;
    }
    this.tickets.splice(ticketIndex, 1, ticket);
  }

  public deleteTicket(ticketIndex: number) {
    this.tickets.splice(ticketIndex, 1);
  }

  public convertNumberToString(nr: number): string {
    if (nr > 0) {
      return String(nr);
    }
    return '';
  }

  public getFormTitleErrorMessage(){
    if (this.EditActivityOfferForm.get('title')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.EditActivityOfferForm.get('title')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  public getFormDescriptionErrorMessage(){
    if (this.EditActivityOfferForm.get('description')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.EditActivityOfferForm.get('description')?.hasError('minlength')){
      return 'enter at least 10 characters';
    }
    return;
  }

  public getFormAddressErrorMessage(){
    if (this.EditActivityOfferForm.get('address')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.EditActivityOfferForm.get('address')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  public onSuccess(): void{
    let location: Location = this.injector.get(Location);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Offer was updated',
      showConfirmButton: false,
      timer: 2000
    }).then(function(){
      location.back();
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
    this.getBusinessesForCurrentUser();
    this.getCities();
  }

}
