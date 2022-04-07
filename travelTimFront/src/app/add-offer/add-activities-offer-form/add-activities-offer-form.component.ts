import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Business} from "../../entities/business";
import {UserService} from "../../services/user/user.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {AddBusinessComponent} from "../../account-management/account/add-business/add-business.component";
import {Ticket} from "../../entities/ticket";
import {ActivityOffer} from "../../entities/activityOffer";
import {LocationService} from "../../services/location/location.service";

@Component({
  selector: 'app-add-activities-offer-form',
  templateUrl: './add-activities-offer-form.component.html',
  styleUrls: ['./add-activities-offer-form.component.scss']
})
export class AddActivitiesOfferFormComponent implements OnInit, OnDestroy {

  showBusinessInput: boolean = false;
  userBusinesses: Business[] | undefined;
  cities: string[] = [];
  tickets: Ticket[] = [];

  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) { }

  AddActivityOfferForm: FormGroup = this.formBuilder.group({
    business:[undefined],
    title: [undefined, [Validators.required, Validators.minLength(5)]],
    address: [undefined, [Validators.required, Validators.minLength(5)]],
    city:[undefined, [Validators.required]],
    description: [undefined, [Validators.required, Validators.minLength(10)]]
  })

  @Output() activityOfferFormEvent: EventEmitter<ActivityOffer> = new EventEmitter<ActivityOffer>()
  @Output() activityOfferFormValidityEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

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
    if (Number(ticketPrice) >= 0) {
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

  // sends activity form value to AddOfferContainer component
  public sendFormData(): void {
    let activityOfferFormData = Object.assign({});
    activityOfferFormData = Object.assign(activityOfferFormData, this.AddActivityOfferForm.value);

    if (!this.showBusinessInput) { // no business
      activityOfferFormData.business = undefined;
    }

    let activityOffer: ActivityOffer = new ActivityOffer(
      activityOfferFormData.business,
      activityOfferFormData.title,
      activityOfferFormData.address,
      activityOfferFormData.city,
      activityOfferFormData.description,
      this.tickets
    )
    this.activityOfferFormEvent.emit(activityOffer);
    if (this.AddActivityOfferForm.valid){
      this.activityOfferFormValidityEvent.emit(true);
    } else {
      this.activityOfferFormValidityEvent.emit(false);
    }
  }

  public getFormTitleErrorMessage(){
    if (this.AddActivityOfferForm.get('title')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.AddActivityOfferForm.get('title')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  public getFormAddressErrorMessage(){
    if (this.AddActivityOfferForm.get('address')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.AddActivityOfferForm.get('address')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  public getFormDescriptionErrorMessage(){
    if (this.AddActivityOfferForm.get('description')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.AddActivityOfferForm.get('description')?.hasError('minlength')){
      return 'enter at least 10 characters';
    }
    return;
  }

  ngOnInit(): void {
    this.getCities();
    this.getBusinessesForCurrentUser();
  }

  ngOnDestroy(): void {
    this.activityOfferFormValidityEvent.emit(false);
  }

}
