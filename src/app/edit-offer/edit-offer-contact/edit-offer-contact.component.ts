import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {OfferContact} from "../../entities/offerContact";

@Component({
  selector: 'app-edit-offer-contact',
  templateUrl: './edit-offer-contact.component.html',
  styleUrls: ['./edit-offer-contact.component.scss']
})
export class EditOfferContactComponent implements OnInit, OnChanges {

  constructor(
    private formBuilder: FormBuilder) {
  }

  ContactForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.minLength(5), Validators.pattern("^[0-9]*$")]]
  })

  @Output() isContactValidEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() contactDetailsEvent: EventEmitter<OfferContact> = new EventEmitter<OfferContact>();
  @Input() contactDetails: OfferContact | undefined;

  private setInitialFormValues() {
    if (this.contactDetails !== undefined) {
      this.ContactForm.patchValue({
        email: this.contactDetails.email,
        phoneNumber: this.contactDetails.phoneNumber
      })
    }
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

  getFormPhoneNumberErrorMessage() {
    if (this.ContactForm.get('phoneNumber')?.hasError('minlength')){
      return 'enter at least 5 digits';
    }
    else if (this.ContactForm.get('phoneNumber')?.invalid){
      return 'only digits are allowed';
    }
    return;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setInitialFormValues();
  }

  ngOnInit(): void {
  }

}
