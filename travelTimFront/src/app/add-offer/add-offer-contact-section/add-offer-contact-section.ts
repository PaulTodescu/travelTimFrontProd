import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserDTO} from "../../entities/userDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-add-offer-contact-section',
  templateUrl: './add-offer-contact-section.html',
  styleUrls: ['./add-offer-contact-section.scss']
})
export class AddOfferContactSection implements OnInit {

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder) { }

  loggedInUser: UserDTO | undefined;

  ContactForm = this.formBuilder.group({
    email: [],
    phoneNumber: ['', [Validators.minLength(5), Validators.pattern("^[0-9]*$")]]
  })

  @Output() phoneNumberEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() phoneNumberValidityEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public getLoggedInUser(): void{
    this.userService.getLoggedInUser().subscribe(
      (response: UserDTO) => {
        this.loggedInUser = response
        this.setInitialFormValues(response);
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )
  }

  private setInitialFormValues(user: UserDTO) {
    this.ContactForm.patchValue({
      email: user.email,
      phoneNumber: user.phoneNumber
    })
  }

  // sends phone number to AddOfferContainer component
  public sendPhoneNumber(): void{
    let phoneNumber = this.ContactForm.get("phoneNumber")?.value;
    let isPhoneNumberValid = this.ContactForm.get("phoneNumber")?.valid;
    if (isPhoneNumberValid) {
      this.phoneNumberEvent.emit(phoneNumber);
      this.phoneNumberValidityEvent.emit(true);
    } else {
      this.phoneNumberValidityEvent.emit(false);
    }
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

  ngOnInit(): void {
    this.getLoggedInUser();
    this.ContactForm.get("email")?.disable();
  }
}
