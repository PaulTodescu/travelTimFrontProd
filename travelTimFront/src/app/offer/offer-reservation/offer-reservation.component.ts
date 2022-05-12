import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {UserDTO} from "../../entities/userDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-offer-reservation',
  templateUrl: './offer-reservation.component.html',
  styleUrls: ['./offer-reservation.component.scss'],
})
export class OfferReservationComponent implements OnInit {

  minDate: Date;
  maxDate: Date;
  user: UserDTO | undefined;

  @ViewChild('arrivalDatePicker') arrivalDatePicker: any;
  @ViewChild('departureDatePicker') departureDatePicker: any;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder) {
    let date = new Date();
    this.minDate = date;
    this.maxDate = new Date(date.getFullYear(), date.getMonth() + 2, 0);
  }

  ReservationForm = this.formBuilder.group({
    arrivalDate:['', Validators.required],
    arrivalTime:[''],
    departureDate:['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    phoneNumber: ['', [Validators.minLength(5), Validators.pattern("^[0-9]*$")]]
  })

  public getUserDetails(){
    this.userService.getLoggedInUser().subscribe(
      (response: UserDTO) => {
        this.user = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public openArrivalDatePicker(): void {
    this.arrivalDatePicker.open();
  }

  public openDepartureDatePicker(): void {
    this.departureDatePicker.open();
  }


  ngOnInit(): void {
    this.ReservationForm.get("arrivalDate")?.disable();
    this.ReservationForm.get("arrivalTime")?.disable();
    this.ReservationForm.get("departureDate")?.disable();
    this.getUserDetails();
  }

}
