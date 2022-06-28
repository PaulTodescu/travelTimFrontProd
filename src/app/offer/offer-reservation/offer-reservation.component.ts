import {Component, Inject, Injector, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {UserDTO} from "../../entities/userDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LodgingService} from "../../services/lodging/lodging.service";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DaySchedule} from "../../entities/daySchedule";
import {ActivatedRoute, Router} from "@angular/router";
import {OfferReservation} from "../../entities/offerReservation";
import {ReservationService} from "../../services/reservation/reservation.service";
import Swal from "sweetalert2";
import {LodgingOfferDetailsForReservationDTO} from "../../entities/lodgingOfferDetailsForReservationDTO";

@Component({
  selector: 'app-offer-reservation',
  templateUrl: './offer-reservation.component.html',
  styleUrls: ['./offer-reservation.component.scss'],
})

export class OfferReservationComponent implements OnInit {

  @ViewChild("arrivalDatePicker") arrivalDatePicker: any;

  offer: LodgingOfferDetailsForReservationDTO | undefined;
  offerType: string | undefined;

  totalPrice: number | undefined;
  nrNights: number = 1;

  schedule: DaySchedule[] | undefined;

  minArrivalDate: Date = new Date();
  minDepartureDate: Date = new Date();

  maxArrivalDate: Date;
  maxDepartureDate: Date;

  selectedArrivalDate: Date | undefined;
  selectedDepartureDate: Date | undefined;

  userId: number | undefined;

  timeSlots: string[] = [
    "00:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00", "03:00 - 04:00", "04:00 - 05:00",
    "05:00 - 06:00", "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00",
    "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00",
    "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00",
    "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 00:00"
  ]
  timeSlotsCopy: string[] = this.timeSlots;
  arrivalTimeSelectEnabled: boolean = false; // only enable arrival time after arrival date is selected

  closedBusinessDaysFilter: any;

  constructor(
    private userService: UserService,
    private lodgingService: LodgingService,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    private injector: Injector,
    @Inject(MAT_DIALOG_DATA) public data: { offerId: number },
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        this.offerType = data.type;
      });
    if (this.offerType === 'legal'){
      this.getBusinessScheduleForLegalLodgingOffer(this.data.offerId);
    }
    let date = new Date();
    this.minDepartureDate.setDate(date.getDate() + 1);
    this.maxArrivalDate = new Date(date.getFullYear(), date.getMonth() + 2, 0);
    this.maxDepartureDate = new Date(date.getFullYear(), date.getMonth() + 2, 0);
  }

  ReservationForm = this.formBuilder.group({
    arrivalDate:[''],
    arrivalTime:[''],
    departureDate:[''],
    firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(?:[a-zA-Z\s]+)?$/)]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(?:[a-zA-Z\s]+)?$/)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.minLength(5), Validators.pattern("^[0-9]*$")]]
  })

  public getUserDetails(){
    this.userService.getLoggedInUser().subscribe(
      (response: UserDTO) => {
        this.setUserFormValues(response);
        this.userId = response.id;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public setUserFormValues(user: UserDTO): void {
    this.ReservationForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber
    })
  }

  public getLodgingOfferForReservation(): void {
    if (this.data.offerId) {
      this.reservationService.getLodgingOfferDetailsForReservation(this.data.offerId).subscribe(
        (response: LodgingOfferDetailsForReservationDTO) => {
          this.offer = response;
          this.totalPrice = response.price;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public arrivalDateChangeEvent(newDate: MatDatepickerInputEvent<Date>) {
    if (newDate.value) {
      let date: Date = newDate.value;
      this.selectedArrivalDate = date;
      this.minDepartureDate.setDate(date.getDate() + 1);
      this.arrivalTimeSelectEnabled = true;
      this.setTotalPrice();
      this.filterTimeSlotsToMatchBusinessSchedule();
      if (this.selectedDepartureDate) {
        if (this.selectedArrivalDate.getTime() >= this.selectedDepartureDate.getTime()) {
          this.ReservationForm.get("departureDate")?.reset();
        }
      }
    }
  }

  public departureDateChangeEvent(newDate: MatDatepickerInputEvent<Date>) {
    if (newDate.value) {
      let date: Date = newDate.value;
      this.selectedDepartureDate = date;
      this.maxArrivalDate = new Date();
      this.maxArrivalDate.setMonth(date.getMonth());
      this.maxArrivalDate.setDate(date.getDate() - 1);
      this.setTotalPrice();
      if (this.selectedArrivalDate) {
        if (this.selectedDepartureDate.getTime() <= this.selectedArrivalDate?.getTime()) {
          this.ReservationForm.get("arrivalDate")?.reset();
          this.arrivalTimeSelectEnabled = false;
        }
      }
    }
  }

  public getBusinessScheduleForLegalLodgingOffer(offerId: number): void {
    this.lodgingService.getBusinessScheduleForLegalLodgingOffer(offerId).subscribe(
      (response: DaySchedule[]) => {
        this.schedule = response;
        this.closedBusinessDaysFilter = (d: Date): boolean => {
          let closedDay = this.getDayStringFromDate(d);
          return !this.getClosedDays().find(day => day === closedDay);
        }
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public filterTimeSlotsToMatchBusinessSchedule(): void {
    if (this.schedule) {
      if (this.selectedArrivalDate){
        let dayScheduleForSelectedDay = this.getScheduleForDay(this.selectedArrivalDate);
        let startHourTimeSlot = this.timeSlotsCopy.find((timeSlot) => {
          if (dayScheduleForSelectedDay) {
            return timeSlot.startsWith(dayScheduleForSelectedDay.startTime)
          }
          return false;
        })

        let endHourTimeSlot = this.timeSlotsCopy.find((timeSlot) => {
          if (dayScheduleForSelectedDay) {
            return timeSlot.endsWith(dayScheduleForSelectedDay.endTime)
          }
          return false;
        })
        if (startHourTimeSlot && endHourTimeSlot){
          this.timeSlots = this.timeSlotsCopy.slice(
            this.timeSlotsCopy.indexOf(startHourTimeSlot),
            this.timeSlotsCopy.indexOf(endHourTimeSlot) + 1
          )
        }
      }
    }
  }

  public getScheduleForDay(date: Date): DaySchedule | undefined {
    if (this.schedule) {
      let day: string = this.getDayStringFromDate(date);
      return  this.schedule.find(daySchedule => daySchedule.day === day);
    }
    return undefined;
  }

  public getDayStringFromDate(date: Date): string {
    if (date) {
      let weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return weekdays[date.getDay()];
    }
    return '';
  }

  public getClosedDays(): string[] {
    if (this.schedule) {
      let filteredSchedule = this.schedule.filter(daySchedule => daySchedule.closed);
      if (filteredSchedule) {
        return filteredSchedule.map(daySchedule => daySchedule.day);
      }
      return [];
    }
    return [];
  }

  public setTotalPrice(): void {
    this.nrNights = this.getNrNightsBetweenArrivalAnDeparture();
    if (this.offer && this.totalPrice) {
      this.totalPrice = this.offer.price * this.nrNights;
    }
  }

  public getNrNightsBetweenArrivalAnDeparture(): number {
    if (this.selectedArrivalDate && this.selectedDepartureDate){
      const oneDay = 1000 * 60 * 60 * 24; // in milliseconds
      const diffInTime = this.selectedDepartureDate.getTime() - this.selectedArrivalDate.getTime();
      return Math.round(diffInTime / oneDay);
    }
    return 1;
  }

  public sendReservation(): void {
    if (this.userService.checkIfUserIsLoggedIn() && this.offer) {
      let arrivalDate = this.selectedArrivalDate?.toLocaleDateString('en-GB');
      let arrivalTime = this.ReservationForm.get('arrivalTime')?.value;
      let departureDate = this.selectedDepartureDate?.toLocaleDateString('en-GB');
      if (!arrivalDate) {
        this.onFail("Select a valid arrival date");
      } else if (!departureDate) {
        this.onFail("Select a valid departure date");
      }
      let firstName = this.ReservationForm.get('firstName')?.value;
      let lastName = this.ReservationForm.get('lastName')?.value;
      let email = this.ReservationForm.get('email')?.value;
      let phoneNumber = this.ReservationForm.get('phoneNumber')?.value;
      let price = this.totalPrice;
      let currency = this.offer.currency;
      let nrRooms = this.offer.nrRooms;
      let nrBathrooms = this.offer.nrBathrooms;
      let nrSingleBeds = this.offer.nrSingleBeds;
      let nrDoubleBeds = this.offer.nrDoubleBeds;
      let floor = this.offer.floor;
      let providerName = this.offer.providerName;
      let providerEmail = this.offer.providerEmail;
      let providerPhone = this.offer.providerPhone;
      let offerTitle = this.offer.offerTitle;
      let address = this.offer.address;
      let city = this.offer.city;
      let nrNights = this.getNrNightsBetweenArrivalAnDeparture();
      if (arrivalDate && departureDate && price && currency) {
        let reservation: OfferReservation = new OfferReservation(
          arrivalDate, arrivalTime, departureDate, firstName, lastName, email, phoneNumber, price, currency, nrNights,
          nrRooms, nrBathrooms, nrSingleBeds, nrDoubleBeds, floor, providerName, providerEmail, providerPhone, offerTitle,
          address, city
        )
        Swal.fire({
          title: 'Confirm Email',
          html: 'Your reservation details will be sent to <br><b>' + email + '</b>',
          icon: 'info',
          showConfirmButton: true,
          showCancelButton: true,
          focusConfirm: true,
          iconColor: '#034953',
          confirmButtonColor: '#034953',
          cancelButtonColor: '#696969',
          confirmButtonText: 'Confirm'
        }).then((result) => {
          if (result.isConfirmed) {
            if (this.userId && this.offer) {
              Swal.fire({
                title: 'Please Wait...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading()
                }
              });
              this.reservationService.addReservation(this.userId, this.offer.id, reservation).subscribe(
                () => {
                  Swal.close();
                  this.onSuccessfulReservation();
                }, (error: HttpErrorResponse) => {
                  alert(error.message);
                }
              )
            }
          }
        })
      }
    } else {
      this.onFail("You must log in to your account");
    }
  }

  public getNrUtilities(): number {
    if (this.offer){
      return this.offer.utilities.length;
    }
    return 0;
  }

  public getNrSingleBeds(): number {
    if (this.offer){
      return this.offer.nrSingleBeds;
    }
    return 0;
  }

  public getNrDoubleBeds(): number {
    if (this.offer){
      return this.offer.nrDoubleBeds;
    }
    return 0;
  }

  public getFormArrivalDateErrorMessage() {
    if (this.ReservationForm.get('arrivalDate')?.hasError('required')){
      return 'you must select a date';
    }
    else if (this.ReservationForm.get('arrivalDate')?.invalid){
      return 'invalid date selected';
    }
    return;
  }

  public getFormDepartureDateErrorMessage() {
    if (this.ReservationForm.get('departureDate')?.hasError('required')){
      return 'you must select a date';
    }
    else if (this.ReservationForm.get('departureDate')?.invalid){
      return 'invalid date selected';
    }
    return;
  }

  public getFormFirstNameErrorMessage() {
    if (this.ReservationForm.get('firstName')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.ReservationForm.get('firstName')?.hasError('minlength')){
      return 'enter at least 3 characters';
    }
    else if (this.ReservationForm.get('firstName')?.invalid){
      return 'only alphabetical characters are allowed';
    }
    return;
  }

  public getFormEmailErrorMessage() {
    if (this.ReservationForm.get('email')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.ReservationForm.get('email')?.hasError('email')){
      return 'invalid email';
    }
    return;
  }

  public getFormLastNameErrorMessage() {
    if (this.ReservationForm.get('lastName')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.ReservationForm.get('lastName')?.hasError('minlength')){
      return 'enter at least 3 characters';
    }
    else if (this.ReservationForm.get('lastName')?.invalid){
      return 'only alphabetical characters are allowed';
    }
    return;
  }

  public getFormPhoneNumberErrorMessage() {
    if (this.ReservationForm.get('phoneNumber')?.hasError('minlength')){
      return 'enter at least 5 digits';
    }
    else if (this.ReservationForm.get('phoneNumber')?.invalid){
      return 'only digits are allowed';
    }
    return;
  }

  public onSuccessfulReservation(): void{
    let dialogRef: MatDialogRef<OfferReservation> = this.injector.get(MatDialogRef);
    let router: Router = this.injector.get(Router);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Reservation was successful',
      showConfirmButton: false,
      timer: 2000
    }).then(function(){
      dialogRef.close();
      router.navigate(['account'], {
        queryParams: {'section': 'reservations'},
      });
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
    this.getUserDetails();
    this.getLodgingOfferForReservation();
  }


}
