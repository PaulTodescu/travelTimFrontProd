import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Business} from "../../entities/business";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../services/user/user.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddBusinessComponent} from "../../business/add-business/add-business.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Ticket} from "../../entities/ticket";
import {AttractionOffer} from "../../entities/attractionOffer";
import {LocationService} from "../../services/location/location.service";

@Component({
  selector: 'app-add-attractions-offer-form',
  templateUrl: './add-attractions-offer-form.component.html',
  styleUrls: ['./add-attractions-offer-form.component.scss']
})
export class AddAttractionsOfferFormComponent implements OnInit, OnDestroy {

  showBusinessInput: boolean = false;
  userBusinesses: Business[] | undefined;
  cities: string[] = [];
  tickets: Ticket[] = [];

  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) { }

  AddAttractionOfferForm: FormGroup = this.formBuilder.group({
    business:[undefined],
    title: [undefined, [Validators.required, Validators.minLength(5)]],
    address: [undefined, [Validators.required, Validators.minLength(5)]],
    city:[undefined, [Validators.required]],
    description: [undefined, [Validators.required, Validators.minLength(10)]]
  })

  @Output() attractionsOfferFormEvent: EventEmitter<AttractionOffer> = new EventEmitter<AttractionOffer>()
  @Output() attractionsOfferFormValidityEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public toggleBusinessInput(): void {
    this.showBusinessInput = !this.showBusinessInput;
    this.sendFormData();
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

  public addTicket(): void {
    this.tickets.push(new Ticket('', NaN));
    this.sendFormData();
  }

  public getTickets(): Ticket[] {
    return this.tickets;
  }

  public changeTicketName(ticketName: string, ticketIndex: number){
    let ticket = this.tickets[ticketIndex];
    ticket.name = ticketName;
    this.tickets.splice(ticketIndex, 1, ticket);
    this.sendFormData();
  }

  public changeTicketPrice(ticketPrice: string, ticketIndex: number){
    let ticket = this.tickets[ticketIndex];
    if (Number(ticketPrice) >= 0 && ticketPrice.length > 0) {
      ticket.price = Number(ticketPrice);
    } else {
      ticket.price = NaN;
    }
    this.tickets.splice(ticketIndex, 1, ticket);
    this.sendFormData();
  }

  public deleteTicket(ticketIndex: number) {
    this.tickets.splice(ticketIndex, 1);
    this.sendFormData();
  }

  // sends attractions form value to AddOfferContainer component
  public sendFormData(): void {
    let attractionOfferFormData = Object.assign({});
    attractionOfferFormData = Object.assign(attractionOfferFormData, this.AddAttractionOfferForm.value);

    if (!this.showBusinessInput) { // no business
      attractionOfferFormData.business = undefined;
    }

    let attractionsOffer: AttractionOffer = new AttractionOffer(
      attractionOfferFormData.business,
      attractionOfferFormData.title,
      attractionOfferFormData.address,
      attractionOfferFormData.city,
      attractionOfferFormData.description,
      this.tickets,
    )
    this.attractionsOfferFormEvent.emit(attractionsOffer);
    if (this.AddAttractionOfferForm.valid){
      this.attractionsOfferFormValidityEvent.emit(true);
    } else {
      this.attractionsOfferFormValidityEvent.emit(false);
    }

  }

  public getFormTitleErrorMessage(){
    if (this.AddAttractionOfferForm.get('title')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.AddAttractionOfferForm.get('title')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  public getFormDescriptionErrorMessage(){
    if (this.AddAttractionOfferForm.get('description')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.AddAttractionOfferForm.get('description')?.hasError('minlength')){
      return 'enter at least 10 characters';
    }
    return;
  }

  public getFormAddressErrorMessage(){
    if (this.AddAttractionOfferForm.get('address')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.AddAttractionOfferForm.get('address')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  ngOnInit(): void {
    this.getBusinessesForCurrentUser();
    this.getCities();
  }

  ngOnDestroy(): void {
    this.attractionsOfferFormValidityEvent.emit(false);
  }

}

