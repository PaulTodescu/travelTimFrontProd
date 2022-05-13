import {Component, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {UserDTO} from "../../entities/userDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {LodgingService} from "../../services/lodging/lodging.service";
import {LodgingOfferDetailsDTO} from "../../entities/lodgingOfferDetailsDTO";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DaySchedule} from "../../entities/daySchedule";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-offer-reservation',
  templateUrl: './offer-reservation.component.html',
  styleUrls: ['./offer-reservation.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class OfferReservationComponent implements OnInit {

  @ViewChild("arrivalDatePicker") arrivalDatePicker: any;

  offer: LodgingOfferDetailsDTO | undefined;
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
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { offer: LodgingOfferDetailsDTO },
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        this.offerType = data.type;
      });
    this.offer = this.data.offer;
    this.totalPrice = this.data.offer.price;
    if (this.offerType === 'legal'){
      this.getBusinessScheduleForLegalLodgingOffer(this.offer.id);
    }
    let date = new Date();
    this.minDepartureDate.setDate(date.getDate() + 1);
    this.maxArrivalDate = new Date(date.getFullYear(), date.getMonth() + 2, 0);
    this.maxDepartureDate = new Date(date.getFullYear(), date.getMonth() + 2, 0);
  }

  ReservationForm = this.formBuilder.group({
    arrivalDate:['', Validators.required],
    arrivalTime:[''],
    departureDate:['', Validators.required],
    firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(?:[a-zA-Z\s]+)?$/)]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(?:[a-zA-Z\s]+)?$/)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.minLength(5), Validators.pattern("^[0-9]*$")]]
  })

  public getUserDetails(){
    this.userService.getLoggedInUser().subscribe(
      (response: UserDTO) => {
        this.setUserFormValues(response);
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

  public openArrivalDatePicker(): void {
    this.arrivalDatePicker.open();
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
    let weekdays: string[] = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return weekdays[date.getDay()];
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

  ngOnInit(): void {
    this.getUserDetails();
  }


}
