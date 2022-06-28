import {Component, Injector, OnInit} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {LocationService} from "../../services/location/location.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AttractionService} from "../../services/attraction/attraction.service";
import {ActivatedRoute} from "@angular/router";
import {Business} from "../../entities/business";
import {Ticket} from "../../entities/ticket";
import {HttpErrorResponse} from "@angular/common/http";
import {AddBusinessComponent} from "../../business/add-business/add-business.component";
import {AttractionOfferEditDTO} from "../../entities/attractionOfferEditDTO";
import {ImageService} from "../../services/image/image.service";
import {Location} from "@angular/common";
import Swal from "sweetalert2";
import {OfferContact} from "../../entities/offerContact";
import {ContactService} from "../../services/contact/contact.service";

@Component({
  selector: 'app-edit-attraction-offer',
  templateUrl: './edit-attraction-offer.component.html',
  styleUrls: ['./edit-attraction-offer.component.scss']
})
export class EditAttractionOfferComponent implements OnInit {

  id: number | undefined;
  attractionOffer: AttractionOfferEditDTO | undefined;
  showBusinessInput: boolean = false;
  userBusinesses: Business[] | undefined;
  cities: string[] = [];
  tickets: Ticket[] = [];
  images: File[] = [];
  contactDetails: OfferContact | undefined;
  isContactValid: boolean = true;

  constructor(
    private userService: UserService,
    private attractionService: AttractionService,
    private locationService: LocationService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private contactService: ContactService,
    private injector: Injector,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        this.id = data.id;
      });
    this.getAttractionOfferToEdit();
  }

  EditAttractionOfferForm: FormGroup = this.formBuilder.group({
    business:[undefined],
    title: [undefined, [Validators.required, Validators.minLength(5)]],
    address: [undefined, [Validators.required, Validators.minLength(5)]],
    city:[undefined],
    description: [undefined, [Validators.required, Validators.minLength(10)]]
  })

  public getAttractionOfferToEdit(): void {
    if (this.id !== undefined) {
      this.attractionService.getAttractionOfferForEdit(this.id).subscribe(
        (response: AttractionOfferEditDTO) => {
          this.attractionOffer = response;
          if (response.business !== null){
            this.showBusinessInput = true;
          }
          this.setAttractionOfferInitialValues(response);
          this.getInitialContactDetails(response.id);
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public getInitialContactDetails(offerId: number): void{
    this.contactService.getContactDetails(offerId, 'attractions').subscribe(
      (response: OfferContact) => {
        this.contactDetails = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public setAttractionOfferInitialValues(offer: AttractionOfferEditDTO): void {
    this.EditAttractionOfferForm.patchValue({
      business: offer.business,
      title: offer.title,
      address: offer.address,
      city: offer.city,
      description: offer.description
    })
    this.tickets = offer.tickets;
  }

  public getContactDetails(contactDetails: OfferContact) {
    this.contactDetails = contactDetails;
  }

  public checkContactValidity(isValid: boolean){
    this.isContactValid = isValid;
  }

  public editAttractionOffer(): void {
    this.attractionOffer = Object.assign(this.attractionOffer, this.EditAttractionOfferForm.value);
    if (!this.EditAttractionOfferForm.valid){
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
    if (this.attractionOffer !== undefined && this.id !== undefined) {
      let tickets = this.attractionOffer.tickets;
      if (tickets !== undefined) {
        for (let i = 0; i < tickets.length; i++) {
          if (tickets[i].name === undefined || tickets[i].name === '' || isNaN(tickets[i].price)) {
            this.onFail("Invalid ticket added");
            return;
          }
        }
      }
      this.attractionService.editAttractionOffer(this.attractionOffer, this.id).subscribe(
        () => {
          this.sendImages();
          this.editAttractionOfferContactDetails();
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  private editAttractionOfferContactDetails() {
    if (this.id && this.contactDetails){
      this.contactService.setContactDetails(this.id, 'attractions', this.contactDetails).subscribe(
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
      this.EditAttractionOfferForm.get('business')?.setValue(null);
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
      this.imageService.uploadOfferImages(this.id, 'attractions', this.images).subscribe(
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
    if (this.EditAttractionOfferForm.get('title')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.EditAttractionOfferForm.get('title')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  public getFormDescriptionErrorMessage(){
    if (this.EditAttractionOfferForm.get('description')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.EditAttractionOfferForm.get('description')?.hasError('minlength')){
      return 'enter at least 10 characters';
    }
    return;
  }

  public getFormAddressErrorMessage(){
    if (this.EditAttractionOfferForm.get('address')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.EditAttractionOfferForm.get('address')?.hasError('minlength')){
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
