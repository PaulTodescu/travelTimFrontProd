import {Component, Inject, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BusinessService} from "../../services/business/business.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Business} from "../../entities/business";
import {HttpErrorResponse} from "@angular/common/http";
import {LocationService} from "../../services/location/location.service";
import Swal from "sweetalert2";
import {ImageService} from "../../services/image/image.service";
import {DaySchedule} from "../../entities/daySchedule";
import {BusinessScheduleComponent} from "../business-schedule/business-schedule.component";
import {EditBusinessScheduleComponent} from "../edit-business-schedule/edit-business-schedule.component";
import {BusinessFormDetails} from "../add-business/add-business.component";

@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.component.html',
  styleUrls: ['./edit-business.component.scss']
})
export class EditBusinessComponent implements OnInit {

  businessToEdit: Business | undefined;
  schedule: DaySchedule[] | undefined;
  cities: string[] | undefined;

  imageFiles: File[] = [];
  imageNames: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private businessService: BusinessService,
    private locationService: LocationService,
    private imageService: ImageService,
    private dialog: MatDialog,
    private injector: Injector,
    @Inject(MAT_DIALOG_DATA) public data: { businessId: number }) { }

  editBusinessForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)]],
    city: [],
    address:['', [Validators.required, Validators.minLength(5)]],
    email: [undefined, [Validators.email]],
    phoneNumber: [undefined, [Validators.minLength(5), Validators.pattern("^[0-9]*$")]]
  })

  websiteLink: string | undefined;
  facebookLink: string | undefined;
  twitterLink: string | undefined;

  private getBusinessToEdit(businessId: number): void {
    this.businessService.getBusinessById(businessId).subscribe(
      (response: Business) => {
        this.businessToEdit = response;
        this.setInitialValues(response);
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )
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

  public setInitialValues(business: Business): void {
    this.editBusinessForm.patchValue({
      name: business.name,
      city: business.city,
      address: business.address,
      email: business.email,
      phoneNumber: business.phoneNumber
    })
    this.websiteLink = business.websiteLink;
    this.facebookLink = business.facebookLink;
    this.twitterLink = business.twitterLink;
    this.schedule = business.schedule;
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

  private getInitialImages(businessId: any) {
    this.imageService.getBusinessImagesNames(businessId).subscribe(
      (response: string[]) => {
        this.imageNames = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }


  public openEditScheduleDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-class' // in styles.css
    dialogConfig.data = {
      schedule: this.schedule
    }
    const dialogRef = this.dialog.open(EditBusinessScheduleComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        this.schedule = res.schedule;
      }
    })
  }

  public editSchedule(businessId: number): void {
    if (this.schedule !== undefined){
      this.businessService.addBusinessSchedule(businessId, this.schedule).subscribe(
        () => {},
        (error: HttpErrorResponse) => {
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

  public deleteSchedule(): void {
    this.schedule = [];
  }

  public selectImages(event: any): void {
    if (event.target.files.length > 0 && event.target.files[0]) {
      this.imageNames = [];
      this.imageFiles = [];
      let numberImages = event.target.files.length;
      for (let i = 0; i < numberImages; i++) {
        this.imageNames.push(event.target.files[i].name);
        this.imageFiles.push(event.target.files[i]);
      }
    }
  }

  public getSelectedImages(): string {
    let result: string = '';
    for (let image of this.imageNames) {
      result = result + image + '\n';
    }
    return result;
  }

  public uploadImages(images: File[], businessId: number): void {
    if (images.length > 0) {
      this.imageService.uploadBusinessImages(images, businessId).subscribe(
        () => {
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public editBusiness(editBusinessForm: FormGroup): void {
    if (this.businessToEdit !== undefined) {
      let businessFormValue: BusinessFormDetails = editBusinessForm.value;
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
      this.businessService.editBusiness(business, this.businessToEdit.id).subscribe(
        () => {
          this.uploadImages(this.imageFiles, this.data.businessId);
          this.editSchedule(this.data.businessId);
          this.onSuccess('Business was updated');
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public onSuccess(message: string){
    let dialogRef: MatDialogRef<EditBusinessComponent> = this.injector.get(MatDialogRef);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      showCancelButton: false,
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
    if (this.editBusinessForm.get('name')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.editBusinessForm.get('name')?.hasError('minlength')){
      return 'enter at least 3 characters';
    }
    else if (this.editBusinessForm.get('name')?.invalid){
      return 'only alphabetical characters and digits are allowed';
    }
    return;
  }
  getFormEmailErrorMessage() {
    if (this.editBusinessForm.get('email')?.hasError('email')){
      return 'invalid email';
    }
    return;
  }

  public getFormPhoneNumberErrorMessage() {
    if (this.editBusinessForm.get('phoneNumber')?.hasError('minlength')){
      return 'enter at least 5 digits';
    }
    else if (this.editBusinessForm.get('phoneNumber')?.invalid){
      return 'only digits are allowed';
    }
    return;
  }

  getFormAddressErrorMessage() {
    if (this.editBusinessForm.get('address')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.editBusinessForm.get('address')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  ngOnInit(): void {
    this.getBusinessToEdit(this.data.businessId);
    this.getInitialImages(this.data.businessId);
    this.getCities();
  }

}
