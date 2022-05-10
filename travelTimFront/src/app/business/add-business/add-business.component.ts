import {Component, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocationService} from "../../services/location/location.service";
import {HttpErrorResponse} from "@angular/common/http";
import {BusinessService} from "../../services/business/business.service";
import Swal from "sweetalert2";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {ImageService} from "../../services/image/image.service";
import {AddBusinessScheduleComponent} from "../add-business-schedule/add-business-schedule.component";
import {DaySchedule} from "../../entities/daySchedule";
import {BusinessScheduleComponent} from "../business-schedule/business-schedule.component";
import {Business} from "../../entities/business";

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})
export class AddBusinessComponent implements OnInit {

  cities: string[] | undefined;

  images : string[] = [];
  imageFiles: File[] = [];

  schedule: DaySchedule[] | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private businessService: BusinessService,
    private imageService: ImageService,
    private dialog: MatDialog,
    private injector: Injector) { }

  addBusinessForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)]],
    city: ['', [Validators.required]],
    address:['', [Validators.required, Validators.minLength(5)]],
    email: [undefined, [Validators.email]],
    phoneNumber: [undefined, [Validators.minLength(5), Validators.pattern("^[0-9]*$")]]
  })

  websiteLink: string | undefined;
  facebookLink: string | undefined;
  twitterLink: string | undefined;

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

  public addBusiness(businessForm: FormGroup): void{
   let businessFormValue: BusinessFormDetails = businessForm.value;
   let business: Business = new Business(
     NaN,
     businessFormValue.name,
     businessFormValue.city,
     businessFormValue.address,
     businessFormValue.email,
     businessFormValue.phoneNumber,
     this.websiteLink,
     this.facebookLink,
     this.twitterLink,
     []
   )
    if (business.email?.length === 0){
      business.email = undefined;
    }
    if (business.phoneNumber?.length === 0){
      business.phoneNumber = undefined;
    }
    if (business.websiteLink === undefined){
      business.websiteLink = undefined;
    }
    if (business.facebookLink === undefined){
      business.facebookLink = undefined;
    }
    if (business.twitterLink === undefined){
      business.twitterLink = undefined;
    }
    this.businessService.addBusiness(business).subscribe(
      (businessId: number) => {
        this.uploadImages(this.imageFiles, businessId);
        this.addSchedule(businessId);
        this.onSuccess("Business added successfully");
      },
      () => {
        this.onFail("Something went wrong. Try again later.")
      }
    )
  }

  public addWebsiteLink(): void {
    Swal.fire({
      inputPlaceholder: 'Website Link',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Add',
      focusConfirm: false,
      focusCancel: false,
      confirmButtonColor: '#034953',
      cancelButtonColor: '#696969',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isValidUrl(result.value)) {
          this.websiteLink = result.value;
        } else {
          this.onFail("Invalid Url Added");
        }
      }
    })
  }

  public getWebsiteLinkTooltip(): string {
    if (this.websiteLink){
      return this.websiteLink;
    }
    return 'Add Website Link'
  }

  public addFacebookLink(): void {
    Swal.fire({
      inputPlaceholder: 'Facebook Link',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Add',
      focusConfirm: false,
      focusCancel: false,
      confirmButtonColor: '#034953',
      cancelButtonColor: '#696969',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isValidUrl(result.value, 'facebook')) {
          this.facebookLink = result.value;
        } else {
          this.onFail("Invalid Url Added");
        }
      }
    })
  }

  public getFacebookLinkTooltip(): string {
    if (this.facebookLink){
      return this.facebookLink;
    }
    return 'Add Facebook Link'
  }

  public addTwitterLink(): void {
    Swal.fire({
      inputPlaceholder: 'Twitter Link',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Add',
      focusConfirm: false,
      focusCancel: false,
      confirmButtonColor: '#034953',
      cancelButtonColor: '#696969',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isValidUrl(result.value, 'twitter')) {
          this.twitterLink = result.value;
        } else {
          this.onFail("Invalid Url Added");
        }
      }
    })
  }

  public getTwitterLinkTooltip(): string {
    if (this.twitterLink){
      return this.twitterLink;
    }
    return 'Add Twitter Link'
  }

  public isValidUrl(url_string: string, url_type: string = ''): boolean {
    if (url_string.length === 0){
      return true;
    }
    let url;
    try {
      url = new URL(url_string);
    } catch (_) {
      return false;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }
    if (url_type === 'facebook') {
      return url.hostname === 'www.facebook.com';
    }
    else if (url_type === 'twitter') {
      return url.hostname === 'twitter.com';
    }
    return true;
  }

  public openAddScheduleDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-class' // in styles.css
    const dialogRef = this.dialog.open(AddBusinessScheduleComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        this.schedule = res.schedule;
      }
    })
  }

  public addSchedule(businessId: number): void {
    if (this.schedule !== undefined){
      this.businessService.addBusinessSchedule(businessId, this.schedule).subscribe(
        () => {}, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public seeSchedule(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'dialog-class' // in styles.css
    dialogConfig.data = {
      schedule: this.schedule
    }
    this.dialog.open(BusinessScheduleComponent, dialogConfig);
  }

  public selectImages(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.images = [];
      this.imageFiles = [];
      let numberImages = event.target.files.length;
      for (let i = 0; i < numberImages; i++) {
        let reader = new FileReader();
        reader.onload = (event:any) => {
          this.images.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
        this.imageFiles.push(event.target.files[i]);
      }
    }
  }

  public getSelectedImages(): string {
    let result: string = '';
    for (let image of this.imageFiles){
      result = result + image.name + '\n';
    }
    return result;
  }

  public uploadImages(images: File[], businessId: number): void {
    this.imageService.uploadBusinessImages(images, businessId).subscribe(
      () => {},
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onSuccess(message: string): void{
    let dialogRef: MatDialogRef<AddBusinessComponent> = this.injector.get(MatDialogRef);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000
    }).then(function(){
      dialogRef.close();
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

  getFormNameErrorMessage() {
    if (this.addBusinessForm.get('name')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.addBusinessForm.get('name')?.hasError('minlength')){
      return 'enter at least 3 characters';
    }
    else if (this.addBusinessForm.get('name')?.invalid){
      return 'only alphabetical characters and digits are allowed';
    }
    return;
  }

  getFormCityErrorMessage() {
    if (this.addBusinessForm.get('city')?.hasError('required')){
      return 'you must select a value';
    }
    return;
  }

  getFormAddressErrorMessage() {
    if (this.addBusinessForm.get('address')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.addBusinessForm.get('address')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  getFormEmailErrorMessage() {
    if (this.addBusinessForm.get('email')?.hasError('email')){
      return 'invalid email';
    }
    return;
  }

  public getFormPhoneNumberErrorMessage() {
    if (this.addBusinessForm.get('phoneNumber')?.hasError('minlength')){
      return 'enter at least 5 digits';
    }
    else if (this.addBusinessForm.get('phoneNumber')?.invalid){
      return 'only digits are allowed';
    }
    return;
  }

  ngOnInit(): void {
    this.getCities();
  }
}

export interface BusinessFormDetails {
  name: string;
  city: string;
  address: string;
  email: string | undefined;
  phoneNumber: string | undefined;
}

