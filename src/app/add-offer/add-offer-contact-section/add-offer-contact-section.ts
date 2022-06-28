import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserDTO} from "../../entities/userDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../services/user/user.service";
import {OfferContact} from "../../entities/offerContact";
import {Business} from "../../entities/business";

@Component({
  selector: 'app-add-offer-contact-section',
  templateUrl: './add-offer-contact-section.html',
  styleUrls: ['./add-offer-contact-section.scss']
})
export class AddOfferContactSection implements OnInit, OnChanges {

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder) {
  }

  user: UserDTO | undefined;

  @Input() business: Business | undefined;

  contactDetails: OfferContact | undefined;

  ContactForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.minLength(5), Validators.pattern("^[0-9]*$")]]
  })

  @Output() isContactValidEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() contactDetailsEvent: EventEmitter<OfferContact> = new EventEmitter<OfferContact>();

  public getLoggedInUser(): void{
    this.userService.getLoggedInUser().subscribe(
      (response: UserDTO) => {
        this.user = response
        this.setFormValues(response.email, response.phoneNumber);
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )
  }

  private setFormValues(email: string | undefined, phoneNumber: string | undefined) {
    this.ContactForm.patchValue({
      email: email,
      phoneNumber: phoneNumber
    })
    this.sendContactDetails();
  }

  public sendContactFormValidity(){
    if (this.ContactForm.get('email')?.valid && this.ContactForm.get('phoneNumber')?.valid){
      this.isContactValidEvent.emit(true);
    } else {
      this.isContactValidEvent.emit(false);
    }
  }

  public sendContactDetails(): void {
    this.sendContactFormValidity();
    let email = this.ContactForm.get('email')?.value;
    let phoneNumber = this.ContactForm.get('phoneNumber')?.value;
    if (email !== undefined && phoneNumber !== undefined){
      let contactDetails = new OfferContact(email, phoneNumber);
      this.contactDetailsEvent.emit(contactDetails);
    }
  }

  public getFormEmailErrorMessage() {
    if (this.ContactForm.get('email')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.ContactForm.get('email')?.hasError('email')){
      return 'invalid email';
    }
    return;
  }

  public getFormPhoneNumberErrorMessage() {
    if (this.ContactForm.get('phoneNumber')?.hasError('minlength')){
      return 'enter at least 5 digits';
    }
    else if (this.ContactForm.get('phoneNumber')?.invalid){
      return 'only digits are allowed';
    }
    return;
  }

  ngOnInit(): void {
    this.getLoggedInUser();
  }

  // when user selects a business, complete with business contact details,
  // otherwise with user contact details
  ngOnChanges(changes: SimpleChanges): void {
    if (this.business){
      this.setFormValues(this.business?.email, this.business?.phoneNumber)
    } else {
      this.setFormValues(this.user?.email, this.user?.phoneNumber);
    }
  }
}
