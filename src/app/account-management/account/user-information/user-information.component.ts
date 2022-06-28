import { Component, OnInit } from '@angular/core';
import {UserDTO} from "../../../entities/userDTO";
import {UserService} from "../../../services/user/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit {

  isFormEditable: boolean = false;
  loggedInUser: UserDTO | undefined;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder) { }

  UserDetailsForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(?:[a-zA-Z\s]+)?$/)]],
    lastName:['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(?:[a-zA-Z\s]+)?$/)]],
    gender:[],
    email:[], // cannot be edited so no validators
    phoneNumber:['', [Validators.minLength(5), Validators.pattern("^[0-9]*$")]],
  })

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

  public setInitialFormValues(user: UserDTO) {
    let phoneNumber: string;
    if (user.phoneNumber === null || user.phoneNumber === undefined || user.phoneNumber === ''){
      phoneNumber = 'Not Provided';
    } else {
      phoneNumber = user.phoneNumber;
    }

    this.UserDetailsForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      email: user.email,
      phoneNumber: phoneNumber,
    })
  }

  onChangeProfile() {
    this.toggleEditableForm();
    let phoneNumber: string = this.UserDetailsForm.get('phoneNumber')?.value;
    if (phoneNumber === 'Not Provided'){
      this.UserDetailsForm.get('phoneNumber')?.reset();
    }
  }

  onCancelProfile() {
    this.toggleEditableForm();
    this.setInitialFormValues(this.loggedInUser!);

  }

  public toggleEditableForm(): void {
    this.isFormEditable = !this.isFormEditable;
    if (this.isFormEditable){
      this.UserDetailsForm.controls['firstName'].enable();
      this.UserDetailsForm.controls['lastName'].enable();
      this.UserDetailsForm.controls['phoneNumber'].enable();
      this.UserDetailsForm.controls['gender'].enable();
    } else {
      this.UserDetailsForm.disable();
    }
  }

  public onSaveProfile(editUserForm: FormGroup): void{
    this.userService.editUser(editUserForm.value).subscribe(
      () => {
        this.onSuccess();
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )
  }

  public onSuccess(): void {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your profile was updated',
      showConfirmButton: false,
      timer: 2000
    }).then(function(){
      window.location.reload();
    })
  }

  getFormFirstNameErrorMessage() {
    if (this.UserDetailsForm.get('firstName')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.UserDetailsForm.get('firstName')?.hasError('minlength')){
      return 'enter at least 3 characters';
    }
    else if (this.UserDetailsForm.get('firstName')?.invalid){
      return 'only alphabetical characters are allowed';
    }
    return;
  }

  getFormLastNameErrorMessage() {
    if (this.UserDetailsForm.get('lastName')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.UserDetailsForm.get('lastName')?.hasError('minlength')){
      return 'enter at least 3 characters';
    }
    else if (this.UserDetailsForm.get('lastName')?.invalid){
      return 'only alphabetical characters are allowed';
    }
    return;
  }

  getFormPhoneNumberErrorMessage() {
    if (this.UserDetailsForm.get('phoneNumber')?.hasError('minlength')){
      return 'enter at least 5 digits';
    }
    else if (this.UserDetailsForm.get('phoneNumber')?.invalid){
      return 'only digits are allowed';
    }
    return;
  }

  ngOnInit(): void {
    this.getLoggedInUser();
    this.UserDetailsForm.disable();
  }

}
